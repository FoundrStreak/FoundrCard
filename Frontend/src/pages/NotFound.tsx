const NotFound = () => (
  <div className="p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto text-center">
    <h2 className="text-3xl font-semibold text-red-600">
      404 - Page Not Found
    </h2>
    <p className="mt-4 text-gray-700">
      The page you're looking for does not exist.
    </p>
    <div className="mt-6">
      <a
        href="/"
        className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg shadow-lg hover:bg-blue-600 transition-colors"
      >
        Go Home
      </a>
    </div>
  </div>
);

export default NotFound;
