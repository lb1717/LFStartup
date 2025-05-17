import { getAllUniversities, getLostItemsByUniversity, getLocationsByUniversity } from '@/lib/api';
import { notFound } from 'next/navigation';
import SchoolPageClient from '../SchoolPageClient';
import type { Metadata } from 'next';
import { getUniversityById } from '@/lib/api';

interface SchoolPageProps {
  params: {
    schoolId: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata(
  { params }: SchoolPageProps,
): Promise<Metadata> {
  const { schoolId } = params;
  const university = await getUniversityById(schoolId);

  if (!university) {
    return {};
  }

  return {
    title: `Monventa - ${university.name}`,
  };
}

export default async function SchoolPortalPage({ params, searchParams }: SchoolPageProps) {
  const { schoolId } = params;
  
  // Fetch universities and find the current one
  const universities = await getAllUniversities();
  const university = universities.find(u => u.id === schoolId);

  if (!university) {
    notFound();
  }

  // Fetch lost items and locations
  const schoolLostItems = await getLostItemsByUniversity(schoolId);
  const locations = await getLocationsByUniversity(schoolId);

  // Simple admin check from URL
  const isAdmin = searchParams.admin === 'true';

  return (
    <SchoolPageClient 
      university={university} 
      initialItems={schoolLostItems} 
      locations={locations}
      isAdmin={isAdmin}
    />
  );
} 