import { show } from '@/actions/App/Http/Controllers/ProductController';
import CurrencyFormatter from '@/components/CurrencyFormatter';
import { Button } from '@/components/ui/button';
import { PaginationProps, Product } from '@/types';
import { Link } from '@inertiajs/react';

export default function ProductList({
    products,
}: {
    products: PaginationProps<Product>;
}) {
    return (
        <div className="grid grid-cols-1 gap-8 p-8 md:grid-cols-2 lg:grid-cols-3">
            {products.data.map((product) => (
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
                            <Button className="btn btn-primary">
                                Add to Cart
                            </Button>

                            <span className="text-2xl">
                                <CurrencyFormatter amount={product.price} />
                            </span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
