import Link from 'next/link';

type HomePageProps = {}; // Define any props here if needed

const HomePage = (props: HomePageProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-blue-900 text-white py-4">
        <div className="container mx-auto flex justify-between items-center px-4">
          <h1 className="text-2xl font-bold">My App</h1>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link href="/SignIn" className="hover:underline">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:underline">
                  Sign Up
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 bg-blue-900 p-8">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Welcome to My App</h2>
          <p className="text-lg mb-4">
            This is the main page of the application. Here you can provide an overview of what your app is about.
          </p>
          <Link href="/about" className="text-blue-600 hover:underline">
            Learn more about us
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-900 text-white py-4">
        <div className="container mx-auto text-center">
          <p>&copy; {new Date().getFullYear()} My App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
