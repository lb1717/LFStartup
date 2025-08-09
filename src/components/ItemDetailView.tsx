'use client';

import { useState, useEffect } from 'react';
import { LostItem } from '@/data/lostItems';
import { isAdminForSchool } from '@/lib/adminSession';

interface ItemDetailViewProps {
  item: LostItem;
  onDelete: (itemId: string) => Promise<void>;
}

function ItemDetailContent({ item, onDelete }: ItemDetailViewProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const adminStatus = isAdminForSchool(item.universityId);
    setIsAdmin(adminStatus);
  }, [item.universityId]);

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

  if (!mounted) {
    return null;
  }

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

        {showDeleteConfirm && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800 mb-2">Are you sure you want to delete this item?</p>
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Details</h3>
            <div className="space-y-2">
              <p><span className="font-medium">Name:</span> {item.name}</p>
              <p><span className="font-medium">Category:</span> {item.category}</p>
              <p><span className="font-medium">Location:</span> {item.location || 'Unknown'}</p>
              <p><span className="font-medium">Date Found:</span> {new Date(item.date).toLocaleDateString()}</p>
              <p><span className="font-medium">Status:</span> 
                <span className={`ml-2 px-2 py-1 rounded text-sm ${
                  item.status === 'claimed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {item.status === 'claimed' ? 'Claimed' : 'Unclaimed'}
                </span>
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700">{item.description || 'No description provided.'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ItemDetailView(props: ItemDetailViewProps) {
  return <ItemDetailContent {...props} />;
} 