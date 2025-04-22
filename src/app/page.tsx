'use client';

import { useState } from 'react';
import { universities } from '@/data/universities';
import UniversityCard from '@/components/UniversityCard';

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUniversities = universities.filter(university =>
    university.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen p-8">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredUniversities.map((university) => (
            <UniversityCard key={university.id} university={university} />
          ))}
        </div>
      </div>
    </main>
  );
}
