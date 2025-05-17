'use client';

import { University } from '@/data/universities';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AddItemForm from '@/components/AddItemForm';
import { addLostItem } from '@/lib/api';
import { LostItem } from '@/data/lostItems';

interface AddItemPageClientProps {
  university: University;
}

export default function AddItemPageClient({ university }: AddItemPageClientProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddItem = async (itemData: Omit<LostItem, 'id'>) => {
    setIsSubmitting(true);
    try {
      const newItem = await addLostItem({
        ...itemData,
        universityId: university.id,
        schoolName: university.name,
        status: 'unclaimed'
      });
      
      if (newItem) {
        // Navigate back to the portal page with a refresh
        router.replace(`/${university.id}/portal?admin=true`);
      }
    } catch (error) {
      console.error('Failed to add item:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Add Lost Item</h1>
          <p className="text-gray-600">Add a new item to the {university.name} lost and found.</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <AddItemForm
            universityId={university.id}
            schoolName={university.name}
            onAddItem={handleAddItem}
            onCancel={() => router.back()}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </main>
  );
} 