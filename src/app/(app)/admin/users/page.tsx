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
        <button className="flex items-center space-x-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-lg active:scale-95">
          <UserPlus size={18} />
          <span>Invite New User</span>
        </button>
      </div>

      <UsersTable initialUsers={users || []} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card text-card-foreground p-6 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-primary text-primary-foreground">
              <Shield size={16} />
            </div>
            <h3 className="font-bold">Admin</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Full access. Can create weeks and tasks, manage users, change roles, and view all analytics.
          </p>
        </div>
        <div className="bg-card text-card-foreground p-6 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
              <Crown size={16} />
            </div>
            <h3 className="font-bold">Executive</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Can create weeks and tasks, assign responsibilities, and view analytics. Cannot manage user roles.
          </p>
        </div>
        <div className="bg-card text-card-foreground p-6 rounded-2xl border border-border shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
              <UserCheck size={16} />
            </div>
            <h3 className="font-bold">Assistant</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Can view tasks and update task status. Cannot create weeks, tasks, or manage users.
          </p>
        </div>
      </div>
    </div>
  );
}
