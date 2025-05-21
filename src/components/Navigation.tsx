'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import AdminLoginModal from './AdminLoginModal';
import { Suspense } from 'react';

function NavigationContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Check if we're on a school page
  const isSchoolPage = /^\/[^\/]+(?:\/portal)?$/.test(pathname) && pathname !== '/aboutus';
  // Check specifically if we're on the school landing page (not the portal)
  const isSchoolLandingPage = /^\/[^\/]+$/.test(pathname) && pathname !== '/aboutus';
  // Check if we're on the school portal page
  const isSchoolPortalPage = /^\/[^\/]+\/portal$/.test(pathname);
  
  // Get school ID from pathname if we're on a school page
  const schoolIdFromPath = isSchoolPage ? pathname.split('/')[1] : '';

  // Check admin status on client side only
  useEffect(() => {
    setIsAdmin(searchParams.get('admin') === 'true');
  }, [searchParams]);

  const handleAdminLoginClick = () => {
    setShowAdminLogin(true);
  };
  
  // On school pages, show only the home icon and settings icon if applicable
  if (isSchoolPage) {
    return (
      <>
        <nav className="w-full bg-white shadow-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4 flex justify-between items-center">
              <Link 
                href="/"
                className="inline-block -ml-4"
                aria-label="Go to home page"
              >
                <Image 
                  src="/images/monventa-textlogo-new.png"
                  alt="Monventa"
                  width={150}
                  height={40}
                  className="h-8 w-auto hover:opacity-80 transition-opacity"
                />
              </Link>
              
              <div className="flex items-center gap-4">
                {isAdmin && isSchoolPortalPage && (
                  <div className="flex gap-2">
                    <Link
                      href={`/${schoolIdFromPath}/portal/add-item?admin=true`}
                      className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Add Item
                    </Link>
                    <Link
                      href={`/${schoolIdFromPath}/manage-locations?admin=true`}
                      className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Manage Locations
                    </Link>
                  </div>
                )}
                
                {isSchoolLandingPage && (
                  <button
                    onClick={handleAdminLoginClick}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Admin Login
                  </button>
                )}
              </div>
            </div>
          </div>
        </nav>

        {showAdminLogin && (
          <AdminLoginModal
            schoolId={schoolIdFromPath}
            onClose={() => setShowAdminLogin(false)}
          />
        )}
      </>
    );
  }
  
  // On other pages, show the full navigation bar
  return (
    <nav className="w-full bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center -ml-4">
            <Link href="/" className="flex-shrink-0">
              <Image 
                src="/images/monventa-textlogo-new.png"
                alt="Monventa"
                width={150}
                height={40}
                className="h-8 w-auto"
              />
            </Link>
          </div>
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

export default function Navigation() {
  return (
    <Suspense fallback={
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex items-center px-2 py-2">
                <span className="text-xl font-semibold text-gray-300">Loading...</span>
              </div>
            </div>
          </div>
        </div>
      </nav>
    }>
      <NavigationContent />
    </Suspense>
  );
} 