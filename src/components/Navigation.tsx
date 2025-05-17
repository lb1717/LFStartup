'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import AdminLoginModal from './AdminLoginModal';

export default function Navigation() {
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
  const schoolId = isSchoolPage ? pathname.split('/')[1] : '';

  // Check admin status on client side only
  useEffect(() => {
    setIsAdmin(searchParams.get('admin') === 'true');
  }, [searchParams]);

  const handleAdminLoginClick = () => {
    setShowAdminLogin(true);
  };
  
  // Toggle settings menu
  const toggleSettingsMenu = () => {
    setShowSettingsMenu(!showSettingsMenu);
  };
  
  // Close settings menu when clicking outside
  const closeSettingsMenu = () => {
    setShowSettingsMenu(false);
  };
  
  // On school pages, show only the home icon and settings icon if applicable
  if (isSchoolPage) {
    return (
      <>
        <nav className="w-full">
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
                  <span className="text-gray-500 text-sm">Admin</span>
                )}
                
                {isSchoolLandingPage && (
                  <button
                    onClick={handleAdminLoginClick}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Admin Login
                  </button>
                )}

                {isSchoolPortalPage && isAdmin && (
                  <div className="relative">
                    <button
                      className="inline-block"
                      aria-label="Settings"
                      onClick={toggleSettingsMenu}
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        className="w-8 h-8 text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                      </svg>
                    </button>
                    
                    {showSettingsMenu && (
                      <>
                        {/* Invisible overlay to detect clicks outside */}
                        <div 
                          className="fixed inset-0 h-full w-full z-10" 
                          onClick={closeSettingsMenu}
                        ></div>
                        
                        {/* Dropdown menu */}
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                          <Link
                            href={`/${schoolId}/manage-locations?admin=true`}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={closeSettingsMenu}
                          >
                            Manage Locations
                          </Link>
                          <Link
                            href={`/${schoolId}/portal/add-item?admin=true`}
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={closeSettingsMenu}
                          >
                            Add Item
                          </Link>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>

        {showAdminLogin && (
          <AdminLoginModal
            schoolId={schoolId}
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