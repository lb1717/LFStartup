import { use } from 'react';
import { getAllUniversities, getLocationsByUniversity } from '@/lib/api';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import UniversityImage from '@/components/UniversityImage';
import { Location } from '@/data/locations';

interface SchoolLandingPageProps {
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

export default async function SchoolLandingPage({ params }: SchoolLandingPageProps) {
  try {
    const { schoolId } = params;
    console.log(`Rendering school landing page for ID: ${schoolId}`);
    
    // Fetch universities and find the current one
    const universities = await getAllUniversities();
    console.log(`Found ${universities.length} universities`);
    
    const university = universities.find(u => u.id === schoolId);
    console.log(`University found: ${!!university}`);

    if (!university) {
      console.log(`University with ID ${schoolId} not found`);
      notFound();
    }

    // Fetch locations for this university from Supabase
    const locations = await getLocationsByUniversity(schoolId);
    console.log(`Found ${locations.length} locations for ${university.name}`);

    return (
      <main className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center mb-12">
            {university.logo && (
              <UniversityImage
                src={university.logo}
                alt={`${university.name} logo`}
                size="large"
              />
            )}
            <h1 className="text-4xl font-bold text-center mb-8">
              {university.name}
            </h1>
            
            <div className="flex flex-col items-center mt-4 mb-10">
              <p className="text-xl text-gray-700 text-center mb-8">
                Welcome to the {university.name} Lost and Found platform.
              </p>
              
              <Link 
                href={`/${university.id}/portal`}
                className="px-8 py-4 bg-blue-500 text-white rounded-lg text-xl font-semibold hover:bg-blue-600 transition-colors shadow-lg"
              >
                Go to Portal
              </Link>
            </div>
            
            {/* Lost and Found Locations */}
            <div className="w-full max-w-3xl mt-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">Lost and Found Locations</h2>
                
                {locations.length === 0 ? (
                  <p className="text-gray-500">No locations found for this university.</p>
                ) : (
                  <ul className="space-y-2">
                    {locations.map((location: Location) => (
                      <li key={location.id} className="p-3 border border-gray-200 rounded-md hover:bg-gray-50">
                        <div className="font-medium">{location.name}</div>
                        <div className="text-sm text-gray-500">
                          <span>{location.building}</span>
                          {location.floor && <span>, Floor {location.floor}</span>}
                          {location.room && <span>, Room {location.room}</span>}
                        </div>
                        {location.exactAddress && (
                          <div className="text-sm text-gray-500 mt-1">{location.exactAddress}</div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error('Error in SchoolLandingPage:', error);
    throw error; // Re-throw to let Next.js handle the error
  }
} 