-- Create locations table
CREATE TABLE IF NOT EXISTS public.locations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  university_id TEXT NOT NULL REFERENCES public.universities(id),
  building TEXT NOT NULL,
  floor TEXT,
  room TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create function to create locations table
CREATE OR REPLACE FUNCTION public.create_locations_table()
RETURNS VOID AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS public.locations (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    university_id TEXT NOT NULL REFERENCES public.universities(id),
    building TEXT NOT NULL,
    floor TEXT,
    room TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert sample locations for Harvard
INSERT INTO public.locations (name, university_id, building, floor, room, description)
VALUES
  ('Widener Library', 'harvard', 'Widener Library', '2', 'Main Reading Room', 'The main reading room on the second floor of Widener Library'),
  ('Science Center', 'harvard', 'Science Center', '1', 'Lobby', 'The main lobby of the Science Center'),
  ('Harvard Yard', 'harvard', 'Harvard Yard', NULL, NULL, 'The open space in Harvard Yard')
ON CONFLICT DO NOTHING; 