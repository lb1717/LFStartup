'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  
  // Check if we're on a school page
  const isSchoolPage = /^\/[^\/]+(?:\/portal)?$/.test(pathname);
  // Check specifically if we're on the school landing page (not the portal)
  const isSchoolLandingPage = /^\/[^\/]+$/.test(pathname) && pathname !== '/aboutus';
  
  // Get school ID from pathname if we're on a school page
  const schoolId = isSchoolPage ? pathname.split('/')[1] : '';
  
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
      <nav className="w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 flex justify-between items-center">
            <Link 
              href="/"
              className="inline-block"
              aria-label="Go to home page"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="w-8 h-8 text-blue-500 hover:text-blue-700 transition-colors"
              >
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </Link>
            
            {isSchoolLandingPage && (
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
                        href={`/${schoolId}/manage-locations`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={closeSettingsMenu}
                      >
                        Manage Locations
                      </Link>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    );
  }
  
  // On other pages, show the full navigation bar
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