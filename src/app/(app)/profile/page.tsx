import React from 'react';
import { getUser } from '@/actions/auth';
import ProfileClient from '@/components/profile/ProfileClient';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const user = await getUser();

  if (!user) {
    redirect('/login');
  }

  const profile = {
    full_name: user.profile?.full_name ?? null,
    email: user.email ?? '',           // ← pulled from top-level user, not profile
    role: user.profile?.role ?? 'member',
    effective_role: user.profile?.effective_role,
    avatar_url: user.profile?.avatar_url ?? null,
    created_at: user.profile?.created_at ?? user.created_at,
  };

  return <ProfileClient profile={profile} />;
}
