// src/components/ErrorMessage.tsx
import React from 'react';

interface ErrorMessageProps {
  message: string; // Expect a message string as a prop
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) {
    return null; // Don't render if no message is provided
  }

  return (
    <div
      className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center"
      role="alert"
    >
      <strong className="font-bold">Error: </strong>
      <span className="block sm:inline">{message}</span>
    </div>
  );
};

export default ErrorMessage; // <-- Important: Default export