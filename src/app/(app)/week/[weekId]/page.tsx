import React from 'react';
import WeekViewClient from '@/components/tasks/WeekViewClient';
import { createClient } from '@/lib/supabase/server';
import { getTasksByWeek } from '@/actions/tasks';
import { formatDate } from '@/lib/utils';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function WeekPage({ params }: { params: Promise<{ weekId: string }> }) {
  const { weekId } = await params;

  try {
    const supabase = await createClient();
    
    const { data: week, error: weekError } = await supabase
      .from('weeks')
      .select('*')
      .eq('id', weekId)
      .single();

    if (weekError || !week) {
      notFound();
    }

    const tasks = await getTasksByWeek(weekId);

    return (
      <WeekViewClient 
        weekId={weekId}
        initialTasks={tasks || []}
        weekNumber={week.week_number}
        startDate={formatDate(week.start_date)}
        endDate={formatDate(week.end_date)}
      />
    );
  } catch {
    notFound();
  }
}
