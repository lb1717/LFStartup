import { getAllUniversities } from '@/lib/api';
import { notFound } from 'next/navigation';
import AddItemPageClient from './AddItemPageClient';
import ProtectedAdminRoute from '@/components/ProtectedAdminRoute';

interface AddItemPageProps {
  params: Promise<{
    schoolId: string;
  }>;
}

export default async function AddItemPage({ params }: AddItemPageProps) {
  try {
    const { schoolId } = await params;
    console.log(`Rendering add item page for ID: ${schoolId}`);
    
    // Fetch universities and find the current one
    const universities = await getAllUniversities();
    console.log(`Found ${universities.length} universities`);
    
    const university = universities.find(u => u.id === schoolId);
    console.log(`University found: ${!!university}`);

    if (!university) {
      console.log(`University with ID ${schoolId} not found`);
      notFound();
    }

    return (
      <ProtectedAdminRoute schoolId={schoolId}>
        <AddItemPageClient university={university} />
      </ProtectedAdminRoute>
    );
  } catch (error) {
    console.error('Error in AddItemPage:', error);
    throw error;
  }
} 