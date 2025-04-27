'use client';

import { useState } from 'react';

export default function LocationsManager() {
  const [locations, setLocations] = useState<string[]>([]);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Manage Locations</h2>
      <div className="space-y-4">
        {locations.map((location, index) => (
          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <span>{location}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 