'use client';

import React, { useState } from 'react';
import { University } from '@/data/universities';
import { Location } from '@/data/locations';
import Link from 'next/link';
import { addLocation, updateLocation, deleteLocation } from '@/lib/api';

interface LocationsManagerProps {
  university: University;
  initialLocations: Location[];
}

export default function LocationsManager({ university, initialLocations }: LocationsManagerProps) {
  const [locations, setLocations] = useState<Location[]>(initialLocations);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    building: '',
    floor: '',
    description: '',
    exactAddress: ''
  });
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLocations = () => {
    return locations.filter(location =>
      location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (location.building && location.building.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (location.description && location.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (location.exactAddress && location.exactAddress.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      building: '',
      floor: '',
      description: '',
      exactAddress: ''
    });
  };

  const openAddModal = () => {
    setEditingLocation(null);
    resetForm();
    setIsAddModalOpen(true);
  };

  const closeModal = () => {
    setIsAddModalOpen(false);
    setEditingLocation(null);
    resetForm();
  };

  const openEditModal = (location: Location) => {
    setEditingLocation(location);
    setFormData({
      name: location.name,
      building: location.building,
      floor: location.floor || '',
      description: location.description || '',
      exactAddress: location.exactAddress || ''
    });
    setIsAddModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (editingLocation) {
        // Update existing location
        const updatedLocation = await updateLocation({
          id: editingLocation.id,
          name: formData.name,
          universityId: university.id,
          building: formData.building,
          floor: formData.floor || undefined,
          description: formData.description || undefined,
          exactAddress: formData.exactAddress || undefined
        });

        if (updatedLocation) {
          setLocations(locations.map(loc => 
            loc.id === updatedLocation.id ? updatedLocation : loc
          ));
          closeModal();
        }
      } else {
        // Add new location
        const newLocation = await addLocation({
          name: formData.name,
          universityId: university.id,
          building: formData.building,
          floor: formData.floor || undefined,
          description: formData.description || undefined,
          exactAddress: formData.exactAddress || undefined
        });

        if (newLocation) {
          setLocations([...locations, newLocation]);
          closeModal();
        }
      }
    } catch (error) {
      console.error('Error saving location:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (locationId: string) => {
    if (!confirm('Are you sure you want to delete this location?')) {
      return;
    }

    setIsLoading(true);
    try {
      const success = await deleteLocation(locationId);
      if (success) {
        setLocations(locations.filter(loc => loc.id !== locationId));
      }
    } catch (error) {
      console.error('Error deleting location:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold">Manage Locations</h1>
          <Link
            href={`/${university.id}/portal?admin=true`}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
          >
            Back to Portal
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6 flex justify-between items-center">
            <h2 className="text-xl font-semibold">Lost and Found Locations for {university.name}</h2>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              onClick={openAddModal}
              disabled={isLoading}
            >
              Add Location
            </button>
          </div>
          
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {filteredLocations().length === 0 ? (
            <p className="text-gray-500 py-4">No locations found. Add your first location!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Phone Number
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Address
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredLocations().map((location) => (
                    <tr key={location.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{location.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{location.building}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">{location.exactAddress}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          className="text-blue-600 hover:text-blue-900 mr-4"
                          onClick={() => openEditModal(location)}
                          disabled={isLoading}
                        >
                          Edit
                        </button>
                        <button
                          className="text-red-600 hover:text-red-900"
                          onClick={() => handleDelete(location.id)}
                          disabled={isLoading}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Location Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">
              {editingLocation ? 'Edit Location' : 'Add New Location'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Location Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g., University Library, College Hall"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="building" className="block text-sm font-medium text-gray-700 mb-1">
                  Building
                </label>
                <input
                  type="text"
                  id="building"
                  name="building"
                  value={formData.building}
                  onChange={handleInputChange}
                  placeholder="e.g., Lobby Security Desk, Classroom 1A"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="floor" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  id="floor"
                  name="floor"
                  value={formData.floor}
                  onChange={handleInputChange}
                  placeholder="e.g., (555) 555-1234"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="exactAddress" className="block text-sm font-medium text-gray-700 mb-1">
                  Exact Address (for map)
                </label>
                <input
                  type="text"
                  id="exactAddress"
                  name="exactAddress"
                  value={formData.exactAddress}
                  onChange={handleInputChange}
                  placeholder="e.g., 123 Street, City, MA 01234"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description (optional)
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="e.g., Enter the library through the main entryway, walk down the stairs on the right and the third room on your left"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
} 