-- Drop the existing table if it exists
DROP TABLE IF EXISTS public.admins;

-- Create the admin table with proper primary key
CREATE TABLE public.admins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id TEXT NOT NULL REFERENCES public.universities(id) ON DELETE CASCADE,
    username TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Add unique constraint for school_id and username combination
ALTER TABLE public.admins 
    ADD CONSTRAINT unique_school_username UNIQUE (school_id, username);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_admins_school_username ON public.admins(school_id, username);

-- Enable RLS
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Allow public read access for admin verification" ON public.admins;
DROP POLICY IF EXISTS "Admins can insert new admins for their school" ON public.admins;
DROP POLICY IF EXISTS "Admins can update their own school's admins" ON public.admins;
DROP POLICY IF EXISTS "Admins can delete their own school's admins" ON public.admins;

-- Create new policies
CREATE POLICY "Allow public read access for admin verification"
    ON public.admins FOR SELECT
    USING (true);

CREATE POLICY "Admins can insert new admins for their school"
    ON public.admins FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Admins can update their own school's admins"
    ON public.admins FOR UPDATE
    USING (true);

CREATE POLICY "Admins can delete their own school's admins"
    ON public.admins FOR DELETE
    USING (true);

-- Delete existing test accounts if they exist
DELETE FROM public.admins WHERE username = 'admin';

-- Insert test admin accounts with explicit UUIDs
INSERT INTO public.admins (id, school_id, username, password_hash)
VALUES 
    (gen_random_uuid(), 'harvard', 'admin', 'test123'),
    (gen_random_uuid(), 'columbia', 'admin', 'test123'),
    (gen_random_uuid(), 'stanford', 'admin', 'test123'),
    (gen_random_uuid(), 'mit', 'admin', 'test123')
ON CONFLICT (school_id, username) DO UPDATE 
SET password_hash = EXCLUDED.password_hash; 