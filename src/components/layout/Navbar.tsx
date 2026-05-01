"use client";

import React from 'react';
import { Bell, User, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Navbar({ user }: { user?: any }) {
  const profile = user?.profile;
  const fullName = profile?.full_name || 'Guest User';
  const role = profile?.effective_role || 'member';
  const initials = fullName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() || 'GU';

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            className="pl-10 pr-4 py-2 bg-zinc-50 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all w-64"
          />
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs font-medium text-zinc-500 uppercase tracking-widest">Live</span>
        </div>

        <button className="p-2 text-zinc-400 hover:text-black transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
        </button>

        <div className="flex items-center space-x-3 pl-4 border-l">
          <div className="text-right">
            <p className="text-sm font-semibold">{fullName}</p>
            <p className={cn(
              "text-[10px] uppercase font-bold px-1.5 py-0.5 rounded leading-none inline-block",
              role === 'admin' ? "bg-black text-white" : "bg-zinc-100 text-zinc-500"
            )}>
              {role}
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-zinc-200 border-2 border-white overflow-hidden shadow-sm">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-black text-white text-xs font-bold">{initials}</div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
