-- Create universities table
CREATE TABLE IF NOT EXISTS public.universities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  logo TEXT
);

-- Create lost_items table
CREATE TABLE IF NOT EXISTS public.lost_items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  date TEXT NOT NULL,
  image TEXT,
  university_id TEXT NOT NULL REFERENCES public.universities(id),
  school_name TEXT NOT NULL,
  description TEXT,
  contact_info TEXT,
  status TEXT NOT NULL,
  category TEXT NOT NULL
);

-- Insert sample universities
INSERT INTO public.universities (id, name, logo)
VALUES
  ('harvard', 'Harvard University', '/images/harvard-logo.png'),
  ('columbia', 'Columbia University', '/images/columbia-logo.png'),
  ('stanford', 'Stanford University', '/images/stanford-logo.png'),
  ('mit', 'MIT', '/images/mit-logo.png')
ON CONFLICT (id) DO NOTHING;

-- Insert sample lost items
INSERT INTO public.lost_items (id, name, location, date, image, university_id, school_name, description, contact_info, status, category)
VALUES
  ('harvard-1', 'MacBook Pro', 'Widener Library', '2023-04-15', '/images/items/macbook.jpg', 'harvard', 'Harvard University', 'Silver MacBook Pro with a small scratch on the top right corner. Contains important research data.', 'Contact the library front desk or email lostandfound@harvard.edu', 'unclaimed', 'Electronics'),
  ('harvard-2', 'iPhone 13', 'Science Center', '2023-04-16', '/images/items/iphone.jpg', 'harvard', 'Harvard University', 'Black iPhone 13 with a blue case. Screen is locked.', 'Contact the Science Center reception or email lostandfound@harvard.edu', 'pending', 'Electronics'),
  ('harvard-3', 'AirPods Pro', 'Harvard Yard', '2023-04-17', '/images/items/airpods.jpg', 'harvard', 'Harvard University', 'White AirPods Pro in a black case.', 'Contact the Harvard Yard office or email lostandfound@harvard.edu', 'unclaimed', 'Electronics')
ON CONFLICT (id) DO NOTHING; 