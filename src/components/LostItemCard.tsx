'use client';

import { LostItem } from '@/data/lostItems';
import { Location } from '@/data/locations';
import { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon, CheckIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';
import { updateLostItem, isNearingExpiry, getDaysUntilExpiry } from '@/lib/api';

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

  const daysUntilExpiry = getDaysUntilExpiry(item.date);
  const isExpiring = isNearingExpiry(item.date);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (!isEditing) {
        setIsExpanded(!isExpanded);
      }
    }
  };

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
      const errors: { [key: string]: string } = {};
      if (!editedItem.name.trim()) {
        errors.name = 'Name is required';
      }
      if (!editedItem.location.trim()) {
        errors.location = 'Location is required';
      }
      if (!editedItem.category.trim()) {
        errors.category = 'Category is required';
      }

      if (Object.keys(errors).length > 0) {
        // Set error messages and announce to screen readers
        const errorMessage = Object.values(errors).join('. ');
        const errorAlert = document.createElement('div');
        errorAlert.setAttribute('role', 'alert');
        errorAlert.setAttribute('aria-live', 'polite');
        errorAlert.textContent = errorMessage;
        document.body.appendChild(errorAlert);
        setTimeout(() => errorAlert.remove(), 5000);
        return;
      }

      setIsSaving(true);
      try {
        const updatedItem = await updateLostItem(editedItem);
        if (updatedItem && onUpdate) {
          onUpdate(updatedItem);
          setIsEditing(false);
          // Announce success to screen readers
          const successAlert = document.createElement('div');
          successAlert.setAttribute('role', 'alert');
          successAlert.setAttribute('aria-live', 'polite');
          successAlert.textContent = 'Item updated successfully';
          document.body.appendChild(successAlert);
          setTimeout(() => successAlert.remove(), 5000);
        }
      } catch (error) {
        console.error('Error updating item:', error);
        // Announce error to screen readers
        const errorAlert = document.createElement('div');
        errorAlert.setAttribute('role', 'alert');
        errorAlert.setAttribute('aria-live', 'polite');
        errorAlert.textContent = 'Error updating item. Please try again.';
        document.body.appendChild(errorAlert);
        setTimeout(() => errorAlert.remove(), 5000);
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
      <div 
        className="bg-white rounded-lg border-2 border-red-200 shadow-[0_2px_8px_rgba(0,0,0,0.1)] p-4"
        role="alertdialog"
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <h3 id="delete-dialog-title" className="text-lg font-semibold mb-4">Delete &ldquo;{item.name}&rdquo;?</h3>
        <p id="delete-dialog-description" className="text-gray-700 mb-4">This action cannot be undone.</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowDeleteConfirm(false)}
            disabled={isDeleting}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            aria-busy={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`relative bg-white rounded-lg border border-gray-200 shadow-[0_2px_8px_rgba(0,0,0,0.1)] overflow-hidden transition-all duration-200 ease-in-out ${
        isExpanded ? 'shadow-lg ring-1 ring-gray-200' : ''
      } hover:shadow-lg hover:border-gray-300`}
      onClick={handleCardClick}
      onKeyPress={handleKeyPress}
      role="article"
      tabIndex={0}
      aria-expanded={isExpanded}
      aria-label={`Lost item: ${item.name}. ${item.description ? `Description: ${item.description}` : ''}`}
    >
      <div className="p-4 flex flex-col gap-2">
        <div className="flex justify-between items-start">
          {isEditing ? (
            <div className="flex-grow">
              <label htmlFor={`name-${item.id}`} className="sr-only">Item name</label>
              <input
                id={`name-${item.id}`}
                type="text"
                name="name"
                value={editedItem.name}
                onChange={handleInputChange}
                className="text-lg font-semibold leading-6 w-full pr-8 border rounded px-2 py-1 focus:ring-2 focus:ring-blue-500"
                onClick={e => e.stopPropagation()}
                required
                aria-required="true"
              />
            </div>
          ) : (
            <h3 className="text-lg font-semibold leading-6 flex-grow pr-8 text-gray-900">{item.name}</h3>
          )}
          {isAdmin && (
            <div className="flex gap-2" aria-label="Item actions">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleEdit();
                }}
                disabled={isSaving}
                className="text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1 transition-colors"
                title={isEditing ? "Save changes" : "Edit item"}
                aria-label={isEditing ? "Save changes" : "Edit item"}
              >
                {isEditing ? (
                  <CheckIcon className="w-5 h-5" aria-hidden="true" />
                ) : (
                  <PencilIcon className="w-5 h-5" aria-hidden="true" />
                )}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteConfirm(true);
                }}
                disabled={isDeleting}
                className="text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full p-1 transition-colors"
                title="Delete item"
                aria-label={`Delete item: ${item.name}`}
              >
                <TrashIcon className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>
          )}
        </div>
        
        {isEditing ? (
          <div>
            <label htmlFor={`description-${item.id}`} className="sr-only">Item description</label>
            <textarea
              id={`description-${item.id}`}
              name="description"
              value={editedItem.description || ''}
              onChange={handleInputChange}
              className="text-gray-700 text-sm w-full border rounded px-2 py-1 focus:ring-2 focus:ring-blue-500"
              onClick={e => e.stopPropagation()}
              rows={3}
              aria-label="Item description"
            />
          </div>
        ) : (
          item.description && (
            <p 
              className={`text-gray-700 text-sm ${
                isExpanded ? '' : 'line-clamp-2'
              } transition-all duration-200`}
            >
              {item.description}
            </p>
          )
        )}

        <div className="flex items-center text-sm mt-1">
          {isEditing ? (
            <div className="w-full">
              <label htmlFor={`location-${item.id}`} className="sr-only">Location</label>
              <select
                id={`location-${item.id}`}
                name="location"
                value={editedItem.location}
                onChange={handleInputChange}
                className="w-full border rounded px-2 py-1 focus:ring-2 focus:ring-blue-500"
                onClick={e => e.stopPropagation()}
                required
                aria-required="true"
              >
                <option value="">Select a location</option>
                {locations.map(location => (
                  <option key={location.id} value={location.name}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>
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

        <div className="flex items-center text-sm text-gray-700 gap-2">
          <time dateTime={dateDisplay.machineReadable} aria-label="Item date">
            {dateDisplay.display}
          </time>
          {isAdmin && isExpiring && (
            <div 
              className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full flex items-center gap-1"
              role="alert"
            >
              <ExclamationCircleIcon className="w-3 h-3" aria-hidden="true" />
              <span>Expires in {daysUntilExpiry} days</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 