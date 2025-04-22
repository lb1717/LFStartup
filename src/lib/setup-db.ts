import { supabase } from './supabase';
import { universities } from '@/data/universities';

// Function to create the universities table
async function createUniversitiesTable() {
  console.log('Creating universities table...');
  
  const { error } = await supabase.rpc('create_universities_table', {});
  
  if (error) {
    console.error('Error creating universities table:', error);
    return false;
  }
  
  console.log('Universities table created successfully');
  return true;
}

// Function to create the lost_items table
async function createLostItemsTable() {
  console.log('Creating lost_items table...');
  
  const { error } = await supabase.rpc('create_lost_items_table', {});
  
  if (error) {
    console.error('Error creating lost_items table:', error);
    return false;
  }
  
  console.log('Lost items table created successfully');
  return true;
}

// Function to insert universities data
async function insertUniversitiesData() {
  console.log('Inserting universities data...');
  
  const { error } = await supabase
    .from('universities')
    .insert(universities);
  
  if (error) {
    console.error('Error inserting universities data:', error);
    return false;
  }
  
  console.log('Universities data inserted successfully');
  return true;
}

// Main function to set up the database
export async function setupDatabase() {
  console.log('Setting up database...');
  
  // Create tables
  const universitiesTableCreated = await createUniversitiesTable();
  const lostItemsTableCreated = await createLostItemsTable();
  
  if (!universitiesTableCreated || !lostItemsTableCreated) {
    console.error('Failed to create tables');
    return false;
  }
  
  // Insert data
  const universitiesDataInserted = await insertUniversitiesData();
  
  if (!universitiesDataInserted) {
    console.error('Failed to insert universities data');
    return false;
  }
  
  console.log('Database setup completed successfully');
  return true;
} 