'use client';

import { LostItem } from '@/data/lostItems';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MapPinIcon, TrashIcon } from '@heroicons/react/24/outline';

interface ItemDetailViewProps {
  item: LostItem;
  onDelete: (itemId: string) => Promise<void>;
  onClose: () => void;
}

function ItemDetailViewContent({ item, onDelete, onClose }: ItemDetailViewProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const searchParams = useSearchParams();
  const isAdmin = searchParams.get('admin') === 'true';

  const handleDelete = async () => {
    if (showDeleteConfirm) {
      setIsDeleting(true);
      try {
        await onDelete(item.id);
        onClose();
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
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-start mb-6">
        <h2 className="text-2xl font-bold">{item.name}</h2>
        {isAdmin && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-red-500 hover:text-red-700 transition-colors"
            title="Delete item"
          >
            <TrashIcon className="w-6 h-6" />
          </button>
        )}
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <p className="text-gray-700">{item.description}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Location Found</h3>
          <div className="flex items-center gap-2 text-gray-700">
            <MapPinIcon className="w-5 h-5" />
            <span>{item.location}</span>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Date Found</h3>
          <p className="text-gray-700">
            {new Date(item.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Category</h3>
          <p className="text-gray-700">{item.category}</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Status</h3>
          <p className="text-gray-700 capitalize">{item.status}</p>
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

export default function ItemDetailView(props: ItemDetailViewProps) {
  return (
    <Suspense fallback={
      <div className="p-6 max-w-2xl mx-auto animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-6"></div>
        <div className="space-y-4">
          <div>
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
          </div>
          <div>
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
          <div>
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    }>
      <ItemDetailViewContent {...props} />
    </Suspense>
  );
} 