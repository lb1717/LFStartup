'use client';

import { LostItem } from '@/data/lostItems';
import LostItemCard from './LostItemCard';
import AdminCheck from './AdminCheck';

interface LostItemsGridProps {
  items: LostItem[];
  onDelete: (itemId: string) => Promise<void>;
}

export default function LostItemsGrid({ items, onDelete }: LostItemsGridProps) {
  return (
    <AdminCheck>
      {(isAdmin) => (
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
      )}
    </AdminCheck>
  );
} 