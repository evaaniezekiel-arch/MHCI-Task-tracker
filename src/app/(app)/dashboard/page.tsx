import React from 'react';
import StatCards from '@/components/dashboard/StatCards';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Executive Dashboard</h1>
        <p className="text-zinc-500 mt-1">Real-time overview of task performance across all weeks.</p>
      </div>

      <StatCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white p-6 rounded-xl border border-zinc-100 shadow-sm min-h-[400px]">
          <h3 className="font-bold mb-4">Overall Completion</h3>
          <div className="flex items-center justify-center h-full">
            <p className="text-zinc-400 text-sm italic">Donut Chart Placeholder</p>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-zinc-100 shadow-sm min-h-[400px]">
          <h3 className="font-bold mb-4">Monthly Performance</h3>
          <div className="flex items-center justify-center h-full">
            <p className="text-zinc-400 text-sm italic">Bar Chart Placeholder</p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-zinc-100 shadow-sm">
        <h3 className="font-bold mb-4">Monthly Summary Table</h3>
        <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-lg">
          <p className="text-zinc-400 text-sm italic">Detailed Summary Table Placeholder</p>
        </div>
      </div>
    </div>
  );
}
