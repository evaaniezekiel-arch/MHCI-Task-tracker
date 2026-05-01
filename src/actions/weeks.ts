"use server";

import { createClient } from '@/lib/supabase/server';

export async function getWeeks(year: number = 2025) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('weeks')
    .select('*')
    .eq('year', year)
    .order('week_number', { ascending: true });

  if (error) {
    console.error('Error fetching weeks:', error);
    return [];
  }

  return data;
}

export async function getCurrentWeek() {
  const supabase = await createClient();
  const now = new Date().toISOString().split('T')[0];

  const { data, error } = await supabase
    .from('weeks')
    .select('*')
    .lte('start_date', now)
    .gte('end_date', now)
    .single();

  if (error) return null;
  return data;
}
