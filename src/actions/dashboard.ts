"use server";

import { createClient } from '@/lib/supabase/server';

// Fallback dashboard stats when RPC functions don't exist
function fallbackStats() {
  return [
    { status: 'Done', count: 0 },
    { status: 'In-Progress', count: 0 },
    { status: 'Pending', count: 0 },
    { status: 'Undone', count: 0 },
    { status: 'KIV', count: 0 },
  ];
}

export async function getOverallStats() {
  const supabase = await createClient();
  
  // Try RPC first, fall back to direct query
  const { data: rpcData, error: rpcError } = await supabase.rpc('get_overall_status_counts');

  if (!rpcError && rpcData) {
    return rpcData;
  }

  // Fallback: query tasks table directly
  const { data: tasks, error } = await supabase
    .from('tasks')
    .select('status');

  if (error || !tasks) return fallbackStats();

  const counts: Record<string, number> = {};
  tasks.forEach(t => {
    counts[t.status] = (counts[t.status] || 0) + 1;
  });

  return [
    { status: 'Done', count: counts['Done'] || 0 },
    { status: 'In-Progress', count: counts['In-Progress'] || 0 },
    { status: 'Pending', count: counts['Pending'] || 0 },
    { status: 'Undone', count: counts['Undone'] || 0 },
    { status: 'KIV', count: counts['KIV'] || 0 },
  ];
}

export async function getMonthlyPerformance(year?: number) {
  const supabase = await createClient();
  const targetYear = year || new Date().getFullYear();
  
  // Try RPC first
  const { data: rpcData, error: rpcError } = await supabase.rpc('get_monthly_summary', { p_year: targetYear });

  if (!rpcError && rpcData) {
    return rpcData;
  }

  // Fallback: build monthly summary from tasks + weeks
  const { data: tasks } = await supabase
    .from('tasks')
    .select('status, created_at');

  if (!tasks) return [];

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return months.map((month, i) => {
    const monthTasks = tasks.filter(t => {
      const d = new Date(t.created_at);
      return d.getMonth() === i && d.getFullYear() === targetYear;
    });
    return {
      month,
      total: monthTasks.length,
      done: monthTasks.filter(t => t.status === 'Done').length,
      in_progress: monthTasks.filter(t => t.status === 'In-Progress').length,
      pending: monthTasks.filter(t => t.status === 'Pending').length,
    };
  });
}

export async function getWeeklyTrend(year?: number) {
  const supabase = await createClient();
  const targetYear = year || new Date().getFullYear();
  
  const { data: rpcData, error: rpcError } = await supabase.rpc('get_weekly_completion_trend', { p_year: targetYear });

  if (!rpcError && rpcData) {
    return rpcData;
  }

  // Fallback: build trend from tasks + weeks
  const { data: weeks } = await supabase
    .from('weeks')
    .select('*, tasks(status)')
    .eq('year', targetYear)
    .order('week_number', { ascending: true });

  if (!weeks) return [];

  return weeks.map(w => ({
    week_number: w.week_number,
    total: (w as any).tasks?.length || 0,
    done: (w as any).tasks?.filter((t: any) => t.status === 'Done').length || 0,
  }));
}

export async function getWorkload() {
  const supabase = await createClient();
  
  const { data: rpcData, error: rpcError } = await supabase.rpc('get_assignee_workload');

  if (!rpcError && rpcData) {
    return rpcData;
  }

  // Fallback: no workload data available without the RPC
  return [];
}
