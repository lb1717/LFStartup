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
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<'title-asc' | 'title-desc' | 'location-asc' | 'location-desc' | 'newest' | 'oldest'>('newest');

  const handleDeleteItem = async (itemId: string) => {
    try {
      await deleteLostItem(itemId);
      setItems(items.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleResetFilters = () => {
    setSelectedLocation('');
    setSelectedCategory('');
    setSortBy('newest');
    setShowFilters(false);
  };

  const filteredAndSortedItems = items
    .filter(item => {
      const searchLower = searchQuery.toLowerCase();
      const nameMatch = item.name.toLowerCase().includes(searchLower);
      const descriptionMatch = item.description 
        ? item.description.toLowerCase().includes(searchLower)
        : false;
      const matchesSearch = nameMatch || descriptionMatch;
      const matchesLocation = !selectedLocation || item.location === selectedLocation;
      const matchesCategory = !selectedCategory || item.category === selectedCategory;
      return matchesSearch && matchesLocation && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'title-asc':
          return a.name.localeCompare(b.name);
        case 'title-desc':
          return b.name.localeCompare(a.name);
        case 'location-asc':
          return (a.location || '').localeCompare(b.location || '');
        case 'location-desc':
          return (b.location || '').localeCompare(a.location || '');
        case 'newest':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'oldest':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        default:
          return 0;
      }
    });

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">{university.name} Lost and Found</h1>
        </div>

        {/* Search and Filter Button */}
        <div className="flex gap-4 mb-4">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search lost items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <svg
              className="absolute right-3 top-3 h-6 w-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <button
            onClick={showFilters ? handleResetFilters : () => setShowFilters(true)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
          >
            {showFilters ? 'Reset Filters' : 'Filter Search'}
          </button>
        </div>

        {/* Filter Dropdowns */}
        {showFilters && (
          <div className="flex flex-col md:flex-row gap-4 p-4 bg-gray-50 rounded-lg mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Locations</option>
                {locations.map(location => (
                  <option key={location.id} value={location.name}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
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
                <option value="Accessories">Accessories</option>
                <option value="Bags & Backpacks">Bags & Backpacks</option>
                <option value="Books & Study Materials">Books & Study Materials</option>
                <option value="Clothing & Shoes">Clothing & Shoes</option>
                <option value="Headphones & Earbuds">Headphones & Earbuds</option>
                <option value="ID Cards & Keys">ID Cards & Keys</option>
                <option value="Jewelry">Jewelry</option>
                <option value="Musical Instruments">Musical Instruments</option>
                <option value="Sports Equipment">Sports Equipment</option>
                <option value="Wallets & Purses">Wallets & Purses</option>
                <option value="Water Bottles & Containers">Water Bottles & Containers</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title-asc">Title (A-Z)</option>
                <option value="title-desc">Title (Z-A)</option>
                <option value="location-asc">Location (A-Z)</option>
                <option value="location-desc">Location (Z-A)</option>
              </select>
            </div>
          </div>
        )}

        {/* Lost Items Grid */}
        <div className="w-full">
          <LostItemsGrid
            items={filteredAndSortedItems}
            onDelete={handleDeleteItem}
            isAdmin={isAdmin}
            isLoading={false}
          />
        </div>

        <LocationsList locations={locations} />
      </div>
    </main>
  );
} 