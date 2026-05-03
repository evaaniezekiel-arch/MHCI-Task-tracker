"use server";

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function addAssignee(taskId: string, userId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  const { data, error } = await supabase
    .from('task_assignees')
    .insert({
      task_id: taskId,
      user_id: userId,
      assigned_by: user.id
    })
    .select('*, user:user_id(*)')
    .single();

  if (error) throw error;

  return data;
}

export async function inviteExternalAssignee(taskId: string, email: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  // Check if user already exists
  const { data: existingUser } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', email)
    .single();

  if (existingUser) {
    return addAssignee(taskId, existingUser.id);
  }

  // Create pending invite record
  const inviteToken = crypto.randomUUID();
  
  const { data, error } = await supabase
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

  if (error) throw error;

  // Trigger Edge Function for email (logic would go here or handled by Supabase Webhook)
  // await supabase.functions.invoke('send-task-invite', { body: { taskId, email, inviteToken } });

  return data;
}

export async function removeAssignee(taskId: string, assigneeId: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('task_assignees')
    .delete()
    .eq('id', assigneeId);

  if (error) throw error;
}
