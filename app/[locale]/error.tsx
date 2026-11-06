'use client'; // Error boundaries must be Client Components

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F7F7F4] text-[#1C2321] p-4">
      <h2 className="text-2xl font-bold mb-4 text-red-500">Something went wrong!</h2>
      <p className="text-[#66716C] mb-6 max-w-md text-center">
        {error.message || "An unexpected error occurred while loading the application."}
      </p>
      <button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
        className="bg-cyan-600 hover:bg-[#4C6B59] text-[#1C2321] font-bold py-2 px-6 rounded transition-colors"
      >
        Try again
      </button>
    </div>
  );
}
