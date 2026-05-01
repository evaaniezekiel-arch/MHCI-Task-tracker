import React from 'react';
import WeekViewClient from '@/components/tasks/WeekViewClient';
import { createClient } from '@/lib/supabase/server';
import { getTasksByWeek } from '@/actions/tasks';
import { formatDate } from '@/lib/utils';
import { notFound } from 'next/navigation';

export default async function WeekPage({ params }: { params: { weekId: string } }) {
  const supabase = await createClient();
  
  // Fetch week details
  const { data: week, error: weekError } = await supabase
    .from('weeks')
    .select('*')
    .eq('id', params.weekId)
    .single();

  if (weekError || !week) {
    notFound();
  }

  // Fetch initial tasks
  const tasks = await getTasksByWeek(params.weekId);

  return (
    <WeekViewClient 
      weekId={params.weekId}
      initialTasks={tasks}
      weekNumber={week.week_number}
      startDate={formatDate(week.start_date)}
      endDate={formatDate(week.end_date)}
    />
  );
}
