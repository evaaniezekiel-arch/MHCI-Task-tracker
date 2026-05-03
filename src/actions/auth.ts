"use server";

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function signup(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = formData.get('fullName') as string;
  
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}

export async function getUser() {
  try {
    const supabase = await createClient();
    const { data, error: authError } = await supabase.auth.getUser();
    
    if (authError || !data?.user) return null;

    const user = data.user;

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      // Profile doesn't exist yet — return minimal user info
      return { 
        ...user, 
        profile: {
          id: user.id,
          full_name: user.user_metadata?.full_name || null,
          email: user.email || '',
          role: 'member',
          effective_role: 'member',
          avatar_url: null,
          is_active: true,
          created_at: user.created_at
        } 
      };
    }

    // Try to get effective role from RPC, but fall back gracefully
    let effectiveRole = profile.role || 'member';
    try {
      const { data: rpcRole, error: rpcError } = await supabase.rpc('get_my_role');
      if (!rpcError && rpcRole) {
        effectiveRole = rpcRole;
      }
    } catch {
      // RPC doesn't exist yet — fall back to profile.role
    }

    return { 
      ...user, 
      profile: {
        ...profile,
        role: profile.role || 'member',
        effective_role: effectiveRole
      } 
    };
  } catch (error) {
    console.error('getUser error:', error);
    return null;
  }
}
