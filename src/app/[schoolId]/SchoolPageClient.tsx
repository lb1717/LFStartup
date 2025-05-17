'use client';

import { University } from '@/data/universities';
import { LostItem } from '@/data/lostItems';
import { Location } from '@/data/locations';
import UniversityImage from '@/components/UniversityImage';
import LostItemsGrid from '@/components/LostItemsGrid';
import LocationsListView from '@/components/LocationsListView';
import { deleteLostItem } from '@/lib/api';
import { Suspense } from 'react';

interface SchoolPageClientProps {
  university: University;
  initialItems: LostItem[];
  locations: Location[];
  isAdmin: boolean;
}

export default function SchoolPageClient({ university, initialItems, locations, isAdmin }: SchoolPageClientProps) {
  const handleDeleteItem = async (itemId: string) => {
    try {
      await deleteLostItem(itemId);
      // The page will be refreshed by the parent component
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-12">
          {university.logo && (
            <UniversityImage
              src={university.logo}
              alt={`${university.name} logo`}
              size="large"
            />
          )}
          <h1 className="text-4xl font-bold text-center mb-8">
            {university.name} Lost and Found
          </h1>
          
          <div className="w-full max-w-7xl mb-12">
            <Suspense fallback={
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="relative bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                    <div className="p-4">
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="flex justify-between">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            }>
              <LostItemsGrid 
                items={initialItems}
                onDelete={handleDeleteItem}
                isAdmin={isAdmin}
              />
            </Suspense>
          </div>
          
          {locations.length > 0 && (
            <div className="w-full max-w-7xl mb-8">
              <LocationsListView
                locations={locations}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 