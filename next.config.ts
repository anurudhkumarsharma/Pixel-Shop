/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Keep your existing image domains configuration
    domains: ['fakestoreapi.com'],
  },

  // --- ADD THIS ASYNC REWRITES FUNCTION ---
  async rewrites() {
    return [
      {
        // When the user requests the root path...
        source: '/',
        // ...internally serve the content from the /products page
        destination: '/products',
      },
      // You could add more rewrite rules here if needed later
    ];
  },
  // --- END OF ADDITION ---

};

module.exports = nextConfig;