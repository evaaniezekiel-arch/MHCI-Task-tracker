"use server";

import { createClient, createAdminClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { Role } from '@/lib/types';

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

export async function updateUserRole(userId: string, role: Role) {
  const admin = createAdminClient();
  
  const { error } = await admin
    .from('profiles')
    .update({ role })
    .eq('id', userId);

  if (error) {
    console.error('Error updating user role:', error);
    return { error: error.message };
  }

  revalidatePath('/admin/users');
  return { success: true };
}

export async function promoteToAdmin(userId: string, hours: number) {
  const admin = createAdminClient();
  
  const until = new Date();
  until.setHours(until.getHours() + hours);

  const { error } = await admin
    .from('profiles')
    .update({
      temporary_admin_until: until.toISOString()
    })
    .eq('id', userId);

  if (error) {
    console.error('Error promoting user:', error);
    return { error: error.message };
  }

  revalidatePath('/admin/users');
  return { success: true };
}

export async function revokeTemporaryAdmin(userId: string) {
  const admin = createAdminClient();
  
  const { error } = await admin
    .from('profiles')
    .update({
      temporary_admin_until: null
    })
    .eq('id', userId);

  if (error) {
    console.error('Error revoking admin:', error);
    return { error: error.message };
  }

  revalidatePath('/admin/users');
  return { success: true };
}

export async function updateUserDetails(userId: string, updates: any) {
  const admin = createAdminClient();
  
  const { error } = await admin
    .from('profiles')
    .update(updates)
    .eq('id', userId);

  if (error) {
    console.error('Error updating user:', error);
    return { error: error.message };
  }

  revalidatePath('/admin/users');
  return { success: true };
}
