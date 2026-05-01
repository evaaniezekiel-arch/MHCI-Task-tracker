"use server";

import { createClient } from '@/lib/supabase/server';
import { Role } from '@/lib/types';

export async function sendPlatformInvite(email: string, role: Role, note?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  const { data, error } = await supabase
    .from('platform_invites')
    .insert({
      email,
      role,
      invited_by: user.id
    })
    .select()
    .single();

  if (error) throw error;

  // Trigger Edge Function
  // await supabase.functions.invoke('send-platform-invite', { body: { email, role, note, token: data.token } });

  return data;
}

export async function resendPlatformInvite(inviteId: string) {
  const supabase = await createClient();
  // Logic to re-trigger email
}

export async function cancelPlatformInvite(inviteId: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('platform_invites')
    .delete()
    .eq('id', inviteId);

  if (error) throw error;
}
