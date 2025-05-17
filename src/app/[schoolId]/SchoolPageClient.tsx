'use client';

import { useState } from 'react';
import { University } from '@/data/universities';
import { LostItem } from '@/data/lostItems';
import { Location } from '@/data/locations';
import LostItemsGrid from '@/components/LostItemsGrid';
import LocationsList from '@/components/LocationsList';
import { deleteLostItem } from '@/lib/api';

interface SchoolPageClientProps {
  university: University;
  initialItems: LostItem[];
  locations: Location[];
  isAdmin: boolean;
}

export default function SchoolPageClient({ 
  university, 
  initialItems, 
  locations,
  isAdmin 
}: SchoolPageClientProps) {
  const [items, setItems] = useState(initialItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const handleDeleteItem = async (itemId: string) => {
    try {
      await deleteLostItem(itemId);
      setItems(items.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const filteredItems = items.filter(item => {
    const searchLower = searchQuery.toLowerCase();
    const nameMatch = item.name.toLowerCase().includes(searchLower);
    const descriptionMatch = item.description 
      ? item.description.toLowerCase().includes(searchLower)
      : false;
    const matchesSearch = nameMatch || descriptionMatch;
    const matchesLocation = !selectedLocation || item.location === selectedLocation;
    const matchesCategory = !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesLocation && matchesCategory;
  });

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{university.name} Lost and Found</h1>
        </div>

        {/* Search Section */}
        <div className="mb-8">
          <div className="flex gap-4 mb-4">
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              {showAdvancedSearch ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {showAdvancedSearch && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Locations</option>
                  {locations.map((location) => (
                    <option key={location.id} value={location.id}>
                      {location.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">All Categories</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Books">Books</option>
                  <option value="Accessories">Accessories</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <LostItemsGrid 
          items={filteredItems} 
          onDelete={handleDeleteItem}
          isAdmin={isAdmin}
        />

        <LocationsList locations={locations} />
      </div>
    </main>
  );
} 