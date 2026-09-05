import React from 'react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface-page font-body text-gray-700 antialiased selection:bg-brand-500 selection:text-white">
      {children}
    </div>
  );
}
