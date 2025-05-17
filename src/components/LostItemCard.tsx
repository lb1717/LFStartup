'use client';

import { LostItem } from '@/data/lostItems';
import { useState, useEffect } from 'react';
import Modal from './Modal';
import ItemDetailView from './ItemDetailView';
import { MapPinIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useSearchParams } from 'next/navigation';

interface LostItemCardProps {
  item: LostItem;
  onDelete: (itemId: string) => Promise<void>;
}

export default function LostItemCard({ item, onDelete }: LostItemCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    setIsAdmin(searchParams.get('admin') === 'true');
  }, [searchParams]);

  // Format date consistently
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Truncate description to fit in one line
  const truncateDescription = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + '...';
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the detail modal
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
    <>
      <div 
        className="flex flex-col p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer relative"
        onClick={() => setIsModalOpen(true)}
      >
        {isAdmin && (
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="absolute top-2 right-2 p-1 text-red-500 hover:text-red-700 transition-colors"
            title="Delete item"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        )}
        <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
        <div className="text-sm text-gray-600 space-y-2">
          <div>
            <p className="font-medium">Description</p>
            <p className="mt-1 line-clamp-2">{truncateDescription(item.description)}</p>
          </div>
          <div>
            <div className="flex items-center gap-1">
              <p className="font-medium">Location Found</p>
              <MapPinIcon className="h-4 w-4 text-gray-500" />
            </div>
            <p className="mt-1">{item.location}</p>
          </div>
        </div>
        {showDeleteConfirm && (
          <div className="absolute inset-0 bg-white bg-opacity-95 rounded-lg flex flex-col items-center justify-center p-4">
            <p className="text-red-600 font-medium mb-4">Are you sure you want to delete this item?</p>
            <div className="flex gap-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteConfirm(false);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
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
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <ItemDetailView 
          item={item} 
          onDelete={onDelete} 
          onClose={() => setIsModalOpen(false)} 
        />
      </Modal>
    </>
  );
} 