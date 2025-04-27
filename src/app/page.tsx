import { getAllUniversities } from '@/lib/api';
import HomePage from '@/components/HomePage';

export default async function Home() {
  // Fetch universities from Supabase
  const universities = await getAllUniversities();
  
  return <HomePage universities={universities} />;
}
