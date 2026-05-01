"use server";

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { Task, Status, Priority } from '@/lib/types';

export async function getTasksByWeek(weekId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('tasks')
    .select('*, task_assignees(*, profiles(*))')
    .eq('week_id', weekId)
    .order('position', { ascending: true });

  if (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }

  return data as Task[];
}

export async function createTask(weekId: string, title: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      week_id: weekId,
      title,
      created_by: user.id,
      updated_by: user.id,
      status: 'Pending',
      priority: 'Medium',
      position: 0 // In real app, calculate based on existing tasks
    })
    .select()
    .single();

  if (error) throw error;

  revalidatePath(`/week/${weekId}`);
  return data;
}

export async function updateTask(taskId: string, updates: Partial<Task>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  const { data, error } = await supabase
    .from('tasks')
    .update({
      ...updates,
      updated_by: user.id,
      updated_at: new Date().toISOString()
    })
    .eq('id', taskId)
    .select()
    .single();

  if (error) throw error;

  // Revalidate the week path if week_id is known or just revalidate generally
  // UsuallytaskId is enough to trigger updates if using real-time
  return data;
}

export async function deleteTask(taskId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', taskId);

  if (error) throw error;
  revalidatePath('/dashboard');
}

export async function updateTaskStatus(taskId: string, status: Status) {
  return updateTask(taskId, { status });
}
