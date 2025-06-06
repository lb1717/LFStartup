'use client';

import { Location } from '@/data/locations';

interface LocationListItemProps {
  location: Location;
}

export default function LocationListItem({ location }: LocationListItemProps) {
  const handleMapClick = () => {
    if (location.exactAddress) {
      const encodedAddress = encodeURIComponent(location.exactAddress);
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank');
    }
  };

  const handlePhoneClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const phoneNumber = location.building?.replace(/[^0-9]/g, '');
    window.location.href = `tel:${phoneNumber}`;
  };

  return (
    <li 
      className="p-3 border border-gray-200 rounded-md hover:bg-gray-50 cursor-pointer"
      onClick={handleMapClick}
    >
      <div className="font-medium">{location.name}</div>
      <div className="text-sm text-gray-500">
        <span>Phone: </span>
        <a 
          href={`tel:${location.building?.replace(/[^0-9]/g, '')}`}
          className="hover:text-blue-600 hover:underline"
          onClick={handlePhoneClick}
        >
          {location.building}
        </a>
      </div>
      {location.exactAddress && (
        <div className="text-sm text-gray-500 mt-1">{location.exactAddress}</div>
      )}
    </li>
  );
} 