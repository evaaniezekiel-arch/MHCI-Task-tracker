"use client";

import React, { useState } from 'react';
import { Mail, Shield, Clock, MoreVertical, Crown, UserCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { updateUserRole, promoteToAdmin, revokeTemporaryAdmin } from '@/actions/users';
import toast from 'react-hot-toast';

interface UsersTableProps {
  initialUsers: any[];
}

const ROLE_CONFIG: Record<string, { label: string; icon: any; class: string }> = {
  admin: { label: 'Admin', icon: Shield, class: 'bg-primary text-primary-foreground' },
  executive: { label: 'Executive', icon: Crown, class: 'bg-amber-500/10 text-amber-500' },
  assistant: { label: 'Assistant', icon: UserCheck, class: 'bg-blue-500/10 text-blue-500' },
};

export default function UsersTable({ initialUsers }: UsersTableProps) {
  const [users, setUsers] = useState(initialUsers);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const handleRoleChange = async (userId: string, newRole: string) => {
    const result = await updateUserRole(userId, newRole as any);
    if (result?.error) {
      toast.error(result.error);
    } else {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      toast.success(`Role updated to ${ROLE_CONFIG[newRole]?.label || newRole}`);
    }
    setOpenDropdown(null);
  };

  const handlePromote = async (userId: string, hours: number) => {
    const result = await promoteToAdmin(userId, hours);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success(`Promoted to Admin for ${hours} hours`);
    }
    setOpenDropdown(null);
  };

  const handleRevoke = async (userId: string) => {
    const result = await revokeTemporaryAdmin(userId);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success('Admin status revoked');
    }
    setOpenDropdown(null);
  };

  return (
    <div className="bg-card text-card-foreground rounded-2xl border border-border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Temp Status</th>
              <th className="px-6 py-4">Joined</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border text-sm">
            {users.map((user) => {
              const isTempAdmin = user.role !== 'admin' && 
                                 user.temporary_admin_until && 
                                 new Date(user.temporary_admin_until) > new Date();
              const roleConfig = ROLE_CONFIG[user.role] || ROLE_CONFIG.assistant;
              const RoleIcon = roleConfig.icon;

              return (
                <tr key={user.id} className="hover:bg-muted/50 transition-colors group relative">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground border border-border">
                        {user.full_name?.charAt(0) || user.email.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold">{user.full_name || 'No Name'}</p>
                        <p className="text-xs text-muted-foreground flex items-center">
                          <Mail size={12} className="mr-1" />
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center w-fit",
                      isTempAdmin ? ROLE_CONFIG.admin.class : roleConfig.class
                    )}>
                      <RoleIcon size={10} className="mr-1" />
                      {isTempAdmin ? 'Temp Admin' : roleConfig.label}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {isTempAdmin ? (
                      <div className="flex items-center text-amber-600 dark:text-amber-400 space-x-1.5 font-bold text-[10px] uppercase">
                        <Clock size={12} />
                        <span>Expires {new Date(user.temporary_admin_until).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground/40 text-[10px] uppercase font-bold">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground text-xs">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right relative">
                    <button 
                      onClick={() => setOpenDropdown(openDropdown === user.id ? null : user.id)}
                      className="p-2 text-muted-foreground/40 hover:text-foreground transition-colors rounded-lg hover:bg-muted"
                    >
                      <MoreVertical size={18} />
                    </button>

                    {openDropdown === user.id && (
                      <div className="absolute right-6 top-12 w-52 bg-popover text-popover-foreground border border-border shadow-xl rounded-xl z-50 overflow-hidden py-1">
                        {/* Role Change Section */}
                        <div className="px-3 py-2 text-[10px] font-bold uppercase text-muted-foreground tracking-widest border-b border-border">Change Role</div>
                        {Object.entries(ROLE_CONFIG).map(([key, config]) => (
                          <button
                            key={key}
                            onClick={() => handleRoleChange(user.id, key)}
                            className={cn(
                              "w-full text-left px-4 py-2 hover:bg-muted text-xs font-medium transition-colors flex items-center gap-2",
                              user.role === key && "bg-muted/50"
                            )}
                          >
                            <config.icon size={12} />
                            <span>{config.label}</span>
                            {user.role === key && <span className="ml-auto text-green-500">✓</span>}
                          </button>
                        ))}

                        {/* Temp Promote Section */}
                        {user.role !== 'admin' && (
                          <>
                            <div className="px-3 py-2 text-[10px] font-bold uppercase text-muted-foreground tracking-widest border-t border-b border-border mt-1">Temp Promote (Hours)</div>
                            {[1, 2, 3, 5, 6].map(h => (
                              <button 
                                key={h}
                                onClick={() => handlePromote(user.id, h)}
                                className="w-full text-left px-4 py-2 hover:bg-muted text-xs font-medium transition-colors"
                              >
                                {h} Hour{h > 1 ? 's' : ''}
                              </button>
                            ))}
                          </>
                        )}

                        {isTempAdmin && (
                          <button 
                            onClick={() => handleRevoke(user.id)}
                            className="w-full text-left px-4 py-2 hover:bg-destructive/10 text-red-600 dark:text-red-400 text-xs font-bold transition-colors border-t border-border mt-1"
                          >
                            Revoke Temp Status
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
