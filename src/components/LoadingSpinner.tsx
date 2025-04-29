// src/components/LoadingSpinner.tsx
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex justify-center items-center py-10">
      <p className="text-lg font-medium text-gray-600 animate-pulse">
        Loading...
      </p>
      {/* Example for a simple CSS spinner (requires Tailwind or custom CSS)
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      */}
    </div>
  );
};

export default LoadingSpinner; // <-- Important: Default export