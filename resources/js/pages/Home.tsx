import Header from '@/layouts/Header';
import { PaginationProps, Product } from '@/types';
import ProductList from './ProductList';

export default function Home({
    products,
}: {
    products: PaginationProps<Product>;
}) {
    return (
        <>
            <Header title="welcome" />
            <div className="hero h-[300px] bg-gray-200">
                <div className="hero-content text-center">
                    <div className="max-w-md">
                        <h1 className="text-5xl font-bold">Hello there</h1>
                        <p className="py-6">
                            Provident cupiditate voluptatem et in. Quaerat
                            fugiat ut assumenda excepturi exercitationem quasi.
                            In deleniti eaque aut repudiandae et a id nisi.
                        </p>
                        <button className="btn btn-primary">Get Started</button>
                    </div>
                </div>
            </div>

            <ProductList products={products} />
        </>
    );
}
