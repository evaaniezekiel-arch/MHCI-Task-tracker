"use server";

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getUsers() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }

  return data;
}

export async function promoteToAdmin(userId: string, hours: number) {
  const supabase = await createClient();
  
  const until = new Date();
  until.setHours(until.getHours() + hours);

  const { error } = await supabase
    .from('profiles')
    .update({
      temporary_admin_until: until.toISOString()
    })
    .eq('id', userId);

  if (error) throw error;

  revalidatePath('/admin/users');
}

export async function revokeTemporaryAdmin(userId: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('profiles')
    .update({
      temporary_admin_until: null
    })
    .eq('id', userId);

  if (error) throw error;

  revalidatePath('/admin/users');
}

export async function updateUserDetails(userId: string, updates: any) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);

  if (error) throw error;

  revalidatePath('/admin/users');
}
