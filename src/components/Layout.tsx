// src/components/Layout.tsx
import React from 'react';

// Define the props type: it accepts React nodes as children
interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* You could add a <header> here later */}
      {/* <header className="bg-gray-800 text-white p-4">Header</header> */}

      {/* Main content area */}
      {/* px-4 adds padding on the sides, py-8 adds padding top/bottom */}
      {/* max-w-7xl mx-auto centers the content with a max width */}
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        {children}
      </main>

      {/* You could add a <footer> here later */}
      {/* <footer className="bg-gray-200 p-4 text-center">Footer</footer> */}
    </div>
  );
};

export default Layout; // <-- Important: Default export