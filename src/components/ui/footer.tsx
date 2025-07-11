import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
        <div className="flex justify-center space-x-6 md:order-2">
          <Link
            href="/auth"
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            Login
          </Link>
          <Link
            href="/auth"
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            Register
          </Link>
          <Link
            href="/dashboard"
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            Dashboard
          </Link>
        </div>
        <div className="mt-8 md:order-1 md:mt-0">
          <p className="text-center text-xs leading-5 text-gray-500">
            &copy; 2024 UserAuth Demo. Built with Next.js and shadcn/ui.
          </p>
        </div>
      </div>
    </footer>
  );
}
