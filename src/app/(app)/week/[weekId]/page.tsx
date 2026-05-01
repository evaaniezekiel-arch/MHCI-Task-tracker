import React from 'react';
import TaskTable from '@/components/tasks/TaskTable';

export default function WeekPage({ params }: { params: { weekId: string } }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h1 className="text-3xl font-bold tracking-tight">Week 01</h1>
            <span className="px-2 py-1 bg-black text-white text-[10px] font-bold rounded uppercase">Active</span>
          </div>
          <p className="text-zinc-500">06 Jan – 10 Jan 2025 · Executive Task Overview</p>
        </div>

        <div className="flex flex-col items-end space-y-2">
          <div className="w-full md:w-64 h-2 bg-zinc-100 rounded-full overflow-hidden flex">
            <div className="h-full bg-green-500 w-[60%]" />
            <div className="h-full bg-amber-400 w-[20%]" />
            <div className="h-full bg-blue-400 w-[10%]" />
            <div className="h-full bg-red-400 w-[5%]" />
            <div className="h-full bg-purple-400 w-[5%]" />
          </div>
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Completion Progress: 60%</span>
        </div>
      </div>

      <TaskTable />
    </div>
  );
}
