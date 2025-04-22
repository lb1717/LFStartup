import { supabase } from './supabase';
import { LostItem } from '@/data/lostItems';
import { University } from '@/data/universities';

// Get all universities
export async function getAllUniversities(): Promise<University[]> {
  try {
    console.log('Fetching universities from Supabase...');
    const { data, error } = await supabase
      .from('universities')
      .select('*');
    
    if (error) {
      console.error('Error fetching universities:', error);
      return [];
    }
    
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
    const { data, error } = await supabase
      .from('lost_items')
      .select('*')
      .eq('university_id', universityId);
    
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
    
    // Convert camelCase to snake_case for database
    const dbItem = {
      id,
      name: item.name,
      location: item.location,
      date: item.date,
      image: item.image,
      university_id: item.universityId,
      school_name: item.schoolName,
      description: item.description,
      contact_info: item.contactInfo,
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
      date: data[0].date,
      image: data[0].image,
      universityId: data[0].university_id,
      schoolName: data[0].school_name,
      description: data[0].description,
      contactInfo: data[0].contact_info,
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
    
    // First, get the item to find the image path
    const { data: item, error: fetchError } = await supabase
      .from('lost_items')
      .select('image, university_id')
      .eq('id', id)
      .single();
    
    if (fetchError) {
      console.error('Error fetching item for deletion:', fetchError);
      throw new Error(`Failed to fetch item for deletion: ${fetchError.message}`);
    }
    
    // Delete the image from storage if it exists
    if (item.image) {
      // Extract the file path from the URL
      const urlParts = item.image.split('/');
      const fileName = urlParts[urlParts.length - 1];
      const filePath = `${item.university_id}/${fileName}`;
      
      const { error: storageError } = await supabase.storage
        .from('lost-items-images')
        .remove([filePath]);
      
      if (storageError) {
        console.error('Error deleting image from storage:', storageError);
        // Continue with item deletion even if image deletion fails
      }
    }
    
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