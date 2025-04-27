'use client';

import { useState } from 'react';
import { University } from '@/data/universities';
import UniversityCard from './UniversityCard';

interface UniversityGridProps {
  universities: University[];
}

export default function UniversityGrid({ universities }: UniversityGridProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUniversities = universities.filter(university =>
    university.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="max-w-4xl mx-auto mb-12">
        <div className="relative">
          <input
            type="text"
            placeholder="Search for a university..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-6 py-4 text-xl rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none shadow-sm"
          />
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {filteredUniversities.length === 0 ? (
          <p className="text-center text-gray-500 text-xl">No universities found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredUniversities.map((university) => (
              <UniversityCard key={university.id} university={university} />
            ))}
          </div>
        )}
      </div>
    </>
  );
} 