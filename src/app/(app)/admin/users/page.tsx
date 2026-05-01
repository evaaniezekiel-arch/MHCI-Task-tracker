import React from 'react';
import { UserPlus } from 'lucide-react';
import { getUsers } from '@/actions/users';
import UsersTable from '@/components/admin/UsersTable';

export default async function AdminUsersPage() {
  const users = await getUsers();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-zinc-500 mt-1">Manage platform access, roles, and temporary admin promotions.</p>
        </div>
        <button className="flex items-center space-x-2 bg-black text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-black/10 active:scale-95">
          <UserPlus size={18} />
          <span>Invite New User</span>
        </button>
      </div>

      <UsersTable initialUsers={users} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
          <h3 className="font-bold mb-4 flex items-center text-sm uppercase tracking-widest text-zinc-400">
            Platform Roles
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 rounded-xl border border-zinc-50">
              <span className="font-bold">Admin</span>
              <span className="text-xs text-zinc-500 text-right">Full access. Can add tasks, manage users, and view analytics.</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl border border-zinc-50">
              <span className="font-bold">Executive</span>
              <span className="text-xs text-zinc-500 text-right">Can view all dashboards and comment. Cannot manage users.</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-xl border border-zinc-50">
              <span className="font-bold">Member</span>
              <span className="text-xs text-zinc-500 text-right">Restricted to filling and updating tasks assigned to them.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
