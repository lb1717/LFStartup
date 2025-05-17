'use client';

import { LostItem } from '@/data/lostItems';
import LostItemCard from './LostItemCard';

interface LostItemsGridProps {
  items: LostItem[];
  onDelete: (itemId: string) => Promise<void>;
  isAdmin: boolean;
}

export default function LostItemsGrid({ items, onDelete, isAdmin }: LostItemsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <LostItemCard
          key={item.id}
          item={item}
          onDelete={onDelete}
          isAdmin={isAdmin}
        />
      ))}
    </div>
  );
} 