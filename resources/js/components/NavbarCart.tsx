import cart from '@/routes/cart';
import { type SharedData } from '@/types';
import { Link, usePage } from '@inertiajs/react';

import { productRoute } from '@/helpers';
import CurrencyFormatter from './CurrencyFormatter';

export default function NavbarCart() {
    const { auth, totalQuantity, totalPrice, minCartItems } =
        usePage<SharedData>().props;
    return (
        <div className="dropdown dropdown-end">
            <div
                tabIndex={0}
                role="button"
                className="btn btn-circle btn-ghost"
            >
                <div className="indicator">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                    </svg>
                    <span className="indicator-item badge badge-sm">
                        {totalQuantity}
                    </span>
                </div>
            </div>
            <div
                tabIndex={0}
                className="card-compact dropdown-content card z-1 mt-3 w-[480px] bg-base-100 shadow"
            >
                <div className="card-body">
                    <span className="text-lg font-bold">
                        {totalQuantity} Items
                    </span>
                    <div className="my-4 max-h-[300px] overflow-auto">
                        {minCartItems.length === 0 && (
                            <div className="py-2 text-center text-gray-500">
                                You dont' have any item in Cart.
                            </div>
                        )}
                        {minCartItems.map((item) => (
                            <div key={item.id} className="flex gap-4 p-3">
                                <Link
                                    href={productRoute(item)}
                                    className="flex h-16 w-16 justify-center"
                                >
                                    <img
                                        src={item.image}
                                        alt={item.title}
                                        className="max-h-full max-w-full"
                                    />
                                </Link>
                                <div className="flex-1">
                                    <h3 className="mb-3 font-semibold">
                                        <Link href={productRoute(item)}>
                                            {item.title}
                                        </Link>
                                    </h3>
                                    <div className="flex justify-between text-sm">
                                        <div>Quantity : {item.quantity}</div>
                                        <div>
                                            <CurrencyFormatter
                                                amount={
                                                    item.quantity * item.price
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <span className="text-lg">
                        Subtotal:&nbsp;
                        <CurrencyFormatter amount={totalPrice} />
                    </span>
                    <div className="card-actions">
                        <Link
                            href={cart.index()}
                            className="btn btn-block btn-primary"
                        >
                            View cart
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
