import { store } from '@/actions/App/Http/Controllers/CartController';
import { show } from '@/actions/App/Http/Controllers/ProductController';
import CurrencyFormatter from '@/components/CurrencyFormatter';
import { Button } from '@/components/ui/button';
import { Product } from '@/types';
import { Link, useForm } from '@inertiajs/react';

export default function ProductList({ product }: { product: Product }) {
    const form = useForm<{
        options_ids: Record<string, number>;
        quantity: number;
    }>({
        options_ids: {},
        quantity: 1,
    });

    const addTocart = () => {
        form.post(store(product.id), {
            preserveScroll: true,
            preserveState: true,
            onError: (err) => {
                console.log(err);
            },
        });
    };

    return (
        <div className="card bg-base-100 shadow-xl" key={product.id}>
            <Link href={show(product.slug)}>
                <figure>
                    <img
                        width={300}
                        src={product.image}
                        alt={product.title}
                        className="object-over aspect-square"
                    />
                </figure>
            </Link>

            <div className="card-body">
                <h2 className="card-title">{product.title}</h2>
                <p>
                    by
                    <Link href="#" className="hover:underline">
                        {product.user.name}
                    </Link>
                    &nbsp;in
                    <Link href="#" className="hover:underline">
                        {product.department.name}
                    </Link>
                </p>
                <div className="item-center mt-3 card-actions justify-between">
                    <Button className="btn btn-primary" onClick={addTocart}>
                        Add to Cart
                    </Button>

                    <span className="text-2xl">
                        <CurrencyFormatter amount={product.price} />
                    </span>
                </div>
            </div>
        </div>
    );
}
