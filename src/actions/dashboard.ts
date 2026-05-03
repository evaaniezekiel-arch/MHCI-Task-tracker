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
  try {
    const supabase = await createClient();
    
    // Try RPC first, fall back to direct query
    const { data: rpcData, error: rpcError } = await supabase.rpc('get_overall_status_counts');

    if (!rpcError && rpcData && Array.isArray(rpcData) && rpcData.length > 0) {
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
  } catch {
    return fallbackStats();
  }
}

export async function getMonthlyPerformance(year?: number) {
  const targetYear = year || new Date().getFullYear();
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  try {
    const supabase = await createClient();
    
    // Try RPC first
    const { data: rpcData, error: rpcError } = await supabase.rpc('get_monthly_summary', { p_year: targetYear });

    if (!rpcError && rpcData && Array.isArray(rpcData) && rpcData.length > 0) {
      return rpcData;
    }

    // Fallback: build monthly summary from tasks
    const { data: tasks } = await supabase
      .from('tasks')
      .select('status, created_at');

    if (!tasks) {
      return months.map(month => ({ month, total: 0, done: 0, in_progress: 0, pending: 0 }));
    }

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
  } catch {
    return months.map(month => ({ month, total: 0, done: 0, in_progress: 0, pending: 0 }));
  }
}

export async function getWeeklyTrend(year?: number) {
  const targetYear = year || new Date().getFullYear();

  try {
    const supabase = await createClient();
    
    const { data: rpcData, error: rpcError } = await supabase.rpc('get_weekly_completion_trend', { p_year: targetYear });

    if (!rpcError && rpcData && Array.isArray(rpcData) && rpcData.length > 0) {
      return rpcData;
    }

    // Fallback: build trend from tasks + weeks
    const { data: weeksData } = await supabase
      .from('weeks')
      .select('id, week_number')
      .eq('year', targetYear)
      .order('week_number', { ascending: true });

    if (!weeksData || weeksData.length === 0) return [];

    const { data: tasks } = await supabase
      .from('tasks')
      .select('week_id, status');

    if (!tasks) return [];

    return weeksData.map(w => {
      const weekTasks = tasks.filter(t => t.week_id === w.id);
      const total = weekTasks.length;
      const done = weekTasks.filter(t => t.status === 'Done').length;
      return {
        week_number: w.week_number,
        total,
        done,
        completion_pct: total > 0 ? Math.round((done / total) * 100) : 0,
      };
    });
  } catch {
    return [];
  }
}

export async function getWorkload() {
  try {
    const supabase = await createClient();
    
    const { data: rpcData, error: rpcError } = await supabase.rpc('get_assignee_workload');

    if (!rpcError && rpcData) {
      return rpcData;
    }

    return [];
  } catch {
    return [];
  }
}
