'use client';

import { LostItem } from '@/data/lostItems';
import { useState, useEffect } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface LostItemCardProps {
  item: LostItem;
  onDelete: (itemId: string) => Promise<void>;
  isAdmin: boolean;
}

function formatDate(dateString: string): { display: string; machineReadable: string } {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }

    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // ISO format for machine readability
    const machineReadable = date.toISOString();
    
    if (diffDays < 14) {
      if (diffDays === 0) {
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        if (diffHours === 0) {
          const diffMinutes = Math.floor(diffTime / (1000 * 60));
          if (diffMinutes === 0) {
            return { display: 'Just now', machineReadable };
          }
          return { 
            display: `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`,
            machineReadable 
          };
        }
        return { 
          display: `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`,
          machineReadable 
        };
      }
      return { 
        display: `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`,
        machineReadable 
      };
    }
    
    return {
      display: date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      machineReadable
    };
  } catch (error) {
    console.error('Error formatting date:', error);
    return { display: dateString, machineReadable: dateString };
  }
}

export default function LostItemCard({ item, onDelete, isAdmin }: LostItemCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [dateDisplay, setDateDisplay] = useState({ display: '', machineReadable: '' });
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Update date display initially
    setDateDisplay(formatDate(item.date));

    // Update relative time every minute for recent items
    try {
      const date = new Date(item.date);
      if (!isNaN(date.getTime())) {
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 14) {
          const interval = setInterval(() => {
            setDateDisplay(formatDate(item.date));
          }, 60000); // Update every minute

          return () => clearInterval(interval);
        }
      }
    } catch (error) {
      console.error('Error setting up date interval:', error);
    }
  }, [item.date]);

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

  const DeleteModal = () => {
    if (!mounted || !showDeleteConfirm) return null;

    return (
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
    );
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't expand if clicking the delete button
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <div 
        className={`relative bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 ease-in-out ${
          isExpanded ? 'shadow-lg' : ''
        } cursor-pointer`}
        onClick={handleCardClick}
        role="region"
        aria-expanded={isExpanded}
        aria-label="Lost item details"
      >
        {isAdmin && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            disabled={isDeleting}
            className="absolute top-2 right-2 p-2 text-red-500 hover:text-red-700 transition-colors z-10"
            title="Delete item"
            aria-label="Delete item"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        )}
        
        <div className="p-4 flex flex-col gap-2">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-semibold leading-6 flex-grow">{item.name}</h3>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={isExpanded ? "Collapse details" : "Expand details"}
            >
              {isExpanded ? (
                <ChevronUpIcon className="w-5 h-5" />
              ) : (
                <ChevronDownIcon className="w-5 h-5" />
              )}
            </button>
          </div>
          
          {item.description && (
            <p 
              className={`text-gray-600 text-sm ${
                isExpanded ? '' : 'line-clamp-2'
              } transition-all duration-200`}
              aria-expanded={isExpanded}
            >
              {item.description}
            </p>
          )}

          {isExpanded && item.category && (
            <div 
              className="flex items-center text-sm font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-800 w-fit"
              role="status"
            >
              <svg 
                className="w-4 h-4 mr-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
              {item.category}
            </div>
          )}

          <div className="flex items-center text-sm text-gray-500">
            <time dateTime={dateDisplay.machineReadable}>
              {dateDisplay.display}
            </time>
          </div>
        </div>
      </div>
      <DeleteModal />
    </>
  );
} 