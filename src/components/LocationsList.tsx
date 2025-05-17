import { Location } from '@/data/locations';
import { MapPinIcon } from '@heroicons/react/24/solid';

interface LocationsListProps {
  locations: Location[];
}

export default function LocationsList({ locations }: LocationsListProps) {
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

  return (
    <div className="mt-12 max-w-3xl mx-auto bg-white rounded-lg shadow">
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Campus Locations</h2>
        <div className="space-y-4">
          {locations.map((location) => (
            <div 
              key={location.id} 
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex-1 min-w-0 pr-4">
                <h3 className="font-medium truncate">{location.name}</h3>
                <p className="text-sm text-gray-600 truncate">
                  {location.building}
                  {location.floor && `, Floor ${location.floor}`}
                  {location.room && `, Room ${location.room}`}
                </p>
                {location.description && (
                  <p className="text-sm text-gray-500 mt-1 truncate">{location.description}</p>
                )}
              </div>
              <button
                onClick={() => handlePinClick(location.exactAddress)}
                className="flex-shrink-0 p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors"
                title="Open in Maps"
              >
                <MapPinIcon className="h-6 w-6" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 