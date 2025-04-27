'use client';

import { useState } from 'react';
import { LostItem } from '@/data/lostItems';
import LostItemCard from './LostItemCard';
import Modal from './Modal';
import AddItemForm from './AddItemForm';
import { addLostItem } from '@/lib/api';

interface LostItemsGridProps {
  initialItems: LostItem[];
  universityId: string;
  schoolName?: string;
}

export default function LostItemsGrid({ initialItems, universityId, schoolName }: LostItemsGridProps) {
  const [items, setItems] = useState<LostItem[]>(initialItems);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleAddItem = async (itemData: Omit<LostItem, 'id'>) => {
    try {
      const newItem = await addLostItem(itemData);
      if (newItem) {
        setItems([...items, newItem]);
        setIsAddModalOpen(false);
      }
    } catch (error) {
      console.error('Failed to add item:', error);
    }
  };

  const handleDeleteItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search items..."
          className="px-4 py-2 border rounded-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Add Item
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <LostItemCard
            key={item.id}
            item={item}
            onDelete={handleDeleteItem}
          />
        ))}
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <AddItemForm 
          universityId={universityId}
          schoolName={schoolName}
          onAddItem={handleAddItem}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Modal>
    </div>
  );
} 