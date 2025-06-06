import { Location } from '@/data/locations';
import { MapPinIcon, PhoneIcon } from '@heroicons/react/24/outline';

interface LocationsListProps {
  locations: Location[];
}

export default function LocationsList({ locations }: LocationsListProps) {
  const handlePinClick = (exactAddress: string | undefined) => {
    if (exactAddress) {
      const encodedAddress = encodeURIComponent(exactAddress);
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank', 'noopener,noreferrer');
    }
  };

  const handlePhoneClick = (e: React.MouseEvent, phoneNumber: string) => {
    e.stopPropagation();
    const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
    window.location.href = `tel:${cleanNumber}`;
  };

  const handleKeyPress = (e: React.KeyboardEvent, exactAddress: string | undefined) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handlePinClick(exactAddress);
    }
  };

  return (
    <div 
      className="mt-12 max-w-3xl mx-auto bg-white rounded-lg shadow"
      role="region"
      aria-labelledby="locations-heading"
    >
      <div className="p-6">
        <h2 id="locations-heading" className="text-3xl font-semibold mb-4 text-center text-gray-900">Campus Locations</h2>
        <div className="space-y-4">
          {locations.map((location) => (
            <div 
              key={location.id} 
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer focus-within:ring-2 focus-within:ring-blue-500"
              onClick={() => handlePinClick(location.exactAddress)}
              onKeyPress={(e) => handleKeyPress(e, location.exactAddress)}
              tabIndex={0}
              role="button"
              aria-label={`View location: ${location.name}`}
            >
              <div className="flex-1 min-w-0 pr-4">
                <h3 className="font-medium text-gray-900">{location.name}</h3>
                <div className="text-sm text-gray-700 flex items-center gap-1">
                  <PhoneIcon className="h-4 w-4 text-gray-500" aria-hidden="true" />
                  <a 
                    href={`tel:${location.building?.replace(/[^0-9]/g, '')}`}
                    className="hover:text-blue-700 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
                    onClick={(e) => handlePhoneClick(e, location.building || '')}
                    aria-label={`Call ${location.name} at ${location.building}`}
                  >
                    {location.building}
                  </a>
                </div>
                {location.description && (
                  <p className="text-sm text-gray-700 mt-1">{location.description}</p>
                )}
                {location.exactAddress && (
                  <p className="text-sm text-gray-700 mt-1">
                    <span className="sr-only">Address: </span>
                    {location.exactAddress}
                  </p>
                )}
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePinClick(location.exactAddress);
                }}
                className="flex-shrink-0 p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                aria-label={`Open ${location.name} in Maps`}
              >
                <MapPinIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 