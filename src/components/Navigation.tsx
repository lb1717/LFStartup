'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="w-full bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center h-16">
          <div className="flex space-x-8 items-center">
            <Link 
              href="/"
              className={`text-lg ${
                pathname === '/' ? 'font-bold' : 'font-normal'
              } hover:text-gray-600 transition-colors`}
            >
              Home
            </Link>
            <Link 
              href="/aboutus"
              className={`text-lg ${
                pathname === '/aboutus' ? 'font-bold' : 'font-normal'
              } hover:text-gray-600 transition-colors`}
            >
              About Us
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
} 