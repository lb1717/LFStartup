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
  isSubmitting?: boolean;
}

function getCurrentDateTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function getMinDateTime() {
  const date = new Date();
  date.setDate(date.getDate() - 49);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export default function AddItemForm({ universityId, schoolName, onAddItem, onCancel, isSubmitting = false }: AddItemFormProps) {
  const [locations, setLocations] = useState<Location[]>([]);
  const [dateError, setDateError] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    date: getCurrentDateTime(),
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
    
    // Validate date before submitting
    const selectedDate = new Date(formData.date);
    const minDate = new Date();
    minDate.setDate(minDate.getDate() - 49);
    
    if (selectedDate < minDate) {
      setDateError('Cannot add items older than 50 days');
      return;
    }
    
    setDateError('');
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
    
    if (name === 'date') {
      const selectedDate = new Date(value);
      const minDate = new Date();
      minDate.setDate(minDate.getDate() - 49);
      
      if (selectedDate < minDate) {
        setDateError('Cannot add items older than 50 days');
      } else {
        setDateError('');
      }
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Add Found Item</h2>
        <p className="mt-2 text-gray-600">Add new item that has been found and stored with {schoolName} officials</p>
      </div>
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
            placeholder="eg., Pink Ipad Case, Digital Watch with Dark Green Band"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-3"
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-3"
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
          <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date & Time Found</label>
          <input
            type="datetime-local"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            min={getMinDateTime()}
            max={getCurrentDateTime()}
            required
            className={`mt-1 block w-full rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-3 ${
              dateError ? 'border-red-300' : 'border-gray-300'
            }`}
          />
          {dateError && (
            <p className="mt-1 text-sm text-red-600">{dateError}</p>
          )}
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-3"
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
            placeholder="White Apple Pencil with intials marked in blue"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 px-4 py-3"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Adding Item...' : 'Add Item'}
          </button>
        </div>
      </form>
    </div>
  );
} 