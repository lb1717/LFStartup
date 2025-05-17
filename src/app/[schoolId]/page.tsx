import { getAllUniversities, getLocationsByUniversity } from '@/lib/api';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import UniversityImage from '@/components/UniversityImage';
import { Location } from '@/data/locations';
import type { Metadata } from 'next';
import { getUniversityById } from '@/lib/api';
import Image from 'next/image';

interface SchoolLandingPageProps {
  params: Promise<{
    schoolId: string;
  }>;
}

export async function generateMetadata(
  { params }: SchoolLandingPageProps,
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

export default async function SchoolLandingPage({ params }: SchoolLandingPageProps) {
  try {
    const { schoolId } = await params;
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
              
              <div className="flex gap-4">
                <Link 
                  href={`/${university.id}/portal`}
                  className="px-8 py-4 bg-blue-500 text-white rounded-lg text-xl font-semibold hover:bg-blue-600 transition-colors shadow-lg"
                >
                  Go to Portal
                </Link>
                <Link
                  href={`/${university.id}/portal?admin=true`}
                  className="px-8 py-4 bg-gray-500 text-white rounded-lg text-xl font-semibold hover:bg-gray-600 transition-colors shadow-lg"
                >
                  Admin Login
                </Link>
              </div>
            </div>

            {/* How Monventa Works Section */}
            <div className="w-full max-w-4xl mt-8 mb-12 text-center">
              <h2 className="text-3xl font-bold mb-8">How Monventa Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[1, 2, 3, 4].map((step) => (
                  <div key={step} className="flex flex-col items-center">
                    <Image
                      src={`/images/tutorial${step}.png`}
                      alt={`Tutorial Step ${step}`}
                      width={300}
                      height={200}
                      className="w-full h-auto rounded-lg shadow-md"
                    />
                    <p className="mt-4 text-lg font-medium">
                      {step === 1 && 'Log in to school portal'}
                      {step === 2 && 'Look for your lost item'}
                      {step === 3 && 'Locate your item'}
                      {step === 4 && 'Collect item at location'}
                    </p>
                  </div>
                ))}
              </div>
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