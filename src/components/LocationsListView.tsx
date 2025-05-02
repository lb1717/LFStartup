'use client';

import React from 'react';
import { Location } from '@/data/locations';

interface LocationsListViewProps {
  locations: Location[];
  university: string;
}

export default function LocationsListView({ locations, university }: LocationsListViewProps) {
  if (!locations || locations.length === 0) {
    return (
      <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-gray-50 border-b">
          <h2 className="text-xl font-semibold">Lost & Found Locations</h2>
        </div>
        <div className="p-4 text-center text-gray-500">
          No locations available for this university.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-gray-50 border-b">
        <h2 className="text-xl font-semibold">Lost & Found Locations</h2>
      </div>
      
      <div className="divide-y divide-gray-200">
        {locations.map((location) => (
          <div key={location.id} className="p-4 hover:bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900">{location.name}</h3>
            <div className="mt-2 space-y-1 text-sm text-gray-600">
              <p><span className="font-medium">Building:</span> {location.building}</p>
              {location.floor && <p><span className="font-medium">Floor:</span> {location.floor}</p>}
              {location.room && <p><span className="font-medium">Room:</span> {location.room}</p>}
              {location.exactAddress && <p><span className="font-medium">Address:</span> {location.exactAddress}</p>}
              {location.description && <p className="mt-2">{location.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 