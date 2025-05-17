// This script creates the necessary storage bucket in Supabase
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
  const envConfig = dotenv.parse(fs.readFileSync(envPath));
  Object.entries(envConfig).forEach(([key, value]) => {
    process.env[key] = value;
  });
  console.log('Loaded environment variables from .env.local');
} else {
  console.error('.env.local file not found');
  process.exit(1);
}

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env.local file.');
  process.exit(1);
}

console.log('Initializing Supabase client with URL:', supabaseUrl);
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function createBucket() {
  try {
    // Check if bucket already exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      return;
    }
    
    const bucketExists = buckets.some(bucket => bucket.name === 'lost-items-images');
    
    if (bucketExists) {
      console.log('Bucket "lost-items-images" already exists.');
      return;
    }
    
    // Create the bucket
    const { error } = await supabase.storage.createBucket('lost-items-images', {
      public: true, // Make the bucket public
      fileSizeLimit: 5242880, // 5MB limit
    });
    
    if (error) {
      console.error('Error creating bucket:', error);
      return;
    }
    
    console.log('Bucket "lost-items-images" created successfully!');
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

createBucket(); 