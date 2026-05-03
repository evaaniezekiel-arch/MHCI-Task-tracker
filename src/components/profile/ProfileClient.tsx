"use client";

import React, { useState } from 'react';
import { User, Mail, Shield, Camera, Loader2, Pencil, X, Check } from 'lucide-react';
import { updateMyProfile } from '@/actions/profile';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

interface ProfileClientProps {
  profile: {
    full_name: string | null;
    email: string;
    role: string;
    effective_role?: string;
    avatar_url: string | null;
    created_at?: string;
  };
}

export default function ProfileClient({ profile }: ProfileClientProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fullName, setFullName] = useState(profile.full_name || '');
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || '');

  const displayRole = profile.effective_role || profile.role || 'member';
  const initials = (profile.full_name || profile.email || 'G')
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  async function handleSave() {
    setIsLoading(true);
    const formData = new FormData();
    formData.set('fullName', fullName);
    formData.set('avatarUrl', avatarUrl);

    const result = await updateMyProfile(formData);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success('Profile updated successfully');
      setIsEditing(false);
    }
    setIsLoading(false);
  }

  function handleCancel() {
    setFullName(profile.full_name || '');
    setAvatarUrl(profile.avatar_url || '');
    setIsEditing(false);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
          <p className="text-zinc-500 mt-1">View and manage your personal information.</p>
        </div>
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center space-x-2 bg-black text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-black/10 active:scale-95"
          >
            <Pencil size={16} />
            <span>Edit Profile</span>
          </button>
        ) : (
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCancel}
              className="flex items-center space-x-1.5 px-4 py-2.5 rounded-xl text-sm font-bold border border-zinc-200 hover:bg-zinc-50 transition-all"
            >
              <X size={16} />
              <span>Cancel</span>
            </button>
            <button
              onClick={handleSave}
              disabled={isLoading}
              className="flex items-center space-x-1.5 bg-black text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-black/10 active:scale-95 disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
              <span>{isLoading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden">
        {/* Banner */}
        <div className="h-36 bg-gradient-to-br from-black via-zinc-800 to-zinc-900 relative">
          <div className="absolute -bottom-14 left-8 p-1.5 bg-white rounded-full shadow-lg">
            <div className="w-28 h-28 rounded-full bg-zinc-100 border-4 border-white flex items-center justify-center text-3xl font-bold text-zinc-300 overflow-hidden relative group">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-zinc-400">{initials}</span>
              )}
              {isEditing && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <Camera className="text-white" size={20} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="pt-20 pb-8 px-8 space-y-8">
          {/* Header row */}
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold">{profile.full_name || 'Set your name'}</h2>
              <p className="text-sm text-zinc-500 mt-0.5">{profile.email}</p>
              {profile.created_at && (
                <p className="text-xs text-zinc-400 mt-1">
                  Member since {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              )}
            </div>
            <span className={cn(
              "px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border",
              displayRole === 'admin' ? "bg-black text-white border-black" : "bg-zinc-50 text-zinc-600 border-zinc-100"
            )}>
              <Shield size={10} className="inline-block mr-1 -mt-0.5" />
              {displayRole === 'member' ? 'user' : displayRole}
            </span>
          </div>

          {/* Divider */}
          <div className="border-t border-zinc-100" />

          {/* Detail fields */}
          <div className="grid grid-cols-1 gap-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center">
                <User size={12} className="mr-1.5" />
                Full Name
              </label>
              {isEditing ? (
                <input 
                  type="text" 
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name" 
                  className="w-full p-4 bg-zinc-50 border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all text-sm"
                />
              ) : (
                <p className="p-4 bg-zinc-50 rounded-2xl text-sm font-medium">
                  {profile.full_name || <span className="text-zinc-400 italic">Not set</span>}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center">
                <Mail size={12} className="mr-1.5" />
                Email Address
              </label>
              <p className="p-4 bg-zinc-50 rounded-2xl text-sm font-medium text-zinc-600">
                {profile.email}
              </p>
              <p className="text-[10px] text-zinc-400 font-medium">Email cannot be changed for security reasons.</p>
            </div>

            {/* Role */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center">
                <Shield size={12} className="mr-1.5" />
                Account Role
              </label>
              <p className="p-4 bg-zinc-50 rounded-2xl text-sm font-medium capitalize">
                {displayRole === 'member' ? 'User' : displayRole}
                {displayRole === 'admin' && (
                  <span className="ml-2 text-[10px] bg-black text-white px-2 py-0.5 rounded-full uppercase font-bold">
                    Full Access
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
