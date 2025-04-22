'use client';

import Image from 'next/image';
import { LostItem } from '@/data/lostItems';
import { useState } from 'react';
import NoImagePlaceholder from './NoImagePlaceholder';

interface ItemDetailViewProps {
  item: LostItem;
  onDelete: (itemId: string) => void;
  onClose: () => void;
}

export default function ItemDetailView({ item, onDelete, onClose }: ItemDetailViewProps) {
  const [showImage, setShowImage] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Function to get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'unclaimed':
        return 'bg-yellow-100 text-yellow-800';
      case 'claimed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDelete = () => {
    if (showDeleteConfirm) {
      onDelete(item.id);
      onClose();
    } else {
      setShowDeleteConfirm(true);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Image section */}
      <div className="mb-6">
        {item.image && showImage ? (
          <div className="relative w-full h-64 rounded-lg overflow-hidden">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
              onError={() => setShowImage(false)}
            />
          </div>
        ) : (
          <NoImagePlaceholder 
            alt={`No image for ${item.name}`} 
            className="h-64 w-full rounded-lg"
          />
        )}
      </div>

      {/* Item details */}
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-bold">{item.name}</h2>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.status)}`}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Location</h3>
            <p className="text-lg">{item.location}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Date Lost</h3>
            <p className="text-lg">{new Date(item.date).toLocaleDateString()}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">Category</h3>
            <p className="text-lg">{item.category}</p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">Description</h3>
          <p className="text-lg">{item.description}</p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-500">Contact Information</h3>
          <p className="text-lg">{item.contactInfo}</p>
        </div>

        {/* Delete button */}
        <div className="pt-4 border-t border-gray-200">
          <button
            onClick={handleDelete}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              showDeleteConfirm ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'
            }`}
          >
            {showDeleteConfirm ? 'Confirm Delete' : 'Delete Item'}
          </button>
          {showDeleteConfirm && (
            <p className="text-sm text-red-600 mt-2 text-center">
              Are you sure you want to delete this item? This action cannot be undone.
            </p>
          )}
        </div>
      </div>
    </div>
  );
} 