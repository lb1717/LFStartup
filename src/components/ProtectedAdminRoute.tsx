'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { isAdminForSchool } from '@/lib/adminSession';

interface ProtectedAdminRouteProps {
  children: React.ReactNode;
  schoolId: string;
}

export default function ProtectedAdminRoute({ children, schoolId }: ProtectedAdminRouteProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const adminStatus = isAdminForSchool(schoolId);
      if (!adminStatus) {
        // Redirect to school landing page if not authorized
        router.replace(`/${schoolId}`);
        return;
      }
      setIsAuthorized(true);
      setIsLoading(false);
    };

    checkAuth();
  }, [schoolId, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authorization...</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
} 