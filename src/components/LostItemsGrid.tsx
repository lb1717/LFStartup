'use client';

import { useState, useEffect } from 'react';
import { LostItem } from '@/data/lostItems';
import LostItemCard from './LostItemCard';
import { deleteLostItem, getLostItemsByUniversity } from '@/lib/api';

interface LostItemsGridProps {
  initialItems: LostItem[];
  universityId: string;
  schoolName?: string;
}

type SortOption = 'recent' | 'title-asc' | 'title-desc' | 'location-asc' | 'location-desc' | '';

export default function LostItemsGrid({ initialItems, universityId, schoolName }: LostItemsGridProps) {
  const [items, setItems] = useState<LostItem[]>(initialItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<SortOption>('');

  // Update items when initialItems changes
  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  // Refresh items periodically and when the component mounts
  useEffect(() => {
    const refreshItems = async () => {
      try {
        const updatedItems = await getLostItemsByUniversity(universityId);
        setItems(updatedItems);
      } catch (error) {
        console.error('Error refreshing items:', error);
      }
    };

    // Initial refresh
    refreshItems();

    // Set up periodic refresh every 30 seconds
    const intervalId = setInterval(refreshItems, 30000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [universityId]);

  const handleDeleteItem = async (itemId: string) => {
    try {
      const success = await deleteLostItem(itemId);
      if (success) {
        setItems(items.filter(item => item.id !== itemId));
      } else {
        console.error('Failed to delete item from database');
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  // Get unique categories from items
  const categories = Array.from(new Set(items.map(item => item.category)));

  // Filter and sort items
  const filteredAndSortedItems = items
    .filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
      
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'title-asc':
          return a.name.localeCompare(b.name);
        case 'title-desc':
          return b.name.localeCompare(a.name);
        case 'location-asc':
          return a.location.localeCompare(b.location);
        case 'location-desc':
          return b.location.localeCompare(a.location);
        default:
          return 0;
      }
    });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-4">
        <div className="flex-1 max-w-xl">
          <input
            type="text"
            placeholder="Search items..."
            className="w-full px-4 py-2 border rounded-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-48">
          <select
            className="w-full px-4 py-2 border rounded-lg bg-white"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className="w-48">
          <select
            className="w-full px-4 py-2 border rounded-lg bg-white"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
          >
            <option value="">Sort By</option>
            <option value="recent">Most Recently Found</option>
            <option value="title-asc">Title A-Z</option>
            <option value="title-desc">Title Z-A</option>
            <option value="location-asc">Location A-Z</option>
            <option value="location-desc">Location Z-A</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAndSortedItems.map((item) => (
          <LostItemCard
            key={item.id}
            item={item}
            onDelete={handleDeleteItem}
          />
        ))}
      </div>
    </div>
  );
} 