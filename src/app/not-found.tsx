import React from 'react';
// This component is rendered when a page is not found (404 error).
// NotFound is a special component in Next.js that is used to handle 404 errors. and it is automatically used when a page is not found.It doesn't accept any props or parameters.
export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white px-4">
      <h1 className="text-5xl font-extrabold mb-6 text-red-500">404</h1>
      <h2 className="text-3xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-lg text-gray-300 mb-6">
        Sorry, the page you are looking for doesn't exist or has been moved.
      </p>
      <a
        href="/"
        className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition"
      >
        Go Back Home
      </a>
    </div>
  );
}