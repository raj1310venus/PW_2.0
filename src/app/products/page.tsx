'use client';

import ProductCard from '@/components/ProductCard';
import { useProducts } from '@/context/ProductsContext';

export default function ProductsPage() {
  const { products } = useProducts();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">All Products</h1>
        <p className="mt-2 text-lg text-white/70">
          Explore our curated collection of high-quality goods, from everyday essentials to unique finds.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            id={product._id}
            name={product.name}
            price={product.price}
            imageUrl={product.imageUrl}
            featured={product.featured}
            description={product.description}
          />
        ))}
      </div>
    </div>
  );
}
