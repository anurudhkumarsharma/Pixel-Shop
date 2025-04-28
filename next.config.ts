/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['fakestoreapi.com'], // Add the domain used by the API for images
  },
  // If you chose not to use the src directory during setup, remove swcMinify: true if present
  // It might be automatically configured depending on the version.
}

module.exports = nextConfig