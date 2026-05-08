import React from 'react';
import { UserPlus, Shield, Crown, UserCheck } from 'lucide-react';
import { getUsers } from '@/actions/users';
import UsersTable from '@/components/admin/UsersTable';

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage() {
  let users: any[] = [];
  
  try {
    users = await getUsers();
  } catch (error) {
    console.error('Admin users fetch error:', error);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">User Management</h1>
          <p className="text-muted-foreground mt-1">Manage platform access and role assignments.</p>
        </div>
        <button className="flex items-center space-x-2 bg-white text-black px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-lg active:scale-95">
          <UserPlus size={16} />
          <span>Invite New User</span>
        </button>
      </div>

      <UsersTable initialUsers={users || []} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1c1b1b] p-6 rounded-2xl border border-[#2a2a2a] shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-white text-black">
              <Shield size={16} />
            </div>
            <h3 className="font-bold text-white uppercase tracking-widest text-xs">Admin</h3>
          </div>
          <p className="text-[11px] text-zinc-500 leading-relaxed font-bold uppercase tracking-tight">
            Full access. Can create weeks and tasks, manage users, change roles, and view all analytics.
          </p>
        </div>
        <div className="bg-[#1c1b1b] p-6 rounded-2xl border border-[#2a2a2a] shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-[#2a2a2a] text-white">
              <Crown size={16} />
            </div>
            <h3 className="font-bold text-white uppercase tracking-widest text-xs">Executive</h3>
          </div>
          <p className="text-[11px] text-zinc-500 leading-relaxed font-bold uppercase tracking-tight">
            Can create weeks and tasks, assign responsibilities, and view analytics. Cannot manage user roles.
          </p>
        </div>
        <div className="bg-[#1c1b1b] p-6 rounded-2xl border border-[#2a2a2a] shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-[#2a2a2a] text-zinc-400">
              <UserCheck size={16} />
            </div>
            <h3 className="font-bold text-white uppercase tracking-widest text-xs">Assistant</h3>
          </div>
          <p className="text-[11px] text-zinc-500 leading-relaxed font-bold uppercase tracking-tight">
            Can view tasks and update task status. Cannot create weeks, tasks, or manage users.
          </p>
        </div>
      </div>
    </div>
  );
}
