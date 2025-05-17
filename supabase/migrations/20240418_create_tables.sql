-- Create universities table
CREATE TABLE IF NOT EXISTS public.universities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  logo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create lost_items table
CREATE TABLE IF NOT EXISTS public.lost_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  image TEXT,
  university_id TEXT NOT NULL REFERENCES public.universities(id),
  school_name TEXT NOT NULL,
  description TEXT,
  contact_info TEXT,
  status TEXT NOT NULL DEFAULT 'unclaimed',
  category TEXT NOT NULL DEFAULT 'other',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to create universities table
CREATE OR REPLACE FUNCTION public.create_universities_table()
RETURNS VOID AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS public.universities (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    logo TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to create lost_items table
CREATE OR REPLACE FUNCTION public.create_lost_items_table()
RETURNS VOID AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS public.lost_items (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    date DATE NOT NULL,
    image TEXT,
    university_id TEXT NOT NULL REFERENCES public.universities(id),
    school_name TEXT NOT NULL,
    description TEXT,
    contact_info TEXT,
    status TEXT NOT NULL DEFAULT 'unclaimed',
    category TEXT NOT NULL DEFAULT 'other',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 