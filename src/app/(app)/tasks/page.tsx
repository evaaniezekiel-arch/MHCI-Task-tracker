import React from 'react';
import { getAllTasks } from '@/actions/tasks';
import { getWeeks } from '@/actions/weeks';
import GlobalTaskView from '@/components/tasks/GlobalTaskView';

export const dynamic = 'force-dynamic';

export default async function TasksPage() {
  let tasks: any[] = [];
  let weeks: any[] = [];

  try {
    [tasks, weeks] = await Promise.all([
      getAllTasks(),
      getWeeks()
    ]);
  } catch (error) {
    console.error('Tasks page data fetch error:', error);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-zinc-500 mt-1">Manage and filter all your tasks across the entire calendar.</p>
        </div>
      </div>

      <GlobalTaskView initialTasks={tasks || []} weeks={weeks || []} />
    </div>
  );
}
