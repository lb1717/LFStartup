'use client';

import { LostItem } from '@/data/lostItems';
import { useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';

interface ItemDetailViewProps {
  item: LostItem;
  onDelete: (itemId: string) => Promise<void>;
}

function ItemDetailContent({ item, onDelete }: ItemDetailViewProps) {
  const searchParams = useSearchParams();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold">{item.name}</h2>
          {isAdmin && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-red-500 hover:text-red-700"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          )}
        </div>

        <div className="space-y-4">
          <p className="text-gray-600">{item.description}</p>
          
          <div>
            <h3 className="font-semibold mb-1">Location</h3>
            <p className="text-gray-600">{item.location}</p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-1">Date Found</h3>
            <p className="text-gray-600">{new Date(item.date).toLocaleDateString()}</p>
          </div>

          {showDeleteConfirm && (
            <div className="mt-6 p-4 bg-red-50 rounded-lg">
              <p className="text-red-700 mb-4">Are you sure you want to delete this item?</p>
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
                  {isDeleting ? 'Deleting...' : 'Confirm Delete'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ItemDetailView(props: ItemDetailViewProps) {
  return (
    <Suspense fallback={
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    }>
      <ItemDetailContent {...props} />
    </Suspense>
  );
} 