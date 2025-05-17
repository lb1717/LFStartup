'use client';

import { LostItem } from '@/data/lostItems';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

interface ItemDetailViewProps {
  item: LostItem;
  onDelete: (itemId: string) => Promise<void>;
  onClose: () => void;
}

export default function ItemDetailView({ item, onDelete, onClose }: ItemDetailViewProps) {
  const pathname = usePathname();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = () => {
      const adminSession = localStorage.getItem('adminSession');
      if (adminSession) {
        try {
          const session = JSON.parse(adminSession);
          // Only check if the session is for the current school
          if (session.schoolId === item.universityId) {
            setIsAdmin(true);
            return;
          }
        } catch (error) {
          console.error('Error parsing admin session:', error);
        }
      }
      setIsAdmin(false);
    };

    checkAdminStatus();
    window.addEventListener('storage', checkAdminStatus);
    return () => window.removeEventListener('storage', checkAdminStatus);
  }, [item.universityId]);

  // Format date consistently
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
      }
    } else {
      setShowDeleteConfirm(true);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Item details */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold mb-2">{item.name}</h2>
          <p className="text-gray-600">{item.description}</p>
        </div>

        <div className="space-y-3">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Date Found</h3>
            <p className="text-lg">{formatDate(item.date)}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Location</h3>
            <p className="text-lg">{item.location}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-gray-500">Category</h3>
            <p className="text-lg">{item.category}</p>
          </div>
        </div>

        {/* Delete button - only show for admin users */}
        {isAdmin && (
          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                isDeleting ? 'bg-gray-400 cursor-not-allowed' :
                showDeleteConfirm ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'
              }`}
            >
              {isDeleting ? 'Deleting...' : showDeleteConfirm ? 'Confirm Delete' : 'Delete Item'}
            </button>
            {showDeleteConfirm && !isDeleting && (
              <p className="text-sm text-red-600 mt-2 text-center">
                Are you sure you want to delete this item? This action cannot be undone.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 