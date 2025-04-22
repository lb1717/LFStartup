import { use } from 'react';
import { getAllUniversities, getLostItemsByUniversity } from '@/lib/api';
import { notFound } from 'next/navigation';
import SchoolPageClient from './SchoolPageClient';

interface SchoolPageProps {
  params: Promise<{
    schoolId: string;
  }>;
}

export default async function SchoolPage({ params }: SchoolPageProps) {
  try {
    const { schoolId } = await params;
    console.log(`Rendering school page for ID: ${schoolId}`);
    
    // Fetch universities and find the current one
    const universities = await getAllUniversities();
    console.log(`Found ${universities.length} universities`);
    
    const university = universities.find(u => u.id === schoolId);
    console.log(`University found: ${!!university}`);

    if (!university) {
      console.log(`University with ID ${schoolId} not found`);
      notFound();
    }

    // Fetch lost items for this university
    const schoolLostItems = await getLostItemsByUniversity(schoolId);
    console.log(`Found ${schoolLostItems.length} lost items for ${university.name}`);

    return <SchoolPageClient university={university} initialItems={schoolLostItems} />;
  } catch (error) {
    console.error('Error in SchoolPage:', error);
    throw error; // Re-throw to let Next.js handle the error
  }
} 