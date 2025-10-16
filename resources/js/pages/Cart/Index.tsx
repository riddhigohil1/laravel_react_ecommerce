import { checkout } from '@/actions/App/Http/Controllers/CartController';
import CurrencyFormatter from '@/components/CurrencyFormatter';
import Header from '@/layouts/Header';
import { GroupedCartItem, SharedData } from '@/types';
import { CreditCardIcon } from '@heroicons/react/24/outline';
import { Link, usePage } from '@inertiajs/react';
import CartItem from './CartItem';

export default function Index() {
    type PageProps = SharedData & {
        cartItems: Record<number, GroupedCartItem>;
    };
    const { csrf_token, cartItems, totalPrice, totalQuantity } =
        usePage<PageProps>().props;

    return (
        <div>
            <Header title="Your Cart" />
            <div className="container mx-auto flex flex-col gap-4 p-8 lg:flex-row">
                <div className="card order-2 flex-1 bg-white lg:order-1 dark:bg-gray-800">
                    <div className="card-body">
                        <h2 className="text-lg font-bold">Shopping Cart</h2>
                        <div className="my-4">
                            {Object.keys(cartItems).length === 0 ? (
                                <div className="py-2 text-center text-gray-500">
                                    You dont' have any item in Cart.
                                </div>
                            ) : (
                                Object.values(cartItems).map((cartItem) => (
                                    <div key={cartItem.user.id}>
                                        <div className="item-center mb-4 flex justify-between border-b border-gray-300 pb-4">
                                            <Link
                                                href="/"
                                                className="underline"
                                            >
                                                {cartItem.user.name}
                                            </Link>
                                            <div>
                                                <form action="" method="post">
                                                    <input
                                                        type="hidden"
                                                        name="_token"
                                                        value={csrf_token}
                                                    />
                                                    <input
                                                        type="hidden"
                                                        name="vendor_id"
                                                        value={cartItem.user.id}
                                                    />
                                                    <button className="btn btn-ghost btn-sm">
                                                        <CreditCardIcon className="size-6" />
                                                        Pay Only for this seller
                                                    </button>
                                                </form>
                                            </div>
                                        </div>
                                        {cartItem.items.map((item) => (
                                            <CartItem
                                                item={item}
                                                key={item.id}
                                            />
                                        ))}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
                <div className="card order-1 bg-white lg:order-2 lg:min-w-[260px] dark:bg-gray-800">
                    <div className="card-body">
                        Subtotal ({totalQuantity} items): &nbsp;
                        <CurrencyFormatter amount={totalPrice} />
                        <form {...checkout.form()}>
                            <input
                                type="hidden"
                                name="_token"
                                value={csrf_token}
                            />
                            <button className="btn rounded-full bg-indigo-600 px-5 py-2 text-sm leading-5 font-semibold text-white hover:not-focus:bg-indigo-700 focus:outline focus:outline-violet-300 active:bg-violet-700">
                                <CreditCardIcon className="size-6" />
                                Proceed to Checkout
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
