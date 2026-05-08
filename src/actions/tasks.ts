"use server";

import { createClient, createAdminClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { Task, Status, Priority } from '@/lib/types';

export async function getTasksByWeek(weekId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('tasks')
    .select('*, task_assignees(*, user:user_id(*))')
    .eq('week_id', weekId)
    .order('position', { ascending: true });

  if (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }

  return data as Task[];
}

export async function getReviewTasks() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('tasks')
    .select('*, weeks(*), task_assignees(*, user:user_id(*))')
    .eq('status', 'Review')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error fetching review tasks:', error);
    return [];
  }

  return data;
}

export async function getAllTasks() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('tasks')
    .select('*, weeks(*), task_assignees(*, user:user_id(*))')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching all tasks:', error);
    return [];
  }

  return data;
}

export async function createTask(
  weekId: string, 
  title: string, 
  description?: string, 
  dueDate?: string, 
  priority?: Priority
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'You must be logged in to create a task.' };

  // Use admin client to bypass RLS
  const admin = createAdminClient();

  const { data, error } = await admin
    .from('tasks')
    .insert({
      week_id: weekId,
      title,
      description: description || null,
      due_date: dueDate || null,
      created_by: user.id,
      updated_by: user.id,
      status: 'Pending',
      priority: priority || 'Medium',
      position: 0
    })
    .select()
    .single();

  if (error) {
    console.error('createTask error:', error);
    return { error: error.message || 'Failed to create task.' };
  }

  revalidatePath(`/week/${weekId}`);
  revalidatePath('/tasks');
  return { data };
}

export async function updateTask(taskId: string, updates: Partial<Task>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'You must be logged in to update a task.' };

  // Use admin client to bypass RLS
  const admin = createAdminClient();

  const { data, error } = await admin
    .from('tasks')
    .update({
      ...updates,
      updated_by: user.id,
      updated_at: new Date().toISOString()
    })
    .eq('id', taskId)
    .select()
    .single();

  if (error) {
    console.error('updateTask error:', error);
    return { error: error.message || 'Failed to update task.' };
  }

  revalidatePath('/tasks');
  return { data };
}

export async function deleteTask(taskId: string) {
  const admin = createAdminClient();

  const { error } = await admin
    .from('tasks')
    .delete()
    .eq('id', taskId);

  if (error) {
    console.error('deleteTask error:', error);
    return { error: error.message || 'Failed to delete task.' };
  }

  revalidatePath('/dashboard');
  revalidatePath('/tasks');
  return { success: true };
}

export async function updateTaskStatus(taskId: string, status: Status) {
  return updateTask(taskId, { status });
}

export async function bulkImportTasks(weekId: string, tasks: any[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'You must be logged in to import tasks.' };

  const admin = createAdminClient();

  const tasksToInsert = tasks.map((task, index) => ({
    week_id: weekId,
    title: task.title,
    description: task.description || null,
    due_date: task.due_date || null,
    priority: (task.priority as Priority) || 'Medium',
    status: (task.status as Status) || 'Pending',
    created_by: user.id,
    updated_by: user.id,
    created_at: task.created_at || new Date().toISOString(),
    position: index
  }));

  const { data, error } = await admin
    .from('tasks')
    .insert(tasksToInsert)
    .select();

  if (error) {
    console.error('bulkImportTasks error:', error);
    return { error: error.message || 'Failed to import tasks.' };
  }

  revalidatePath(`/week/${weekId}`);
  revalidatePath('/tasks');
  return { success: true, count: data.length };
}
