"use server";

import { createClient } from '@/lib/supabase/server';

export async function getOverallStats() {
  const supabase = await createClient();
  
  const { data, error } = await supabase.rpc('get_overall_status_counts');

  if (error) {
    console.error('Error fetching overall stats:', error);
    return [];
  }

  return data;
}

export async function getMonthlyPerformance(year: number = 2025) {
  const supabase = await createClient();
  
  const { data, error } = await supabase.rpc('get_monthly_summary', { p_year: year });

  if (error) {
    console.error('Error fetching monthly summary:', error);
    return [];
  }

  return data;
}

export async function getWeeklyTrend(year: number = 2025) {
  const supabase = await createClient();
  
  const { data, error } = await supabase.rpc('get_weekly_completion_trend', { p_year: year });

  if (error) {
    console.error('Error fetching weekly trend:', error);
    return [];
  }

  return data;
}

export async function getWorkload() {
  const supabase = await createClient();
  
  const { data, error } = await supabase.rpc('get_assignee_workload');

  if (error) {
    console.error('Error fetching workload:', error);
    return [];
  }

  return data;
}
