"use server";

import { createClient, createAdminClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getWeeks(year?: number) {
  const supabase = await createClient();
  
  // If no year specified, fetch all weeks
  let query = supabase
    .from('weeks')
    .select('*')
    .order('week_number', { ascending: true });

  if (year) {
    query = query.eq('year', year);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching weeks:', error);
    return [];
  }

  return data || [];
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

export async function createWeek(weekNumber: number, startDate: string, endDate: string, year: number) {
  // Use anon client for auth check only
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be logged in to create a week.' };
  }

  // Use admin client (service role) to bypass RLS for the write
  const admin = createAdminClient();

  // Ensure profile exists
  await admin.from('profiles').upsert({
    id: user.id,
    email: user.email,
    full_name: user.user_metadata?.full_name || 'Admin User',
    role: 'admin',
  }, { onConflict: 'id' });

  const { data, error } = await admin
    .from('weeks')
    .insert({
      week_number: weekNumber,
      start_date: startDate,
      end_date: endDate,
      year,
      created_by: user.id
    })
    .select()
    .single();

  if (error) {
    console.error('createWeek error:', error);
    return { error: error.message || 'Failed to create week.' };
  }

  revalidatePath('/tasks');
  revalidatePath('/dashboard');
  return { data };
}
