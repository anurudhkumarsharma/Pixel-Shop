// src/lib/api.ts
import { Product } from '@/types/product'; // Adjust path if needed

const API_URL = 'https://fakestoreapi.com';

export async function getAllProducts(): Promise<Product[]> {
  try {
    const res = await fetch(`${API_URL}/products`);
    if (!res.ok) {
      throw new Error(`API call failed with status: ${res.status}`);
    }
    const products: Product[] = await res.json();
    return products;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    // In a real app, you might want to throw the error or return a specific error object
    throw error; // Re-throw to be caught by fetching function
  }
}

export async function getProductById(id: string | number): Promise<Product | null> {
  // --- START ADDING LOGS ---
  console.log(`[getProductById] Attempting to fetch product with ID: ${id}`);
  console.log(`[getProductById] Type of ID received: ${typeof id}`);
  console.log(`[getProductById] Current API_URL: ${API_URL}`);

  // Basic validation (keep this)
  if (!id || isNaN(Number(id))) {
     console.error("[getProductById] Invalid product ID provided:", id);
     // Returning null might be better than throwing here, depending on desired behaviour
     // Let's return null to match potential API 'not found' state
     return null;
     // throw new Error(`Invalid product ID: ${id}`); // Or throw if preferred
  }

  const constructedUrl = `${API_URL}/products/${id}`;
  console.log(`[getProductById] Constructed fetch URL: ${constructedUrl}`);
  // --- END ADDING LOGS ---

  try {
    const res = await fetch(constructedUrl); // Use the constructed URL variable

    // Check if the response status indicates not found or other client/server errors
    if (!res.ok) {
        if (res.status === 404) {
            console.warn(`[getProductById] Product with ID ${id} not found (404). URL: ${constructedUrl}`);
            return null; // Return null for not found
        }
        // Throw an error for other non-ok statuses (e.g., 500, 400)
        throw new Error(`[getProductById] API call failed for product ${id}. Status: ${res.status}, URL: ${constructedUrl}`);
    }

    const product: Product = await res.json();

    // Handle case where API returns 200 OK but empty/null data unexpectedly
    if (!product) {
        console.warn(`[getProductById] Product data for ID ${id} is null or empty despite OK status. URL: ${constructedUrl}`);
        return null;
    }

    console.log(`[getProductById] Successfully fetched product: ${product.title}`);
    return product;

  } catch (error) {
    // --- ADD LOG INSIDE CATCH ---
    console.error(`[getProductById] Fetch failed catastrophically for URL: ${constructedUrl}. Original error:`, error);
    // --- END ADD LOG INSIDE CATCH ---

    // Re-throw the original error so getStaticProps can catch its message
    throw error;
  }
}


// Optional: Get all product IDs for getStaticPaths
export async function getAllProductIds(): Promise<{ params: { id: string } }[]> {
    try {
        const products = await getAllProducts();
        return products.map((product) => ({
            params: {
                id: String(product.id),
            },
        }));
    } catch (error) {
        console.error("Failed to fetch product IDs:", error);
        return []; // Return empty array on error
    }
}