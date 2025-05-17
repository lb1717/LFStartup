'use client';

import { LostItem } from '@/data/lostItems';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { TrashIcon } from '@heroicons/react/24/outline';

interface LostItemCardProps {
  item: LostItem;
  onDelete: (itemId: string) => Promise<void>;
}

function LostItemCardContent({ item, onDelete }: LostItemCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const searchParams = useSearchParams();
  const isAdmin = searchParams.get('admin') === 'true';

  const handleDelete = async () => {
    if (showDeleteConfirm) {
      setIsDeleting(true);
      try {
        await onDelete(item.id);
      } catch (error) {
        console.error('Error deleting item:', error);
      } finally {
        setIsDeleting(false);
        setShowDeleteConfirm(false);
      }
    } else {
      setShowDeleteConfirm(true);
    }
  };

  return (
    <div className="relative bg-white rounded-lg shadow-md overflow-hidden">
      {isAdmin && (
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="absolute top-2 right-2 p-2 text-red-500 hover:text-red-700 transition-colors z-10"
          title="Delete item"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      )}
      
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
        <p className="text-gray-600 text-sm mb-2">{item.description}</p>
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>{item.location}</span>
          <span>{new Date(item.date).toLocaleDateString()}</span>
        </div>
      </div>

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md mx-4">
            <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
            <p className="text-gray-700 mb-6">Are you sure you want to delete this item? This action cannot be undone.</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:bg-red-400"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function LostItemCard(props: LostItemCardProps) {
  return (
    <Suspense fallback={
      <div className="relative bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
        <div className="p-4">
          <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        </div>
      </div>
    }>
      <LostItemCardContent {...props} />
    </Suspense>
  );
} 