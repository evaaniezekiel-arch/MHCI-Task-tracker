"use client";

import React from 'react';
import TaskTable from '@/components/tasks/TaskTable';
import { useRealtimeSubscription } from '@/lib/supabase/realtime';
import { Task } from '@/lib/types';

interface WeekViewClientProps {
  weekId: string;
  initialTasks: Task[];
  weekNumber: number;
  startDate: string;
  endDate: string;
}

export default function WeekViewClient({ 
  weekId, 
  initialTasks, 
  weekNumber, 
  startDate, 
  endDate 
}: WeekViewClientProps) {
  // Subscribe to real-time updates for tasks in this week
  useRealtimeSubscription('tasks', `week_id=eq.${weekId}`);

  // Calculate completion
  const total = initialTasks.length;
  const done = initialTasks.filter(t => t.status === 'Done').length;
  const progress = total > 0 ? (done / total) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center space-x-3 mb-1">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Week {weekNumber.toString().padStart(2, '0')}</h1>
            <span className="px-2 py-1 bg-primary text-primary-foreground text-[10px] font-bold rounded uppercase">Active</span>
          </div>
          <p className="text-muted-foreground">{startDate} – {endDate} · Executive Task Overview</p>
        </div>

        <div className="flex flex-col items-end space-y-2">
          <div className="w-full md:w-64 h-2 bg-muted rounded-full overflow-hidden flex">
            <div className="h-full bg-green-500" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            Completion Progress: {Math.round(progress)}% ({done}/{total} Tasks)
          </span>
        </div>
      </div>

      <TaskTable initialTasks={initialTasks} weekId={weekId} />
    </div>
  );
}
