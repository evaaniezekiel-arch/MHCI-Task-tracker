import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import { getWeeks } from '@/actions/weeks';
import { getUser } from '@/actions/auth';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [weeks, user] = await Promise.all([
    getWeeks(), // Fetch ALL weeks (no year filter)
    getUser()
  ]);

  return (
    <div className="flex min-h-screen bg-[#fafafa]">
      <Sidebar role={user?.profile?.effective_role || 'member'} weeks={weeks} />
      <div className="flex-1 flex flex-col transition-all duration-300 ml-16 md:ml-64">
        <Navbar user={user} />
        <main className="p-6 flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}
