import React from 'react';
import { UserPlus, Search, Shield, User as UserIcon, Mail, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminUsersPage() {
  const users = [
    { name: 'Keyna Smith', email: 'keyna@company.com', role: 'admin', status: 'Active', joined: 'Jan 12, 2025' },
    { name: 'John Doe', email: 'john@company.com', role: 'executive', status: 'Active', joined: 'Jan 15, 2025' },
    { name: 'Sarah Wilson', email: 'sarah@company.com', role: 'member', status: 'Active', joined: 'Jan 20, 2025' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-zinc-500 mt-1">Manage platform access, roles, and invitations.</p>
        </div>
        <button className="flex items-center space-x-2 bg-black text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all shadow-lg shadow-black/10 active:scale-95">
          <UserPlus size={18} />
          <span>Invite New User</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b bg-zinc-50/50 flex items-center justify-between">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <input 
              type="text" 
              placeholder="Filter users..." 
              className="pl-10 pr-4 py-2 bg-white border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black w-72"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {users.map((user) => (
                <tr key={user.email} className="hover:bg-zinc-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-zinc-400 border border-zinc-200">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold">{user.name}</p>
                        <p className="text-xs text-zinc-500 flex items-center">
                          <Mail size={12} className="mr-1" />
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center w-fit",
                      user.role === 'admin' ? "bg-black text-white" : 
                      user.role === 'executive' ? "bg-zinc-800 text-white" : "bg-zinc-100 text-zinc-600"
                    )}>
                      {user.role === 'admin' && <Shield size={10} className="mr-1" />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      <span className="text-xs font-medium">{user.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-zinc-500 text-xs">{user.joined}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-zinc-300 hover:text-black transition-colors rounded-lg hover:bg-zinc-100">
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm">
          <h3 className="font-bold mb-4 flex items-center">
            <Mail className="mr-2 text-zinc-400" size={18} />
            Pending Invitations
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl border border-zinc-100">
              <div>
                <p className="text-sm font-bold">manager@company.com</p>
                <p className="text-[10px] text-zinc-400 uppercase font-bold">Expires in 3 days · Role: Member</p>
              </div>
              <div className="flex space-x-2">
                <button className="text-[10px] font-bold px-2 py-1 border rounded bg-white hover:bg-zinc-50 transition-colors uppercase">Resend</button>
                <button className="text-[10px] font-bold px-2 py-1 border rounded bg-white text-red-500 hover:bg-red-50 transition-colors uppercase">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
