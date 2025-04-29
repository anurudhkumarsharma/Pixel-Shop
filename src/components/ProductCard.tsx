// src/components/ProductCard.tsx
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/product'; // Import the Product type

interface ProductCardProps {
  product: Product; // Expect a single product object as a prop
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // Basic validation in case product data is somehow missing
  if (!product) {
    return null; // Don't render anything if product is null/undefined
  }

  return (
    // Use legacyBehavior for anchor tag wrapping Link until Next.js fully deprecates it
    // Or remove legacyBehavior and the inner <a> if your styling/needs allow Link directly
    <Link href={`/products/${product.id}`} legacyBehavior>
      <a className="group block border rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 ease-in-out h-full flex flex-col">
        {/* Image container with fixed aspect ratio */}
        <div className="relative w-full aspect-square overflow-hidden">
           {product.image ? (
             <Image
                src={product.image}
                alt={product.title || 'Product Image'} // Provide a default alt text
                layout="fill"
                objectFit="contain" // Use 'contain' to see the whole image, 'cover' to fill
                className="p-4 group-hover:scale-105 transition-transform duration-300 ease-in-out" // Add padding inside container
                // Prioritize loading first few images
                priority={product.id <= 8}
             />
           ) : (
             // Placeholder if image URL is missing
             <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">No Image</div>
           )}
        </div>

        {/* Content section */}
        <div className="p-4 flex flex-col flex-grow">
          <h2 className="text-lg font-semibold text-gray-800 truncate mb-1 flex-grow" title={product.title}>
            {product.title || 'Untitled Product'} {/* Default title */}
          </h2>
          <p className="text-sm text-gray-500 capitalize mb-2">
            {product.category || 'Uncategorized'} {/* Default category */}
          </p>
          <p className="text-xl font-bold text-blue-600">
            ${(product.price ?? 0).toFixed(2)} {/* Default price & formatting */}
          </p>
        </div>
      </a>
    </Link>
  );
};

export default ProductCard; // <-- Important: Default export