import { use } from 'react';
import { getAllUniversities, getLocationsByUniversity } from '@/lib/api';
import { notFound } from 'next/navigation';
import LocationsManager from '@/components/LocationsManager';

interface ManageLocationsPageProps {
  params: {
    schoolId: string;
  };
}

// Generate static params for all universities
export async function generateStaticParams() {
  const universities = await getAllUniversities();
  return universities.map((university) => ({
    schoolId: university.id,
  }));
}

export default async function ManageLocationsPage({ params }: ManageLocationsPageProps) {
  try {
    const { schoolId } = params;
    console.log(`Rendering manage locations page for ID: ${schoolId}`);
    
    // Fetch universities and find the current one
    const universities = await getAllUniversities();
    console.log(`Found ${universities.length} universities`);
    
    const university = universities.find(u => u.id === schoolId);
    console.log(`University found: ${!!university}`);

    if (!university) {
      console.log(`University with ID ${schoolId} not found`);
      notFound();
    }

    // Fetch locations for this university
    const locations = await getLocationsByUniversity(schoolId);
    console.log(`Found ${locations.length} locations for ${university.name}`);

    return <LocationsManager university={university} initialLocations={locations} />;
  } catch (error) {
    console.error('Error in ManageLocationsPage:', error);
    throw error; // Re-throw to let Next.js handle the error
  }
} 