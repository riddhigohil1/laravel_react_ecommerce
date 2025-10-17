<?php

namespace App\Http\Controllers;

use App\Enum\OrderStatusEnum;
use App\Http\Resources\OrderViewResource;
use App\Mail\CheckoutCompleted;
use App\Mail\NewOrderMail;
use App\Models\CartItem;
use App\Models\Order;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Inertia\Inertia;
use Stripe\Exception\SignatureVerificationException;
use Stripe\StripeClient;
use Stripe\Webhook;

class StripController extends Controller
{
    public function success(Request $request)
    {
        $user = auth()->user();
        $sessionId= $request->get('session_id');
        $orders = Order::where('stripe_session_id', $sessionId)
                    ->get();
        if($orders->count() === 0)
            abort(404);
        
        foreach($orders as $order)
        {
            if($order->user_id !== $user->id)
                abort(403);
        }
        
       return Inertia::render('Cart/Sucess', [
        'orders' => OrderViewResource::collection($orders)->toArray($request),
       ]);
    }

    public function failure()
    {

    }

    public function webhook(Request $request)
    {
        $strip = new StripeClient(config('app.stripe_secret_key'));
        $endpoint_secret = config('app.stripe_webhook_secret');

        $payload = $request->getContent();
        $sig_header = request()->header('Stripe-Signature');
        $event = null;

        try{
            $event = Webhook::constructEvent($payload, $sig_header, $endpoint_secret);
        }
        catch(Exception $e){
            Log::error($e);
            return response('Invalid Payload', 400);
        }
        catch(SignatureVerificationException $e){
            Log::error($e);
            return response('Invalid Payload', 400);
        };

        switch($event->type)
        {
            case 'charge.updated':
                $charge = $event->data->object;
                $transactionId = $charge['balance_transaction'];
                $paymentIntent = $charge['payment_intent'];
                $balanceTransaction = $strip->balanceTransactions->retrieve($transactionId);

                $orders = Order::where('payment_intent', $paymentIntent)->get();

                $totalAmount = $balanceTransaction['amount'];
                $stripeFee = 0;

                foreach($balanceTransaction['fee_details'] as $feeDetail)
                {
                    if($feeDetail['type'] === 'stripe_fee')
                        $stripeFee = $feeDetail['amount'];
                }

                $plateFormFeePercent = config('app.platform_fee_pct');

                foreach($orders as $order)
                {   
                    $vendorShare = $order->total_price / $totalAmount;

                    $order->online_payment_commission = $vendorShare*$stripeFee;
                    $order->website_commission = ($order->total_price - $order->online_payment_commission) / 100 * $plateFormFeePercent;
                    $order->vendor_subtotal = $order->total_price - $order->online_payment_commission - $order->website_commission;

                    $order->save();

                    // Send email to vendor
                    Mail::to($order->vendorUser)->send(new NewOrderMail($order));
                }

                // Send email to buyer
                Mail::to($orders[0]->user)->send(new CheckoutCompleted($orders));

            case 'checkout.session.completed':
                $session = $event->data->object;
                $paymentIntent = $session['payment_intent'];

                $orders = Order::query()
                        ->with(['orderItems'])
                        ->where(['stripe_session_id' => $session['id']])
                        ->get();

                $productToDeleteFromCart = [];
                $userId = 0;
                foreach($orders as $order)
                {
                    $userId = $order->user_id;
                    $order->payment_intent = $paymentIntent;
                    $order->status = OrderStatusEnum::Paid;
                    $order->save();

                    $productToDeleteFromCart = [
                        ...$productToDeleteFromCart,
                        ...$order->orderItems->map(fn($item) => $item->product_id)->toArray(),
                    ];

                    foreach($order->orderItems as $orderItem)
                    {
                        $options = $orderItem->variation_type_option_ids;
                        $product = $orderItem->product;
                        if($options)
                        {
                            sort($options);
                            $variation = $product->variations()
                                ->where('variation_type_option_ids', $options)
                                ->first();

                            if($variation && $variation->quantity != null)
                            {
                                $variation->quantity -= $orderItem->quantity;
                                $variation->save();
                            }
                        }
                        else if ($product->quantity != null)
                        {
                            $product->quantity -= $orderItem->quantity;
                            $product->save();
                        }
                    }
                }

                CartItem::query()
                    ->where('user_id', $userId)
                    ->whereIn('product_id', $productToDeleteFromCart)
                    ->where('saved_for_later', false)
                    ->delete();
                
            default:
                echo 'Received unknown event type '.$event->type;
        }

        return response('', 200);
    }
}
