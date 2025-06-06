'use client';

import React from 'react';
import { Location } from '@/data/locations';

interface LocationsListViewProps {
  locations: Location[];
}

export default function LocationsListView({ locations }: LocationsListViewProps) {
  const handlePinClick = (exactAddress: string | undefined) => {
    // Check if the address is a valid Google Maps URL or a regular address
    if (exactAddress) {
      if (exactAddress.includes('google.com/maps') || exactAddress.includes('goo.gl/maps')) {
        // If it's already a Google Maps URL, open it directly
        window.open(exactAddress, '_blank');
      } else {
        // If it's a regular address, convert it to a Google Maps search URL
        const encodedAddress = encodeURIComponent(exactAddress);
        window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
      }
    } else {
      alert('No valid location found');
    }
  };

  const handlePhoneClick = (e: React.MouseEvent, phoneNumber: string) => {
    e.stopPropagation(); // Prevent the map click
    window.location.href = `tel:${phoneNumber.replace(/[^0-9]/g, '')}`;
  };

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
          <div 
            key={location.id} 
            className="p-4 hover:bg-gray-50 cursor-pointer"
            onClick={() => handlePinClick(location.exactAddress)}
          >
            <h3 className="text-lg font-medium text-gray-900">{location.name}</h3>
            <div className="mt-2 space-y-1 text-sm text-gray-600">
              <p>
                <span className="font-medium">Phone: </span>
                <a 
                  href={`tel:${location.building?.replace(/[^0-9]/g, '')}`}
                  className="hover:text-blue-600 hover:underline"
                  onClick={(e) => handlePhoneClick(e, location.building || '')}
                >
                  {location.building}
                </a>
              </p>
              {location.exactAddress && <p><span className="font-medium">Address:</span> {location.exactAddress}</p>}
              {location.description && <p className="mt-2">{location.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 