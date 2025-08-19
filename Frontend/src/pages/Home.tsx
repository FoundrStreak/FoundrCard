const Home = () => (
  <div className="p-6 bg-white rounded-lg shadow-md max-w-2xl mx-auto text-center">
    <h2 className="text-3xl font-semibold text-blue-600">
      Welcome to the Home Page!
    </h2>
    <p className="mt-4 text-gray-700">
      This is a simple placeholder to demonstrate a route with no layout.
    </p>
    <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
      <a
        href="/profile"
        className="px-6 py-3 bg-blue-500 text-white font-medium rounded-lg shadow-lg hover:bg-blue-600 transition-colors"
      >
        Go to Profile (with Layout)
      </a>
      <a
        href="/some-other-page"
        className="px-6 py-3 bg-red-500 text-white font-medium rounded-lg shadow-lg hover:bg-red-600 transition-colors"
      >
        Go to a Missing Page
      </a>
    </div>
  </div>
);

export default Home;
