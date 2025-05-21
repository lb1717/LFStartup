'use client';

import { useState, useEffect } from 'react';
import LostItemsGrid from './LostItemsGrid';
import UniversityImage from './UniversityImage';
import AddItemForm from './AddItemForm';
import { LostItem } from '@/data/lostItems';
import { Location } from '@/data/locations';
import { getLostItemsByUniversity, deleteLostItem, addLostItem } from '@/lib/api';

interface SchoolPageClientProps {
  university: {
    id: string;
    name: string;
    logo?: string;
  };
  locations: Location[];
  isAdmin: boolean;
}

export default function SchoolPageClient({ university, locations, isAdmin }: SchoolPageClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [items, setItems] = useState<LostItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<LostItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState<'title-asc' | 'title-desc' | 'location-asc' | 'location-desc' | 'newest' | 'oldest'>('newest');

  // Fetch items on component mount
  useEffect(() => {
    const fetchItems = async () => {
      const fetchedItems = await getLostItemsByUniversity(university.id);
      setItems(fetchedItems);
    };
    fetchItems();
  }, [university.id]);

  // Filter and sort items when search query, items, location, category, or sort changes
  useEffect(() => {
    let filtered = items.filter(item => {
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

    // Apply sorting
    filtered = [...filtered].sort((a, b) => {
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

    setFilteredItems(filtered);
  }, [searchQuery, items, selectedLocation, selectedCategory, sortBy]);

  const handleDeleteItem = async (itemId: string) => {
    try {
      await deleteLostItem(itemId);
      setItems(prevItems => prevItems.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  const handleAddItem = async (newItemData: Omit<LostItem, 'id'>) => {
    setIsSubmitting(true);
    try {
      const newItem = await addLostItem(newItemData);
      if (newItem) {
        setItems(prevItems => [...prevItems, newItem]);
        setShowAddItemModal(false);
      }
    } catch (error) {
      console.error('Error adding item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col items-center space-y-8">
        {/* University Logo and Title */}
        <div className="text-center">
          {university.logo && (
            <UniversityImage
              src={university.logo}
              alt={`${university.name} logo`}
              size="large"
            />
          )}
          <h1 className="text-3xl font-bold mt-4">{university.name}</h1>
        </div>

        {/* Search and Filters */}
        <div className="w-full max-w-2xl">
          {/* Search Bar */}
          <div className="relative mb-4">
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
        </div>

        {/* Lost Items Grid */}
        <div className="w-full">
          <LostItemsGrid
            items={filteredItems}
            onDelete={handleDeleteItem}
            isAdmin={isAdmin}
            isLoading={false}
            locations={locations}
          />
        </div>

        {/* Add Item Button for Admins */}
        {isAdmin && (
          <button
            onClick={() => setShowAddItemModal(true)}
            className="fixed bottom-8 right-8 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        )}

        {/* Add Item Modal */}
        {showAddItemModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
              <h2 className="text-xl font-bold mb-4">Add Lost Item</h2>
              <AddItemForm
                universityId={university.id}
                schoolName={university.name}
                onAddItem={handleAddItem}
                onCancel={() => setShowAddItemModal(false)}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 