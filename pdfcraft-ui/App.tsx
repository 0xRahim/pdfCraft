import React from 'react';
import { RouterProvider, usePathname } from './lib/router';
import RootLayout from './app/layout';
import LoginPage from './app/login/page';
import SignupPage from './app/signup/page';
import { DashboardLayout } from './app/dashboard/layout';
import DashboardPage from './app/dashboard/page';
import IntegrationsPage from './app/dashboard/integrations/page';
import SettingsPage from './app/dashboard/settings/page';
import TemplateBuilderPage from './app/dashboard/builder/page';
import TemplatesPage from './app/dashboard/templates/page';

function AppContent() {
  const pathname = usePathname();

  // Route resolver mirroring Next.js App Router file-based system
  const renderRoute = () => {
    if (pathname === '/login') {
      return <LoginPage />;
    }
    if (pathname === '/signup') {
      return <SignupPage />;
    }
    if (pathname.startsWith('/dashboard/templates')) {
      return (
        <DashboardLayout>
          <TemplatesPage />
        </DashboardLayout>
      );
    }
    if (pathname.startsWith('/dashboard/integrations')) {
      return (
        <DashboardLayout>
          <IntegrationsPage />
        </DashboardLayout>
      );
    }
    if (pathname.startsWith('/dashboard/settings')) {
      return (
        <DashboardLayout>
          <SettingsPage />
        </DashboardLayout>
      );
    }
    if (pathname.startsWith('/dashboard/builder')) {
      return (
        <DashboardLayout>
          <TemplateBuilderPage />
        </DashboardLayout>
      );
    }
    // Default dashboard and /dashboard/templates
    return (
      <DashboardLayout>
        <DashboardPage />
      </DashboardLayout>
    );
  };

  return <RootLayout>{renderRoute()}</RootLayout>;
}

export default function App() {
  return (
    <RouterProvider>
      <AppContent />
    </RouterProvider>
  );
}
