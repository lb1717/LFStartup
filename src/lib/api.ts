import { supabase } from './supabase';
import { LostItem } from '@/data/lostItems';
import { University } from '@/data/universities';
import { Location } from '@/data/locations';

// Get a university by its ID
export async function getUniversityById(universityId: string): Promise<University | null> {
  try {
    console.log(`Fetching university with ID: ${universityId}`);
    const { data, error } = await supabase
      .from('universities')
      .select('*')
      .eq('id', universityId)
      .single(); // Use single() to expect one row
    
    if (error) {
      console.error('Error fetching university by ID:', error);
      return null;
    }
    
    console.log(`University fetched successfully: ${data ? data.name : 'None'}`);
    // Supabase data is already in camelCase for the University type
    return data;
  } catch (error) {
    console.error('Exception when fetching university by ID:', error);
    return null;
  }
}

// Get all universities
export async function getAllUniversities(): Promise<University[]> {
  try {
    console.log('Fetching universities from Supabase...');
    
    // Using Next.js cache configuration
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/universities?select=*`, {
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
      },
      next: {
        revalidate: 3600 // Cache for 1 hour
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch universities');
    }

    const data = await response.json();
    console.log('Universities fetched successfully:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('Exception when fetching universities:', error);
    return [];
  }
}

// Get lost items for a specific university
export async function getLostItemsByUniversity(universityId: string): Promise<LostItem[]> {
  try {
    console.log(`Fetching lost items for university: ${universityId}`);

    // First, delete expired items (50 days old)
    const fiftyDaysAgo = new Date();
    fiftyDaysAgo.setDate(fiftyDaysAgo.getDate() - 49); // Keep 49-day logic for buffer
    
    // Delete expired items
    const { error: deleteError } = await supabase
      .from('lost_items')
      .delete()
      .lt('date', fiftyDaysAgo.toISOString())
      .eq('university_id', universityId);

    if (deleteError) {
      console.error('Error deleting expired items:', deleteError);
    }

    // Then fetch remaining items (less than 50 days old)
    const { data, error } = await supabase
      .from('lost_items')
      .select('*')
      .eq('university_id', universityId)
      .gte('date', fiftyDaysAgo.toISOString());
    
    if (error) {
      console.error('Error fetching lost items:', error);
      return [];
    }
    
    console.log(`Lost items fetched successfully: ${data?.length || 0}`);
    return data || [];
  } catch (error) {
    console.error('Exception when fetching lost items:', error);
    return [];
  }
}

// Add a new lost item
export async function addLostItem(item: Omit<LostItem, 'id'>): Promise<LostItem | null> {
  try {
    console.log('Adding new lost item:', item.name);
    
    // Generate a unique ID for the item
    const id = crypto.randomUUID();
    
    // Ensure the date is in ISO format
    const date = new Date(item.date).toISOString();
    
    // Convert camelCase to snake_case for database
    const dbItem = {
      id,
      name: item.name,
      location: item.location,
      date,
      university_id: item.universityId,
      school_name: item.schoolName,
      description: item.description,
      status: item.status,
      category: item.category
    };
    
    // Insert the item into the database
    const { data, error } = await supabase
      .from('lost_items')
      .insert([dbItem])
      .select();
    
    if (error) {
      console.error('Error adding lost item:', error);
      return null;
    }
    
    console.log('Raw data returned from Supabase:', data);
    
    // Convert snake_case back to camelCase for frontend
    const frontendItem: LostItem = {
      id: data[0].id,
      name: data[0].name,
      location: data[0].location,
      date: new Date(data[0].date).toISOString(), // Ensure consistent date format
      universityId: data[0].university_id,
      schoolName: data[0].school_name,
      description: data[0].description,
      status: data[0].status,
      category: data[0].category
    };
    
    console.log('Lost item added successfully:', frontendItem.id);
    return frontendItem;
  } catch (error) {
    console.error('Exception when adding lost item:', error);
    return null;
  }
}

// Delete a lost item
export async function deleteLostItem(id: string): Promise<boolean> {
  try {
    console.log(`Deleting lost item: ${id}`);
    
    // Delete the item from the database
    const { error: deleteError } = await supabase
      .from('lost_items')
      .delete()
      .eq('id', id);
    
    if (deleteError) {
      console.error('Error deleting item:', deleteError);
      throw new Error(`Failed to delete item: ${deleteError.message}`);
    }
    
    console.log('Lost item deleted successfully:', id);
    return true;
  } catch (error) {
    console.error('Exception when deleting lost item:', error);
    return false;
  }
}

// Get locations for a specific university
export async function getLocationsByUniversity(universityId: string): Promise<Location[]> {
  try {
    console.log(`Fetching locations for university: ${universityId}`);
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .eq('university_id', universityId);
    
    if (error) {
      console.error('Error fetching locations:', error);
      return [];
    }
    
    // Convert snake_case to camelCase
    const locations: Location[] = (data || []).map(location => ({
      id: location.id,
      name: location.name,
      universityId: location.university_id,
      building: location.building,
      floor: location.floor,
      room: location.room,
      description: location.description,
      exactAddress: location.exact_address,
      createdAt: location.created_at
    }));
    
    console.log(`Locations fetched successfully: ${locations.length}`);
    return locations;
  } catch (error) {
    console.error('Exception when fetching locations:', error);
    return [];
  }
}

// Add a new location
export async function addLocation(location: Omit<Location, 'id'>): Promise<Location | null> {
  try {
    console.log('Adding new location:', location.name);
    
    // Generate a unique ID for the location
    const id = crypto.randomUUID();
    
    // Convert camelCase to snake_case for database
    const dbLocation = {
      id,
      name: location.name,
      university_id: location.universityId,
      building: location.building,
      floor: location.floor,
      room: location.room,
      description: location.description,
      exact_address: location.exactAddress
    };
    
    // Insert the location into the database
    const { data, error } = await supabase
      .from('locations')
      .insert([dbLocation])
      .select();
    
    if (error) {
      console.error('Error adding location:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      throw new Error('Failed to insert location: No data returned');
    }
    
    // Convert snake_case back to camelCase for frontend
    const frontendLocation: Location = {
      id: data[0].id,
      name: data[0].name,
      universityId: data[0].university_id,
      building: data[0].building,
      floor: data[0].floor,
      room: data[0].room,
      description: data[0].description,
      exactAddress: data[0].exact_address,
      createdAt: data[0].created_at
    };
    
    console.log('Location added successfully:', frontendLocation.id);
    return frontendLocation;
  } catch (error: unknown) {
    console.error('Exception when adding location:', error);
    // Re-throw with proper message for better debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    throw new Error(`Failed to add location: ${errorMessage}`);
  }
}

// Update a location
export async function updateLocation(location: Location): Promise<Location | null> {
  try {
    console.log('Updating location:', location.id);
    
    // Convert camelCase to snake_case for database
    const dbLocation = {
      id: location.id,
      name: location.name,
      university_id: location.universityId,
      building: location.building,
      floor: location.floor,
      room: location.room,
      description: location.description,
      exact_address: location.exactAddress
    };
    
    // Update the location in the database
    const { data, error } = await supabase
      .from('locations')
      .update(dbLocation)
      .eq('id', location.id)
      .select();
    
    if (error) {
      console.error('Error updating location:', error);
      throw new Error(`Error updating location: ${error.message}`);
    }
    
    if (!data || data.length === 0) {
      console.error('Location not found:', location.id);
      return null;
    }
    
    // Convert snake_case back to camelCase for frontend
    const frontendLocation: Location = {
      id: data[0].id,
      name: data[0].name,
      universityId: data[0].university_id,
      building: data[0].building,
      floor: data[0].floor,
      room: data[0].room,
      description: data[0].description,
      exactAddress: data[0].exact_address,
      createdAt: data[0].created_at
    };
    
    console.log('Location updated successfully:', frontendLocation.id);
    return frontendLocation;
  } catch (error) {
    console.error('Exception when updating location:', error);
    return null;
  }
}

// Delete a location
export async function deleteLocation(id: string): Promise<boolean> {
  try {
    console.log(`Deleting location: ${id}`);
    
    // Delete the location from the database
    const { error } = await supabase
      .from('locations')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting location:', error);
      throw new Error(`Failed to delete location: ${error.message}`);
    }
    
    console.log('Location deleted successfully:', id);
    return true;
  } catch (error) {
    console.error('Exception when deleting location:', error);
    return false;
  }
}

// Admin authentication functions
export async function verifyAdminCredentials(schoolId: string, username: string, password: string): Promise<boolean> {
  try {
    console.log(`Verifying admin credentials for school: ${schoolId}, username: ${username}`);
    
    // Fetch admin data from Supabase
    const { data, error } = await supabase
      .from('admins')
      .select('password_hash')
      .eq('school_id', schoolId)
      .eq('username', username)
      .single();
    
    if (error) {
      console.error('Error fetching admin data:', error);
      return false;
    }
    
    if (!data) {
      console.log('No admin found with the provided credentials');
      return false;
    }
    
    // For now, we'll do a direct comparison with the hashed password
    // TODO: Implement proper password hashing with bcrypt
    const isValid = data.password_hash === password;
    
    console.log(`Admin verification result: ${isValid ? 'success' : 'failed'}`);
    return isValid;
  } catch (error) {
    console.error('Exception when verifying admin credentials:', error);
    return false;
  }
}

// Update a lost item
export async function updateLostItem(item: LostItem): Promise<LostItem | null> {
  try {
    console.log(`Updating lost item: ${item.id}`);
    
    // Update the item in the database
    const { data, error } = await supabase
      .from('lost_items')
      .update({
        name: item.name,
        location: item.location,
        date: item.date,
        description: item.description,
        category: item.category,
        status: item.status,
        university_id: item.universityId,
        school_name: item.schoolName
      })
      .eq('id', item.id)
      .select();
    
    if (error) {
      console.error('Error updating item:', error);
      throw new Error(`Failed to update item: ${error.message}`);
    }
    
    if (!data || data.length === 0) {
      console.error('Item not found:', item.id);
      return null;
    }
    
    // Convert snake_case back to camelCase for frontend
    const updatedItem: LostItem = {
      id: data[0].id,
      name: data[0].name,
      location: data[0].location,
      date: data[0].date,
      description: data[0].description,
      category: data[0].category,
      status: data[0].status,
      universityId: data[0].university_id,
      schoolName: data[0].school_name
    };
    
    console.log('Lost item updated successfully:', updatedItem.id);
    return updatedItem;
  } catch (error) {
    console.error('Exception when updating lost item:', error);
    return null;
  }
}

// Delete expired items (older than 50 days)
export async function deleteExpiredItems(): Promise<void> {
  try {
    console.log('Checking for expired items...');
    
    const fiftyDaysAgo = new Date();
    fiftyDaysAgo.setDate(fiftyDaysAgo.getDate() - 49); // Keep 49-day logic for buffer
    
    const { error } = await supabase
      .from('lost_items')
      .delete()
      .lt('date', fiftyDaysAgo.toISOString());
    
    if (error) {
      console.error('Error deleting expired items:', error);
      throw error;
    }
    
    console.log('Expired items deleted successfully');
  } catch (error) {
    console.error('Exception when deleting expired items:', error);
  }
}

// Check if an item is nearing expiry (40+ days old, expires at 50 days)
export function isNearingExpiry(date: string): boolean {
  try {
    const itemDate = new Date(date);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays >= 40 && diffDays < 49; // Keep 49-day logic for buffer
  } catch (error) {
    console.error('Error checking item expiry:', error);
    return false;
  }
}

// Get days until expiry (items expire at 50 days)
export function getDaysUntilExpiry(date: string): number {
  try {
    const itemDate = new Date(date);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24));
    return Math.max(0, 49 - diffDays); // Keep 49-day logic for buffer
  } catch (error) {
    console.error('Error calculating days until expiry:', error);
    return 0;
  }
} 