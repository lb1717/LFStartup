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
  const [dateDisplay, setDateDisplay] = useState({ display: '', machineReadable: '' });
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
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
    setIsDeleting(true);
    try {
      await onDelete(item.id);
    } catch (error) {
      console.error('Error deleting item:', error);
      setShowDeleteConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't toggle expansion if clicking delete button or during delete confirmation
    if ((e.target as HTMLElement).closest('button') || showDeleteConfirm) {
      return;
    }
    setIsExpanded(!isExpanded);
  };

  if (showDeleteConfirm) {
    return (
      <div className="bg-white rounded-lg shadow-md p-4 border-2 border-red-200">
        <h3 className="text-lg font-semibold mb-4">Delete &ldquo;{item.name}&rdquo;?</h3>
        <p className="text-gray-600 mb-4">This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowDeleteConfirm(false)}
            disabled={isDeleting}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`relative bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 ease-in-out ${
        isExpanded ? 'shadow-lg' : ''
      } cursor-pointer`}
      onClick={handleCardClick}
      role="button"
      aria-label={`Lost item: ${item.name}`}
      aria-pressed={isExpanded}
    >
      <div className="p-4 flex flex-col gap-2">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold leading-6 flex-grow pr-8">{item.name}</h3>
          {isAdmin ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteConfirm(true);
              }}
              disabled={isDeleting}
              className="text-red-500 hover:text-red-700 transition-colors"
              title="Delete item"
              aria-label="Delete item"
            >
              <TrashIcon className="w-5 h-5" />
            </button>
          ) : (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label={isExpanded ? "Show less" : "Show more"}
            >
              {isExpanded ? (
                <ChevronUpIcon className="w-5 h-5" />
              ) : (
                <ChevronDownIcon className="w-5 h-5" />
              )}
            </button>
          )}
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

        <div className="flex items-center text-sm text-gray-500 mt-1">
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
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          {item.location}
        </div>

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
  );
} 