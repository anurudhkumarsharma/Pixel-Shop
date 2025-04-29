// src/pages/products/index.tsx

import React, { useState, useMemo, useEffect } from 'react'; // Import React hooks
import { GetStaticProps, NextPage } from 'next';

// Data types and API functions
import { Product } from '@/types/product'; // Adjust path if needed
import { getAllProducts } from '@/lib/api'; // Adjust path if needed

// Required Components (Ensure these exist in src/components/)
import Layout from '@/components/Layout'; // Adjust path if needed
import ProductCard from '@/components/ProductCard'; // Adjust path if needed
import ErrorMessage from '@/components/ErrorMessage'; // Adjust path if needed
// Optional: import LoadingSpinner from '@/components/LoadingSpinner';

// --- Type Definitions ---

// Props type definition for the page
interface ProductsPageProps {
  products: Product[];
  categories: string[]; // Expecting categories from getStaticProps
  error?: string;
}

// Type definition for sorting state
type SortCriteria = {
  field: 'price' | 'title' | null; // Fields we can sort by
  order: 'asc' | 'desc';           // Sort order
};

// --- Constants ---
const ITEMS_PER_PAGE = 8; // Number of products displayed per page

// --- React Component ---

const ProductsPage: NextPage<ProductsPageProps> = ({
  products: initialProducts, // Rename prop for clarity
  categories,
  error
}) => {

  // --- State Management ---
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All'); // Default to 'All' categories
  const [sortCriteria, setSortCriteria] = useState<SortCriteria>({ field: null, order: 'asc' }); // Default: no sort
  const [currentPage, setCurrentPage] = useState(1); // Start on page 1

  // Optional loading state (uncomment if needed for slow processing)
  // const [isProcessing, setIsProcessing] = useState(false);

  // --- Derived State (Filtering, Sorting) ---
  // Use useMemo to optimize: recalculate only when dependencies change
  const filteredAndSortedProducts = useMemo(() => {
    // setIsProcessing(true); // Optional: start processing indicator
    let processedProducts = initialProducts || []; // Start with initial products, handle potential null/undefined

    // 1. Filter by Category
    if (selectedCategory !== 'All') {
      processedProducts = processedProducts.filter(p => p.category === selectedCategory);
    }

    // 2. Filter by Search Term (case-insensitive title search)
    if (searchTerm.trim()) { // Check if searchTerm is not just whitespace
      processedProducts = processedProducts.filter(p =>
        p.title.toLowerCase().includes(searchTerm.trim().toLowerCase())
      );
    }

    // 3. Sort Products
    if (sortCriteria.field) {
      // Create a new array before sorting to avoid mutating the memoized source
      processedProducts = [...processedProducts].sort((a, b) => {
        const field = sortCriteria.field!; // Assert non-null as we checked it exists
        const orderMultiplier = sortCriteria.order === 'asc' ? 1 : -1;

        let valueA: string | number;
        let valueB: string | number;

        // Get values based on the sort field
        if (field === 'price') {
          valueA = a.price ?? 0; // Use ?? 0 to handle potential null/undefined price
          valueB = b.price ?? 0;
        } else { // field === 'title'
          valueA = a.title?.toLowerCase() ?? ''; // Use ?? '' for potential null/undefined title
          valueB = b.title?.toLowerCase() ?? '';
        }

        // Comparison logic
        if (valueA < valueB) return -1 * orderMultiplier;
        if (valueA > valueB) return 1 * orderMultiplier;
        return 0; // Values are equal
      });
    }

    // setIsProcessing(false); // Optional: end processing indicator
    return processedProducts;
  }, [initialProducts, selectedCategory, searchTerm, sortCriteria]);

  // --- Pagination Logic ---
  const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE);

  // Calculate products for the current page using useMemo
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAndSortedProducts.slice(startIndex, endIndex);
  }, [filteredAndSortedProducts, currentPage]);

  // --- Effects ---
  // Reset to page 1 whenever filters, search term, or sort criteria change
  useEffect(() => {
    if (currentPage !== 1) {
        setCurrentPage(1);
    }
  }, [selectedCategory, searchTerm, sortCriteria]); // Dependency array includes things that change the total item count/order

  // --- Event Handlers ---
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(event.target.value);
  };

  // Handles clicks on sort buttons
  const handleSort = (field: 'price' | 'title') => {
    setSortCriteria(prev => {
      // If clicking the same field, toggle the order
      if (prev.field === field) {
        return { field, order: prev.order === 'asc' ? 'desc' : 'asc' };
      }
      // If clicking a new field, default to ascending order
      else {
        return { field, order: 'asc' };
      }
    });
  };

  // Handles clicks on pagination buttons
  const handlePageChange = (newPage: number) => {
    // Ensure the new page number is within valid bounds
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      // Optional: Scroll to the top of the product list when changing pages
      const productListElement = document.getElementById('product-list');
      if (productListElement) {
        productListElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  // --- Render Logic ---

  // Handle error state passed from getStaticProps
  if (error) {
    return (
      <Layout>
        <ErrorMessage message={`We couldn't load the products. Error: ${error}`} />
      </Layout>
    );
  }

  // Handle case where initial products might still be loading or undefined (less likely with SSG/ISR unless error)
  if (!initialProducts) {
     return <Layout><p className="text-center p-10">Loading products...</p></Layout>;
     // Or use a LoadingSpinner component:
     // return <Layout><LoadingSpinner /></Layout>;
  }

  // Main component render
  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-8 text-center">Our Products</h1>

      {/* Controls Section: Search, Filter, Sort */}
      <div className="mb-8 p-4 bg-gray-50 rounded-lg shadow grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
        {/* Search Input */}
        <div className="md:col-span-1">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Search Products
          </label>
          <input
            type="text"
            id="search"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
          />
        </div>

        {/* Category Select Dropdown */}
        <div className="md:col-span-1">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Filter by Category
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
          >
            {/* Map over categories passed from getStaticProps */}
            {(categories || []).map(category => (
              <option key={category} value={category}>
                {/* Capitalize first letter for display if needed, but keep value as is */}
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Buttons */}
        <div className="md:col-span-1 flex gap-2 justify-start md:justify-end flex-wrap">
           {/* Sort by Price Button */}
           <button
              onClick={() => handleSort('price')}
              aria-pressed={sortCriteria.field === 'price'} // Accessibility
              className={`px-3 py-2 border rounded-md text-sm font-medium transition duration-150 ease-in-out ${
                sortCriteria.field === 'price'
                ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
           >
              Sort by Price {sortCriteria.field === 'price' ? (sortCriteria.order === 'asc' ? '▲' : '▼') : ''}
           </button>
           {/* Sort by Title Button */}
           <button
              onClick={() => handleSort('title')}
              aria-pressed={sortCriteria.field === 'title'} // Accessibility
              className={`px-3 py-2 border rounded-md text-sm font-medium transition duration-150 ease-in-out ${
                sortCriteria.field === 'title'
                ? 'bg-blue-600 text-white border-blue-700 shadow-sm'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }`}
           >
              Sort by Title {sortCriteria.field === 'title' ? (sortCriteria.order === 'asc' ? '▲' : '▼') : ''}
           </button>
        </div>
      </div>

      {/* Product Grid - Give it an ID for scrolling */}
      <div id="product-list" className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {/* Conditional rendering based on whether products were found */}
        {paginatedProducts.length > 0 ? (
          paginatedProducts.map((product) => (
            // Render ProductCard for each product in the current page's slice
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          // Message when no products match filters/search
          <p className="text-center text-gray-600 col-span-full py-10">
            No products found matching your criteria. Try adjusting your search or filters.
          </p>
        )}
      </div>

      {/* Pagination Controls - Only show if more than one page */}
      {totalPages > 1 && (
          <div className="flex justify-center items-center gap-3 md:gap-4 mt-8 pt-4 border-t border-gray-200">
             {/* Previous Page Button */}
             <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1} // Disable if on the first page
                className="px-3 py-1 md:px-4 md:py-2 border rounded-md text-sm bg-white text-gray-700 border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
                aria-label="Go to previous page"
             >
                &larr; Previous
             </button>

             {/* Page Number Display */}
             <span className="text-sm text-gray-700 font-medium">
                Page {currentPage} of {totalPages}
             </span>

             {/* Next Page Button */}
             <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages} // Disable if on the last page
                className="px-3 py-1 md:px-4 md:py-2 border rounded-md text-sm bg-white text-gray-700 border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
                aria-label="Go to next page"
             >
                Next &rarr;
             </button>
          </div>
      )}

    </Layout>
  );
};

// --- Data Fetching Function (Server-Side or Build Time) ---

export const getStaticProps: GetStaticProps<ProductsPageProps> = async () => {
  console.log("Fetching all products and categories for static generation...");
  try {
    // Fetch all products from the API function
    const products = await getAllProducts();

    // Handle case where API might return null/undefined (though our function should throw)
    if (!products) {
      console.warn("getAllProducts returned null/undefined unexpectedly.");
      return {
        props: { products: [], categories: [], error: "Failed to fetch products (unexpected return value)." },
        revalidate: 60, // Revalidate sooner after potential issue
      };
    }

    // Extract unique categories from the fetched products
    // Use Set for uniqueness, then convert back to array and sort
    const categories = Array.from(new Set(products.map(p => p.category))).sort();

    console.log(`Successfully fetched ${products.length} products and ${categories.length} unique categories.`);

    // Return props to the page component
    return {
      props: {
        products,
        categories: ['All', ...categories], // Prepend 'All' option for the filter dropdown
      },
      // Incremental Static Regeneration (ISR): Re-fetch data in the background
      // specified in seconds. E.g., 10 minutes.
      revalidate: 60 * 10,
    };
  } catch (err) {
    // Handle errors during the data fetching process
    console.error("[getStaticProps Error] Failed to fetch products:", err);
    // Determine error message safely
    const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred during data fetching.';

    // Return error state to the page component
    return {
      props: {
        products: [], // Send empty array on error
        categories: [], // Send empty array on error
        error: errorMessage, // Pass the error message
      },
      revalidate: 60, // Attempt to revalidate sooner after an error (e.g., 1 minute)
    };
  }
};

// --- Export Component ---
export default ProductsPage;