import React from 'react';
import { getUser } from '@/actions/auth';
import ProfileClient from '@/components/profile/ProfileClient';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  let user: any = null;

  try {
    user = await getUser();
  } catch (error) {
    console.error('Profile page data fetch error:', error);
  }

  const profile = user?.profile || {
    full_name: 'Guest',
    email: '',
    role: 'member',
    avatar_url: null,
  };

  return <ProfileClient profile={profile} />;
}
