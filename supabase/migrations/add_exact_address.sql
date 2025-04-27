-- Add exact_address column to locations table
ALTER TABLE public.locations 
ADD COLUMN IF NOT EXISTS exact_address TEXT;

-- Update existing locations with sample addresses
UPDATE public.locations 
SET exact_address = '79 Garden St, Cambridge, MA 02138' 
WHERE name = 'Science Center' AND university_id = 'harvard';

UPDATE public.locations 
SET exact_address = 'Harvard Yard, Cambridge, MA 02138' 
WHERE name = 'Harvard Yard' AND university_id = 'harvard';

UPDATE public.locations 
SET exact_address = 'Widener Library, Harvard Yard, Cambridge, MA 02138' 
WHERE name = 'Widener Library' AND university_id = 'harvard'; 