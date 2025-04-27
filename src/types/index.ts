// Define types for the application

export type University = {
  id: string;
  name: string;
  short_name: string;
  description: string;
  created_at: string;
}

export type LostItem = {
  id: number;
  name: string;
  description: string;
  found_by: string;
  found_date: string;
  university_id: string;
  location: string;
  contact_email: string;
  claimed: boolean;
  created_at: string;
}

export type Location = {
  id: number;
  name: string;
  university_id: string;
  building: string;
  floor?: string;
  room?: string;
  description?: string;
  created_at: string;
} 