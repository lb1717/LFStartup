'use client';

import { useState, useEffect } from 'react';
import { University } from '@/data/universities';
import UniversityGrid from './UniversityGrid';
import AccessCodeModal from './AccessCodeModal';

interface HomePageProps {
  universities: University[];
}

export default function HomePage({ universities }: HomePageProps) {
  const [showAccessModal, setShowAccessModal] = useState(true);
  
  // Check if user has already entered the correct code
  useEffect(() => {
    const accessGranted = localStorage.getItem('accessGranted') === 'true';
    if (accessGranted) {
      setShowAccessModal(false);
    }
  }, []);
  
  const handleAccessSuccess = () => {
    setShowAccessModal(false);
  };
  
  const resetAccess = () => {
    localStorage.removeItem('accessGranted');
    setShowAccessModal(true);
  };
  
  return (
    <main className="min-h-screen p-8">
      {showAccessModal ? (
        <AccessCodeModal onSuccess={handleAccessSuccess} />
      ) : (
        <>
          <UniversityGrid universities={universities} />
          <div className="text-center mt-10">
            <button 
              onClick={resetAccess}
              className="text-xs text-gray-400 hover:text-gray-600"
            >
              Reset Access (Admin Only)
            </button>
          </div>
        </>
      )}
    </main>
  );
} 