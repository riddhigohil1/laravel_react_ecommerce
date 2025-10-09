import CurrencyFormatter from '@/components/CurrencyFormatter';
import { productRoute } from '@/helpers';
import cart from '@/routes/cart';
import { CartItem as CartItemType } from '@/types';
import { Link, router, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function CartItem({ item }: { item: CartItemType }) {
    const deleteForm = useForm({
        options_ids: item.option_ids,
    });

    const [error, setError] = useState('');

    const onDeleteClick = () => {
        deleteForm.delete(cart.destroy(item.product_id), {
            preserveScroll: true,
        });
    };

    const handleQuantityChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
        setError('');
        router.put(
            cart.update(item.product_id),
            {
                quantity: ev.target.value,
                options_ids: item.option_ids,
            },
            {
                preserveScroll: true,
                onError: (errors) => {
                    setError(Object.values(error)[0]);
                },
            },
        );
    };

    return (
        <>
            <div className="flex gap-6 p-3" key={item.id}>
                <Link
                    href={productRoute(item)}
                    className="flex w-32 min-w-32 justify-center self-start"
                >
                    <img
                        src={item.image}
                        alt=""
                        className="max-h-full max-w-full"
                    />
                </Link>
                <div className="flex flex-1 flex-col">
                    <div className="flex-1">
                        <h3 className="forn-semibold mb-3 text-sm">
                            <Link href={productRoute(item)}>{item.title}</Link>
                        </h3>
                        <div className="text-xs">
                            {item.options.map((option) => (
                                <div key={option.id}>
                                    <strong className="text-bold">
                                        {option.type.name}
                                    </strong>
                                    {option.name}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                        <div className="text-sm">Quantity:</div>
                        <div
                            className={
                                error
                                    ? 'tooltip-open tooltip tooltip-error'
                                    : ''
                            }
                            data-tip={error}
                        >
                            <input
                                type="number"
                                defaultValue={item.quantity}
                                onBlur={handleQuantityChange}
                                className="input-sm w-16"
                            />
                        </div>
                        <button
                            onClick={() => onDeleteClick()}
                            className="btn btn-ghost"
                        >
                            Delete
                        </button>
                        <button className="btn btn-ghost">
                            Save for Later
                        </button>
                    </div>
                    <div className="text-lg font-bold">
                        <CurrencyFormatter
                            amount={item.price * item.quantity}
                        />
                    </div>
                </div>
            </div>
            <div className="divider"></div>
        </>
    );
}
