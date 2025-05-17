'use client';

import React, { useState, useEffect } from 'react';
import { LostItem } from '@/data/lostItems';
import { Location } from '@/data/locations';
import { getLocationsByUniversity } from '@/lib/api';

interface AddItemFormProps {
  universityId: string;
  schoolName?: string;
  onAddItem: (item: Omit<LostItem, 'id'>) => Promise<void>;
  onCancel: () => void;
}

export default function AddItemForm({ universityId, schoolName, onAddItem, onCancel }: AddItemFormProps) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    category: '',
    status: 'unclaimed' as 'unclaimed' | 'claimed' | 'pending'
  });

  useEffect(() => {
    const fetchLocations = async () => {
      const locations = await getLocationsByUniversity(universityId);
      setLocations(locations);
    };
    fetchLocations();
  }, [universityId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onAddItem({
      name: formData.name,
      location: formData.location,
      date: formData.date,
      description: formData.description,
      category: formData.category,
      status: formData.status,
      universityId,
      schoolName: schoolName || '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Item Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location Found</label>
        <select
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="">Select a location</option>
          {locations.map(location => (
            <option key={location.id} value={location.name}>
              {location.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date Found</label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="" disabled>Select a category</option>
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
      </div>

      <div className="mb-4">
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add Item
        </button>
      </div>
    </form>
  );
} 