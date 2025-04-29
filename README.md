# Frontend Developer Hiring Project - Product Showcase

This project is a simple e-commerce product listing and detail page application built with Next.js, TypeScript, and Tailwind CSS, using the FakeStore API. It fulfills the core requirements of the hiring assessment.

## Installation

1.  **Clone the repository:**
    ```bash
    git clone <your-repo-url>
    cd my-hiring-project
    ```

2.  **Install dependencies:**
    Using npm:
    ```bash
    npm install
    ```
    Or using Yarn:
    ```bash
    yarn install
    ```

## Running the Development Server

To start the local development server:

Using npm:
```bash
npm run dev
```

Open https://www.google.com/search?q=http://localhost:3000 in your browser to view the application. The main product list is available at /products.

## Project Structure

The project uses the `src/` directory structure common in Next.js:

-   `src/pages/`: Contains the application's routes.
    -   `products/index.tsx`: The product listing page (`/products`).
    -   `products/[id].tsx`: The dynamic product detail page (`/products/:id`).
-   `src/components/`: Contains reusable React components (e.g., `Layout`, `ProductCard`, `ErrorMessage`).
-   `src/lib/`: Contains utility functions, specifically `api.ts` for fetching data from the FakeStore API.
-   `src/types/`: Contains TypeScript type definitions, like `product.ts`.
-   `src/styles/`: Contains global styles and Tailwind CSS configuration (`globals.css`).
-   `public/`: For static assets (though not heavily used here).

## Styling

This project uses **Tailwind CSS** for styling. Utility classes are applied directly within the components for rapid development and consistency. Global styles and Tailwind directives are configured in `src/styles/globals.css`.

## Data Fetching Strategy

Next.js offers various data fetching methods. The strategies below were chosen to balance performance, SEO, and data freshness for this specific application:

1.  **Product Listing Page (`/products`)**:
    * **Method:** `getStaticProps` with `revalidate` (Incremental Static Regeneration - ISR).
    * **Justification:** The product list doesn't change extremely frequently. Using `getStaticProps` pre-renders the page at build time, resulting in fast initial loads and good SEO. The `revalidate: 600` (10 minutes) option allows Next.js to automatically regenerate the page in the background if data changes, ensuring reasonable freshness without requiring a full rebuild for every request. This provides a good balance between static performance and dynamic updates.

2.  **Product Detail Page (`/products/[id]`)**:
    * **Method:** `getStaticProps` with `getStaticPaths`.
    * **Justification:** Individual product details are also relatively static.
        * `getStaticPaths` is used to tell Next.js which product IDs exist at build time, allowing it to pre-render these pages into static HTML for instant loading.
        * `fallback: 'blocking'` is used. This means if a user requests a product page that wasn't pre-rendered (e.g., a newly added product), Next.js will server-render it on the first request (blocking until ready) and then cache it as static for subsequent requests. This ensures all valid products are accessible without showing a loading fallback state, providing a seamless user experience.
        * `revalidate` is also used here (e.g., 1 hour) to allow individual product details (like price or description) to be updated periodically in the background.

## Bonus Features Implemented

The following optional features have been added to the Product Listing page:

-   **Filtering:** Products can be filtered by category using a dropdown menu.
-   **Sorting:** Products can be sorted by Price (Ascending/Descending) or Title (Ascending/Descending).
-   **Search:** A search bar allows filtering products by title (case-insensitive).
-   **Pagination:** Results are paginated client-side to display a manageable number of products per page (8 items per page).

## Live deployed link

[https://eh-pixel-shop.netlify.app/]




