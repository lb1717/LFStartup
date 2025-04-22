'use client';

import { useState } from 'react';
import { University } from '@/data/universities';
import { LostItem } from '@/data/lostItems';
import UniversityImage from '@/components/UniversityImage';
import LostItemCard from '@/components/LostItemCard';
import Modal from '@/components/Modal';
import AddItemForm from '@/components/AddItemForm';
import { addLostItem, deleteLostItem } from '@/lib/api';

interface SchoolPageClientProps {
  university: University;
  initialItems: LostItem[];
}

export default function SchoolPageClient({ university, initialItems }: SchoolPageClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [items, setItems] = useState(initialItems);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteItem = async (itemId: string) => {
    setIsLoading(true);
    const success = await deleteLostItem(itemId);
    if (success) {
      setItems(items.filter(item => item.id !== itemId));
    }
    setIsLoading(false);
  };

  const handleAddItem = async (itemData: Omit<LostItem, 'id'>) => {
    try {
      setIsLoading(true);
      console.log('Adding new item with data:', itemData);
      
      const newItem = await addLostItem({
        ...itemData,
        schoolName: university.name,
      });
      
      console.log('New item returned from API:', newItem);
      
      if (newItem) {
        setItems([...items, newItem]);
        setIsAddModalOpen(false);
        console.log('Item added successfully, updated items count:', items.length + 1);
      } else {
        console.error('Failed to add item, API returned null');
      }
    } catch (error) {
      console.error('Error in handleAddItem:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col items-center mb-12">
          {university.logo && (
            <UniversityImage
              src={university.logo}
              alt={`${university.name} logo`}
              size="large"
            />
          )}
          <h1 className="text-4xl font-bold text-center mb-8">
            {university.name} Lost and Found
          </h1>
          
          <div className="w-full max-w-4xl mb-8">
            <div className="flex justify-between items-center gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search for lost items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-6 py-3 text-lg rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:outline-none shadow-sm"
                />
              </div>
              <button 
                onClick={() => setIsAddModalOpen(true)}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Add Item'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 w-full">
            {filteredItems.map((item) => (
              <LostItemCard 
                key={item.id} 
                item={item} 
                onDelete={handleDeleteItem}
              />
            ))}
          </div>
        </div>
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <AddItemForm
          universityId={university.id}
          onAddItem={handleAddItem}
          onClose={() => setIsAddModalOpen(false)}
        />
      </Modal>
    </main>
  );
} 