import { getAllUniversities, getLostItemsByUniversity, getLocationsByUniversity } from '@/lib/api';
import { notFound } from 'next/navigation';
import SchoolPageClient from '../SchoolPageClient';
import type { Metadata } from 'next';
import { getUniversityById } from '@/lib/api';

interface SchoolPageProps {
  params: Promise<{
    schoolId: string;
  }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata(
  { params }: SchoolPageProps,
): Promise<Metadata> {
  const { schoolId } = await params;
  const university = await getUniversityById(schoolId);

  if (!university) {
    return {};
  }

  return {
    title: `Monventa - ${university.name}`,
  };
}

export default async function SchoolPortalPage({ params }: SchoolPageProps) {
  const { schoolId } = await params;
  
  // Fetch universities and find the current one
  const universities = await getAllUniversities();
  const university = universities.find(u => u.id === schoolId);

  if (!university) {
    notFound();
  }

  // Fetch lost items and locations
  const schoolLostItems = await getLostItemsByUniversity(schoolId);
  const locations = await getLocationsByUniversity(schoolId);

  // Admin check will be handled on the client side using session
  // We pass false as default, the client component will check the session
  const isAdmin = false;

  return (
    <SchoolPageClient 
      university={university} 
      initialItems={schoolLostItems} 
      locations={locations}
      isAdmin={isAdmin}
    />
  );
} 