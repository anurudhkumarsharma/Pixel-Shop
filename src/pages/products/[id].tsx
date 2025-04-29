// src/pages/products/[id].tsx
import React from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import { useRouter } from 'next/router'; // Optional: For fallback state or programmatic navigation
import Image from 'next/image';
import Link from 'next/link';
import { ParsedUrlQuery } from 'querystring'; // Type helper for URL parameters

// Data types and API functions
import { Product } from '@/types/product'; // Import the Product type
import { getProductById, getAllProductIds } from '@/lib/api'; // Import API functions

// Required Components (Ensure these exist in src/components/)
import Layout from '@/components/Layout';
import LoadingSpinner from '@/components/LoadingSpinner'; // For fallback:true or potential client-side loading
import ErrorMessage from '@/components/ErrorMessage';

// Props type definition for this page
interface ProductDetailPageProps {
  product: Product | null; // Product can be null if not found or on error
  error?: string;          // Optional error message from getStaticProps
}

// Params type definition for context in getStaticProps/Paths
interface ProductDetailParams extends ParsedUrlQuery {
  id: string; // The dynamic route parameter must match the filename `[id].tsx`
}

const ProductDetailPage: NextPage<ProductDetailPageProps> = ({ product, error }) => {
  const router = useRouter();

  // --- Optional: Handle loading state if using fallback: true in getStaticPaths ---
  // If you used fallback: 'blocking', this isn't strictly necessary as Next.js waits for the page
  // if (router.isFallback) {
  //   return (
  //     <Layout>
  //       <LoadingSpinner />
  //     </Layout>
  //   );
  // }
  // --- End Optional Fallback Handling ---

  // 1. Handle errors passed from getStaticProps
  if (error) {
    return (
      <Layout>
        {/* Provide navigation back even on error */}
        <div className="mb-4">
           <Link href="/products" legacyBehavior>
             <a className="text-blue-600 hover:underline">&larr; Back to Products</a>
           </Link>
        </div>
        <ErrorMessage message={`Could not load product details. ${error}`} />
      </Layout>
    );
  }

  // 2. Handle case where the product was not found (product is null, no error message)
  if (!product) {
    return (
      <Layout>
         <div className="mb-4">
           <Link href="/products" legacyBehavior>
             <a className="text-blue-600 hover:underline">&larr; Back to Products</a>
           </Link>
         </div>
        <ErrorMessage message="Product not found." />
        {/* You could suggest other products or improve this message */}
      </Layout>
    );
  }

  // 3. Render the product details if product exists and no errors
  return (
    <Layout>
      {/* Back Navigation Link */}
      <div className="mb-6">
         <Link href="/products" legacyBehavior>
           <a className="text-blue-600 hover:underline text-lg">&larr; Back to Products</a>
         </Link>
      </div>

      {/* Product Detail Layout (e.g., two columns on medium screens and up) */}
      <div className="flex flex-col md:flex-row md:gap-8 lg:gap-12">

        {/* Image Column */}
        <div className="w-full md:w-1/2 lg:w-5/12 mb-6 md:mb-0">
           <div className="relative aspect-square border rounded-lg overflow-hidden shadow-sm"> {/* Aspect ratio container */}
              {product.image ? (
                 <Image
                    src={product.image}
                    alt={product.title || 'Product Image'}
                    layout="fill"
                    objectFit="contain" // Use contain to see the whole image within the box
                    className="p-4" // Add padding around the image inside the container
                    priority // Prioritize loading the main product image on this page
                 />
               ) : (
                 <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">No Image Available</div>
               )}
           </div>
        </div>

        {/* Details Column */}
        <div className="w-full md:w-1/2 lg:w-7/12">
          <h1 className="text-3xl lg:text-4xl font-bold mb-3 text-gray-800">{product.title}</h1>
          <p className="text-lg text-gray-500 capitalize mb-4">{product.category}</p>
          <p className="text-3xl font-semibold text-blue-700 mb-6">${product.price.toFixed(2)}</p>
          <h2 className="text-xl font-semibold mb-2 text-gray-700">Description</h2>
          <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{product.description}</p>
           {/* You could add Rating here if desired */}
           {/* <p className="mt-4 text-sm text-gray-500">Rating: {product.rating?.rate} ({product.rating?.count} reviews)</p> */}
        </div>
      </div>
    </Layout>
  );
};


// --- Data Fetching Functions ---

// 1. getStaticPaths: Define which dynamic paths should be pre-rendered at build time
export const getStaticPaths: GetStaticPaths<ProductDetailParams> = async () => {
  console.log("Fetching all product IDs for static paths...");
  try {
      // Fetch all product IDs from the API function
      const paths = await getAllProductIds(); // This function should return { params: { id: '1' } }[]
      console.log(`Found ${paths.length} product paths to generate.`);

      return {
        paths: paths, // Tells Next.js which paths to pre-render
        // fallback: 'blocking' means:
        // - If a path isn't listed in `paths`, Next.js will server-render it on the FIRST request.
        // - Subsequent requests for that path will serve the static file generated from the first request.
        // - User doesn't see a loading fallback, page just takes slightly longer on first hit for non-pre-rendered paths.
        fallback: 'blocking',
        // Other options:
        // fallback: true // Requires handling router.isFallback state in the component for loading UI
        // fallback: false // Any path not listed in `paths` will result in a 404 page
      };
  } catch (error) {
      console.error("getStaticPaths failed:", error)
      // Return empty paths on error, but still allow fallback to try and render them dynamically
      return {
          paths: [],
          fallback: 'blocking'
      }
  }
};

// 2. getStaticProps: Fetch data for ONE specific product page based on the ID in the path
export const getStaticProps: GetStaticProps<ProductDetailPageProps, ProductDetailParams> = async (context) => {
  const { params } = context;
  const productId = params?.id; // Get the specific product ID from the URL parameters

  // Validate if ID exists (it should, based on fallback:'blocking' or defined paths)
  if (!productId) {
     console.error("Product ID missing in context params.");
    return {
        props: { product: null, error: "Product ID missing in URL." },
        // Optionally redirect or return 404 immediately:
        // notFound: true,
    };
  }

  console.log(`Workspaceing static props for product ID: ${productId}...`);
  try {
    // Fetch the single product's data using the API function
    const product = await getProductById(productId);

    // Handle product not found by the API (getProductById should return null in this case)
    if (!product) {
       console.warn(`Product with ID ${productId} not found by API.`);
      // Return props indicating not found - the page component will show the message
      return {
         props: { product: null },
         // Optionally uncomment to return a 404 page directly from getStaticProps:
         // notFound: true,
         // Revalidate 'not found' results less frequently? Or maybe more?
         revalidate: 60, // e.g., check again in 1 minute if it exists now
      };
    }

    // Product found, return it as props
    console.log(`Successfully fetched data for product ID: ${productId}`);
    return {
      props: {
        product, // Pass the fetched product data to the page component
      },
      // Optional: Revalidate the data for this specific product page periodically (e.g., every hour)
      revalidate: 60 * 60 * 1,
    };
  } catch (err) {
     // Handle potential errors during the API call
     console.error(`getStaticProps failed for product ${productId}:`, err);
     const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred fetching product details.';

     // Return an error state to the page component
    return {
      props: {
         product: null, // Send null product on error
         error: errorMessage,
      },
      // Revalidate sooner after an error?
      revalidate: 60, // e.g., try refetching in 1 minute
    };
  }
};

// Export the page component
export default ProductDetailPage;