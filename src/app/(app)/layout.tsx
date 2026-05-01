import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#fafafa]">
      <Sidebar role="admin" />
      <div className="flex-1 flex flex-col transition-all duration-300 ml-16 md:ml-64">
        <Navbar />
        <main className="p-6 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
