import Link from 'next/link';
import { University } from '@/data/universities';
import UniversityImage from './UniversityImage';

interface UniversityCardProps {
  university: University;
}

export default function UniversityCard({ university }: UniversityCardProps) {
  return (
    <Link href={`/${university.id}`} className="block">
      <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
        {university.logo && (
          <UniversityImage
            src={university.logo}
            alt={`${university.name} logo`}
            size="small"
          />
        )}
        <h2 className="text-xl font-semibold text-center">{university.name}</h2>
      </div>
    </Link>
  );
} 