"use server";

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function getComments(taskId: string) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('comments')
    .select('*, profiles(*)')
    .eq('task_id', taskId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching comments:', error);
    return [];
  }

  return data;
}

export async function addComment(taskId: string, body: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  const { data, error } = await supabase
    .from('comments')
    .insert({
      task_id: taskId,
      user_id: user.id,
      body
    })
    .select('*, profiles(*)')
    .single();

  if (error) throw error;

  return data;
}

export async function deleteComment(commentId: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('comments')
    .delete()
    .eq('id', commentId);

  if (error) throw error;
}
