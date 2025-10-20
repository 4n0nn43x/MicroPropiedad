'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import NavigationSidebar from '@/components/layout/NavigationSidebar';

export default function LayoutProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  // Don't show layout on auth pages only
  const isAuthPage = pathname?.includes('/auth/');

  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-dark-bg">
      {/* Navbar */}
      <Navbar />

      {/* Main Layout with Sidebar */}
      <div className="flex flex-1 overflow-hidden">
        {/* Navigation Sidebar */}
        <NavigationSidebar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
