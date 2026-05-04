"use server";

import { createClient, createAdminClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addAssignee(taskId: string, userId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'Unauthorized' };

  const admin = createAdminClient();

  const { data, error } = await admin
    .from('task_assignees')
    .insert({
      task_id: taskId,
      user_id: userId,
      assigned_by: user.id
    })
    .select('*, user:user_id(*)')
    .single();

  if (error) return { error: error.message };

  return { data };
}

export async function inviteExternalAssignee(taskId: string, email: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'Unauthorized' };

  const admin = createAdminClient();

  // Check if user already exists
  const { data: existingUser } = await admin
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single();

  if (existingUser) {
    return addAssignee(taskId, existingUser.id);
  }

  // Create pending invite record
  const inviteToken = crypto.randomUUID();
  
  const { data, error } = await admin
    .from('task_assignees')
    .insert({
      task_id: taskId,
      invited_email: email,
      invite_token: inviteToken,
      assigned_by: user.id,
      invite_status: 'pending'
    })
    .select()
    .single();

  if (error) return { error: error.message };

  return { data };
}

export async function removeAssignee(taskId: string, assigneeId: string) {
  const admin = createAdminClient();
  
  const { error } = await admin
    .from('task_assignees')
    .delete()
    .eq('id', assigneeId);

  if (error) return { error: error.message };
  return { success: true };
}
