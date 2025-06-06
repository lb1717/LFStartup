'use client';

import { Location } from '@/data/locations';
import { MapPinIcon, PhoneIcon } from '@heroicons/react/24/solid';

interface CampusLocationsListProps {
  locations: Location[];
}

export default function CampusLocationsList({ locations }: CampusLocationsListProps) {
  const handleMapClick = (exactAddress: string | undefined) => {
    if (exactAddress) {
      if (exactAddress.includes('google.com/maps') || exactAddress.includes('goo.gl/maps')) {
        window.open(exactAddress, '_blank');
      } else {
        const encodedAddress = encodeURIComponent(exactAddress);
        window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
      }
    } else {
      alert('No valid location found');
    }
  };

  const handlePhoneClick = (e: React.MouseEvent, phoneNumber: string) => {
    e.stopPropagation();
    window.location.href = `tel:${phoneNumber.replace(/[^0-9]/g, '')}`;
  };

  return (
    <div className="w-full max-w-3xl mt-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold mb-4 text-center">Campus Locations</h2>
        {locations.length === 0 ? (
          <p className="text-gray-500">No locations found for this university.</p>
        ) : (
          <div className="space-y-4">
            {locations.map((location) => (
              <div 
                key={location.id} 
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => handleMapClick(location.exactAddress)}
              >
                <div className="flex-1 min-w-0 pr-4">
                  <h3 className="font-medium truncate">{location.name}</h3>
                  <p className="text-sm text-gray-600 truncate flex items-center gap-1">
                    <PhoneIcon className="h-4 w-4 text-gray-500" />
                    <a 
                      href={`tel:${location.building?.replace(/[^0-9]/g, '')}`}
                      className="hover:text-blue-600 hover:underline"
                      onClick={(e) => handlePhoneClick(e, location.building || '')}
                    >
                      {location.building}
                    </a>
                  </p>
                  {location.description && (
                    <p className="text-sm text-gray-500 mt-1 truncate">{location.description}</p>
                  )}
                  {location.exactAddress && (
                    <p className="text-sm text-gray-600 mt-1 truncate">
                      {location.exactAddress}
                    </p>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMapClick(location.exactAddress);
                  }}
                  className="flex-shrink-0 p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors"
                  title="Open in Maps"
                >
                  <MapPinIcon className="h-6 w-6" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 