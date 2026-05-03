"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Calendar, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  LogOut,
  ListTodo
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { logout } from '@/actions/auth';

interface SidebarProps {
  role?: string;
  weeks?: any[];
}

export default function Sidebar({ role = 'member', weeks = [] }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Tasks', icon: ListTodo, href: '/tasks' },
  ];

  if (role === 'admin') {
    navItems.push({ name: 'User Mgmt', icon: Settings, href: '/admin/users' });
  }

  return (
    <aside 
      className={cn(
        "bg-black dark:bg-zinc-950 text-white h-screen transition-all duration-300 flex flex-col fixed left-0 top-0 z-40 border-r border-zinc-900 dark:border-zinc-800",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 flex items-center justify-between border-b border-zinc-900 dark:border-zinc-800">
        {!collapsed && <span className="font-bold text-lg tracking-tight">MHCI TASK</span>}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 hover:bg-zinc-800 rounded transition-colors"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto mt-4 px-2 space-y-1 custom-scrollbar">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center p-3 rounded-lg transition-all group",
                isActive 
                  ? "bg-white text-black dark:bg-zinc-100 dark:text-black font-bold shadow-lg shadow-white/5" 
                  : "hover:bg-zinc-900 dark:hover:bg-zinc-900 text-zinc-400 hover:text-white",
                collapsed ? "justify-center" : "space-x-3"
              )}
            >
              <item.icon size={20} className={cn("transition-transform group-hover:scale-110", isActive && "scale-110")} />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-zinc-900 dark:border-zinc-800">
        <form action={logout}>
          <button 
            type="submit"
            className={cn(
              "flex items-center text-zinc-500 hover:text-white transition-all w-full p-2 group rounded-lg hover:bg-zinc-900/50",
              collapsed ? "justify-center" : "space-x-3"
            )}
          >
            <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
            {!collapsed && <span className="font-bold text-xs uppercase tracking-widest">Sign Out</span>}
          </button>
        </form>
      </div>
    </aside>
  );
}
