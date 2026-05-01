"use client";

import React, { useState } from 'react';
import { Mail, Shield, Clock, MoreVertical, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { promoteToAdmin, revokeTemporaryAdmin } from '@/actions/users';
import toast from 'react-hot-toast';

interface UsersTableProps {
  initialUsers: any[];
}

export default function UsersTable({ initialUsers }: UsersTableProps) {
  const [users, setUsers] = useState(initialUsers);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handlePromote = async (userId: string, hours: number) => {
    try {
      await promoteToAdmin(userId, hours);
      toast.success(`Promoted to Admin for ${hours} hours`);
      setOpenDropdown(null);
    } catch (error) {
      toast.error('Failed to promote user');
    }
  };

  const handleRevoke = async (userId: string) => {
    try {
      await revokeTemporaryAdmin(userId);
      toast.success('Admin status revoked');
      setOpenDropdown(null);
    } catch (error) {
      toast.error('Failed to revoke status');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Temp Status</th>
              <th className="px-6 py-4">Joined</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {users.map((user) => {
              const isTempAdmin = user.role !== 'admin' && 
                                 user.temporary_admin_until && 
                                 new Date(user.temporary_admin_until) > new Date();

              return (
                <tr key={user.id} className="hover:bg-zinc-50/50 transition-colors group relative">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-zinc-400 border border-zinc-200">
                        {user.full_name?.charAt(0) || user.email.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold">{user.full_name || 'No Name'}</p>
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
                      (user.role === 'admin' || isTempAdmin) ? "bg-black text-white" : "bg-zinc-100 text-zinc-600"
                    )}>
                      {(user.role === 'admin' || isTempAdmin) && <Shield size={10} className="mr-1" />}
                      {isTempAdmin ? 'Temp Admin' : user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {isTempAdmin ? (
                      <div className="flex items-center text-amber-600 space-x-1.5 font-bold text-[10px] uppercase">
                        <Clock size={12} />
                        <span>Expires {new Date(user.temporary_admin_until).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    ) : (
                      <span className="text-zinc-300 text-[10px] uppercase font-bold">Permanent</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-zinc-500 text-xs">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right relative">
                    <button 
                      onClick={() => setOpenDropdown(openDropdown === user.id ? null : user.id)}
                      className="p-2 text-zinc-300 hover:text-black transition-colors rounded-lg hover:bg-zinc-100"
                    >
                      <MoreVertical size={18} />
                    </button>

                    {openDropdown === user.id && (
                      <div className="absolute right-6 top-12 w-48 bg-white border border-zinc-100 shadow-xl rounded-xl z-50 overflow-hidden py-1">
                        <div className="px-3 py-2 text-[10px] font-bold uppercase text-zinc-400 tracking-widest border-b">Promote (Hours)</div>
                        {[1, 2, 3, 5, 6].map(h => (
                          <button 
                            key={h}
                            onClick={() => handlePromote(user.id, h)}
                            className="w-full text-left px-4 py-2 hover:bg-zinc-50 text-xs font-medium transition-colors flex justify-between items-center"
                          >
                            <span>{h} Hour{h > 1 ? 's' : ''}</span>
                          </button>
                        ))}
                        {isTempAdmin && (
                          <button 
                            onClick={() => handleRevoke(user.id)}
                            className="w-full text-left px-4 py-2 hover:bg-red-50 text-red-600 text-xs font-bold transition-colors border-t mt-1"
                          >
                            Revoke Status
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
