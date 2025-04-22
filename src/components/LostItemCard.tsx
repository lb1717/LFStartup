'use client';

import Image from 'next/image';
import { LostItem } from '@/data/lostItems';
import { useState } from 'react';
import Modal from './Modal';
import ItemDetailView from './ItemDetailView';
import NoImagePlaceholder from './NoImagePlaceholder';

interface LostItemCardProps {
  item: LostItem;
  onDelete: (itemId: string) => void;
}

export default function LostItemCard({ item, onDelete }: LostItemCardProps) {
  const [showImage, setShowImage] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div 
        className="flex flex-col p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="relative w-full h-48 mb-4">
          {item.image && showImage ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="rounded-lg object-cover"
              onError={() => setShowImage(false)}
            />
          ) : (
            <NoImagePlaceholder 
              alt={`No image for ${item.name}`} 
              className="h-full w-full rounded-lg"
            />
          )}
        </div>
        <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
        <div className="text-sm text-gray-600">
          <p><span className="font-medium">Location:</span> {item.location}</p>
          <p><span className="font-medium">Date:</span> {new Date(item.date).toLocaleDateString()}</p>
        </div>
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