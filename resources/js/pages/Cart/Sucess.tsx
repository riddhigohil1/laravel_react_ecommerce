import CurrencyFormatter from '@/components/CurrencyFormatter';
import Header from '@/layouts/Header';
import { Order } from '@/types';
import { Link } from '@inertiajs/react';
import { CheckCircleIcon } from 'lucide-react';

export default function Sucess({ orders }: { orders: Order[] }) {
    return (
        <div>
            <Header title="Your Cart" />

            <div className="mx-auto w-[480px] px-4 py-8">
                <div className="flex flex-col items-center gap-2">
                    <div className="text-6xl text-emerald-600">
                        <CheckCircleIcon className={'size-24'} />
                    </div>
                    <div className="text-3xl">Payment was completed</div>
                </div>

                <div className="my-6 text-lg">
                    Thanks for your purchase. Your payment was completed
                    successfully.
                </div>
                {orders.map((order) => (
                    <div
                        key={order.id}
                        className="mb-4 rounded-lg bg-white p-6 dark:bg-gray-800"
                    >
                        <h3 className="mb-3 text-3xl">Order Summary</h3>
                        <div className="mb-2 flex justify-between font-bold">
                            <div className="text-gray-400">Seller</div>
                            <div>
                                <Link href="#" className="hover:underline">
                                    {order.vendorUser.data.store_name}
                                </Link>
                            </div>
                        </div>

                        <div className="mb-2 flex justify-between">
                            <div className="text-gray-400">Order Number</div>
                            <div>
                                <Link href="#" className="hover:underline">
                                    #{order.id}
                                </Link>
                            </div>
                        </div>

                        <div className="mb-3 flex justify-between">
                            <div className="text-gray-400">Items</div>
                            <div>{order.orderItems.length}</div>
                        </div>

                        <div className="mb-3 flex justify-between">
                            <div className="text-gray-400">Total</div>
                            <div>
                                <CurrencyFormatter amount={order.total_price} />
                            </div>
                        </div>

                        <div className="mb-4 flex justify-between">
                            <Link href="#" className="btn btn-primary">
                                View Order Details
                            </Link>
                            <Link href="/" className="btn">
                                Back to home
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
