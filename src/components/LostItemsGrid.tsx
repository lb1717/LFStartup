'use client';

import { LostItem } from '@/data/lostItems';
import LostItemCard from './LostItemCard';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

interface LostItemsGridProps {
  items: LostItem[];
  onDelete: (itemId: string) => Promise<void>;
}

function LostItemsGridContent({ items, onDelete }: LostItemsGridProps) {
  const searchParams = useSearchParams();
  const isAdmin = searchParams.get('admin') === 'true';

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

export default function LostItemsGrid(props: LostItemsGridProps) {
  return (
    <Suspense fallback={
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="relative bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
            <div className="p-4">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    }>
      <LostItemsGridContent {...props} />
    </Suspense>
  );
} 