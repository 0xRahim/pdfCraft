import React, { useEffect } from 'react';
import { useRouter } from '../lib/router';
import DashboardPage from './dashboard/page';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // If user opens root, stay on dashboard
  }, [router]);

  return <DashboardPage />;
}
