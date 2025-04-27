'use client';

import React, { useState, ChangeEvent, useEffect } from 'react';
import { LostItem } from '@/data/lostItems';
import { supabase } from '@/lib/supabase';
import { Location } from '@/data/locations';
import { getLocationsByUniversity } from '@/lib/api';

interface AddItemFormProps {
  universityId: string;
  schoolName?: string;
  onAddItem: (item: Omit<LostItem, 'id'>) => Promise<void>;
  onCancel: () => void;
}

export default function AddItemForm({ universityId, schoolName = "", onAddItem, onCancel }: AddItemFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    contactInfo: '',
    category: 'other'
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLocationId, setSelectedLocationId] = useState<string>('');
  const [isOtherLocation, setIsOtherLocation] = useState(false);
  const [customLocation, setCustomLocation] = useState('');

  // Fetch locations for the university
  useEffect(() => {
    async function fetchLocations() {
      try {
        setIsLoading(true);
        const locationData = await getLocationsByUniversity(universityId);
        setLocations(locationData);
      } catch (err) {
        console.error('Error fetching locations:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLocations();
  }, [universityId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedLocationId(value);
    
    if (value === 'other') {
      setIsOtherLocation(true);
      setFormData(prev => ({ ...prev, location: customLocation }));
    } else {
      setIsOtherLocation(false);
      // Find the location name from the selected ID
      const selectedLocation = locations.find(loc => loc.id === value);
      if (selectedLocation) {
        const locationString = `${selectedLocation.name} (${selectedLocation.building}${selectedLocation.floor ? `, Floor ${selectedLocation.floor}` : ''}${selectedLocation.room ? `, Room ${selectedLocation.room}` : ''})`;
        setFormData(prev => ({ ...prev, location: locationString }));
      }
    }
  };

  const handleCustomLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomLocation(value);
    setFormData(prev => ({ ...prev, location: value }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    // Use a timestamp-based ID instead of Math.random() to avoid hydration issues
    const timestamp = Date.now();
    const fileName = `${timestamp}-${file.name.replace(/\s+/g, '-')}`;
    const filePath = `${universityId}/${fileName}`;
    
    const { error: uploadError, data } = await supabase.storage
      .from('lost-items-images')
      .upload(filePath, file);
    
    if (uploadError) {
      throw new Error(`Failed to upload image: ${uploadError.message}`);
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('lost-items-images')
      .getPublicUrl(filePath);
    
    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsUploading(true);
    
    try {
      let imageUrl = '';
      
      // Upload image if selected
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }
      
      // Create the new item
      const newItem: Omit<LostItem, 'id'> = {
        ...formData,
        image: imageUrl,
        universityId,
        schoolName,
        status: 'unclaimed'
      };
      
      // Add the item
      await onAddItem(newItem);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Item Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
        />
      </div>
      
      <div>
        <label htmlFor="locationSelect" className="block text-sm font-medium text-gray-700 mb-1">
          Location Found
        </label>
        {isLoading ? (
          <div className="text-gray-500">Loading locations...</div>
        ) : (
          <>
            <select
              id="locationSelect"
              value={selectedLocationId}
              onChange={handleLocationChange}
              required
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
            >
              <option value="" disabled>Select a location</option>
              {locations.map(location => (
                <option key={location.id} value={location.id}>
                  {location.name} ({location.building}
                  {location.floor ? `, Floor ${location.floor}` : ''}
                  {location.room ? `, Room ${location.room}` : ''})
                </option>
              ))}
              <option value="other">Other (specify)</option>
            </select>
            
            {isOtherLocation && (
              <div className="mt-2">
                <input
                  type="text"
                  placeholder="Specify location"
                  value={customLocation}
                  onChange={handleCustomLocationChange}
                  required={isOtherLocation}
                  className="block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
                />
              </div>
            )}
          </>
        )}
      </div>
      
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
          Date Found
        </label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
        />
      </div>
      
      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
          Image
        </label>
        <input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
          className="mt-1 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-indigo-50 file:text-indigo-700
            hover:file:bg-indigo-100"
        />
        {imagePreview && (
          <div className="mt-2">
            <img
              src={imagePreview}
              alt="Preview"
              className="h-32 w-32 object-cover rounded-md"
            />
          </div>
        )}
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
        />
      </div>
      
      <div>
        <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700 mb-1">
          Contact Information
        </label>
        <input
          type="text"
          id="contactInfo"
          name="contactInfo"
          value={formData.contactInfo}
          onChange={handleChange}
          placeholder="Email or phone number"
          className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
        />
      </div>
      
      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-4 py-2"
        >
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="accessories">Accessories</option>
          <option value="books">Books</option>
          <option value="other">Other</option>
        </select>
      </div>
      
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isUploading}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isUploading ? 'Adding...' : 'Add Item'}
        </button>
      </div>
    </form>
  );
} 