"use client";

import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Camera, Loader2 } from 'lucide-react';
import { updateMyProfile } from '@/actions/profile';
import { getUser } from '@/actions/auth';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const user = await getUser();
      if (user?.profile) {
        setProfile(user.profile);
      }
    }
    loadProfile();
  }, []);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    const result = await updateMyProfile(formData);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success('Profile updated successfully');
    }
    setIsLoading(false);
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-zinc-300" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
        <p className="text-zinc-500 mt-1">Manage your personal information and account settings.</p>
      </div>

      <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden">
        <div className="h-32 bg-black relative">
          <div className="absolute -bottom-12 left-8 p-1 bg-white rounded-full">
            <div className="w-24 h-24 rounded-full bg-zinc-100 border-4 border-white flex items-center justify-center text-3xl font-bold text-zinc-300 overflow-hidden relative group">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                profile.full_name?.charAt(0) || profile.email?.charAt(0)
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="text-white" size={20} />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-16 pb-8 px-8 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">{profile.full_name || 'Set your name'}</h2>
              <p className="text-sm text-zinc-500">{profile.email}</p>
            </div>
            <span className={cn(
              "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
              profile.role === 'admin' ? "bg-black text-white border-black" : "bg-zinc-50 text-zinc-600 border-zinc-100"
            )}>
              {profile.role} Account
            </span>
          </div>

          <form action={handleSubmit} className="space-y-6 pt-4 border-t">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-zinc-500 flex items-center">
                  <User size={14} className="mr-2" />
                  Full Name
                </label>
                <input 
                  name="fullName"
                  type="text" 
                  defaultValue={profile.full_name}
                  placeholder="Enter your full name" 
                  className="w-full p-4 bg-zinc-50 border border-zinc-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-zinc-500 flex items-center">
                  <Mail size={14} className="mr-2" />
                  Email Address
                </label>
                <input 
                  disabled
                  type="email" 
                  value={profile.email}
                  className="w-full p-4 bg-zinc-100 border border-zinc-100 rounded-2xl text-zinc-500 cursor-not-allowed"
                />
                <p className="text-[10px] text-zinc-400 font-medium">Email cannot be changed manually for security reasons.</p>
              </div>
            </div>

            <div className="pt-4">
              <button 
                disabled={isLoading}
                className="w-full md:w-auto bg-black text-white px-12 py-4 rounded-2xl font-bold hover:bg-zinc-800 transition-all shadow-xl shadow-black/10 active:scale-95 disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {isLoading && <Loader2 className="animate-spin" size={18} />}
                <span>{isLoading ? 'Saving Changes...' : 'Save Profile Details'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
