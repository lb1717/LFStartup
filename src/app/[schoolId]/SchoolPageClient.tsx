'use client';

import { University } from '@/data/universities';
import { LostItem } from '@/data/lostItems';
import { Location } from '@/data/locations';
import UniversityImage from '@/components/UniversityImage';
import LostItemsGrid from '@/components/LostItemsGrid';
import LocationsListView from '@/components/LocationsListView';
import { deleteLostItem } from '@/lib/api';

interface SchoolPageClientProps {
  university: University;
  initialItems: LostItem[];
  locations: Location[];
}

export default function SchoolPageClient({ university, initialItems, locations }: SchoolPageClientProps) {
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
            <LostItemsGrid 
              items={initialItems}
              onDelete={handleDeleteItem}
            />
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