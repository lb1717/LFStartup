'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function AdminCheckContent({ children }: { children: (isAdmin: boolean) => React.ReactNode }) {
  const searchParams = useSearchParams();
  const isAdmin = searchParams.get('admin') === 'true';
  return <>{children(isAdmin)}</>;
}

export default function AdminCheck({ children }: { children: (isAdmin: boolean) => React.ReactNode }) {
  return (
    <Suspense fallback={<>{children(false)}</>}>
      <AdminCheckContent>{children}</AdminCheckContent>
    </Suspense>
  );
} 