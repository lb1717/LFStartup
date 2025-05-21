'use client';

import { LostItem } from '@/data/lostItems';
import { Location } from '@/data/locations';
import { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon, CheckIcon } from '@heroicons/react/24/solid';

interface LostItemCardProps {
  item: LostItem;
  onDelete: (itemId: string) => Promise<void>;
  isAdmin: boolean;
  onUpdate?: (updatedItem: LostItem) => void;
  locations: Location[];
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

export default function LostItemCard({ item, onDelete, isAdmin, onUpdate, locations }: LostItemCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [dateDisplay, setDateDisplay] = useState({ display: '', machineReadable: '' });
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedItem, setEditedItem] = useState(item);
  const [isSaving, setIsSaving] = useState(false);

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

  const handleEdit = async () => {
    if (isEditing) {
      // Validate required fields
      if (!editedItem.name.trim() || !editedItem.location.trim() || !editedItem.category.trim()) {
        alert('Please fill in all required fields');
        return;
      }

      setIsSaving(true);
      try {
        const updatedItem = await updateLostItem(editedItem);
        if (updatedItem && onUpdate) {
          onUpdate(updatedItem);
          setIsEditing(false);
        }
      } catch (error) {
        console.error('Error updating item:', error);
      } finally {
        setIsSaving(false);
      }
    } else {
      setIsEditing(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditedItem(prev => ({ ...prev, [name]: value }));
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
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={editedItem.name}
              onChange={handleInputChange}
              className="text-lg font-semibold leading-6 flex-grow pr-8 border rounded px-2 py-1"
              onClick={e => e.stopPropagation()}
            />
          ) : (
            <h3 className="text-lg font-semibold leading-6 flex-grow pr-8">{item.name}</h3>
          )}
          {isAdmin && (
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit();
                }}
                disabled={isSaving}
                className="text-blue-500 hover:text-blue-700 transition-colors"
                title={isEditing ? "Save changes" : "Edit item"}
                aria-label={isEditing ? "Save changes" : "Edit item"}
              >
                {isEditing ? (
                  <CheckIcon className="w-5 h-5" />
                ) : (
                  <PencilIcon className="w-5 h-5" />
                )}
              </button>
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
            </div>
          )}
        </div>
        
        {isEditing ? (
          <textarea
            name="description"
            value={editedItem.description || ''}
            onChange={handleInputChange}
            className="text-gray-600 text-sm border rounded px-2 py-1"
            onClick={e => e.stopPropagation()}
            rows={3}
          />
        ) : (
          item.description && (
            <p 
              className={`text-gray-600 text-sm ${
                isExpanded ? '' : 'line-clamp-2'
              } transition-all duration-200`}
              aria-expanded={isExpanded}
            >
              {item.description}
            </p>
          )
        )}

        <div className="flex items-center text-sm text-gray-500 mt-1">
          {isEditing ? (
            <select
              name="location"
              value={editedItem.location}
              onChange={handleInputChange}
              className="border rounded px-2 py-1"
              onClick={e => e.stopPropagation()}
              required
            >
              {locations.map(location => (
                <option key={location.id} value={location.name}>
                  {location.name}
                </option>
              ))}
            </select>
          ) : (
            <div 
              className="flex items-center text-sm font-medium px-2 py-1 rounded-full bg-green-100 text-green-800 w-fit"
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
          )}
        </div>

        {item.category && (
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
            {isEditing ? (
              <select
                name="category"
                value={editedItem.category}
                onChange={handleInputChange}
                className="border rounded px-2 py-1 bg-transparent"
                onClick={e => e.stopPropagation()}
                required
              >
                <option value="">Select Category</option>
                <option value="Electronics">Electronics</option>
                <option value="Accessories">Accessories</option>
                <option value="Bags & Backpacks">Bags & Backpacks</option>
                <option value="Books & Study Materials">Books & Study Materials</option>
                <option value="Clothing & Shoes">Clothing & Shoes</option>
                <option value="Headphones & Earbuds">Headphones & Earbuds</option>
                <option value="ID Cards & Keys">ID Cards & Keys</option>
                <option value="Jewelry">Jewelry</option>
                <option value="Musical Instruments">Musical Instruments</option>
                <option value="Sports Equipment">Sports Equipment</option>
                <option value="Wallets & Purses">Wallets & Purses</option>
                <option value="Water Bottles & Containers">Water Bottles & Containers</option>
                <option value="Other">Other</option>
              </select>
            ) : (
              item.category
            )}
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