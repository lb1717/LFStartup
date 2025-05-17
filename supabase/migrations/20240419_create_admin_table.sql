-- Create admin table
CREATE TABLE IF NOT EXISTS admins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    school_id TEXT NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    username TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(school_id, username)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_admins_school_username ON admins(school_id, username);

-- Add RLS policies
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;

-- Policy to allow admins to view their own school's admins
CREATE POLICY "Admins can view their own school's admins"
    ON admins FOR SELECT
    USING (school_id = auth.uid());

-- Policy to allow admins to insert new admins for their school
CREATE POLICY "Admins can insert new admins for their school"
    ON admins FOR INSERT
    WITH CHECK (school_id = auth.uid());

-- Policy to allow admins to update their own school's admins
CREATE POLICY "Admins can update their own school's admins"
    ON admins FOR UPDATE
    USING (school_id = auth.uid());

-- Policy to allow admins to delete their own school's admins
CREATE POLICY "Admins can delete their own school's admins"
    ON admins FOR DELETE
    USING (school_id = auth.uid()); 