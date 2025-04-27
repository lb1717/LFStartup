'use client';

import { useState } from 'react';
import { University } from '@/data/universities';
import { LostItem } from '@/data/lostItems';
import { Location } from '@/data/locations';
import UniversityImage from '@/components/UniversityImage';
import LostItemsGrid from '@/components/LostItemsGrid';
import GoogleMapView from '@/components/GoogleMapView';

interface SchoolPageClientProps {
  university: University;
  initialItems: LostItem[];
  locations: Location[];
}

export default function SchoolPageClient({ university, initialItems, locations }: SchoolPageClientProps) {
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
              initialItems={initialItems}
              universityId={university.id}
              schoolName={university.name}
            />
          </div>
          
          {locations.length > 0 && (
            <div className="w-full max-w-7xl mb-8">
              <GoogleMapView
                locations={locations}
                university={university.name}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 