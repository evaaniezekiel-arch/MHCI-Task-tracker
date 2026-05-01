"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  LogOut,
  Plus
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { logout } from '@/actions/auth';

interface SidebarProps {
  role?: string;
}

export default function Sidebar({ role = 'member' }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Weeks', icon: Calendar, href: '/dashboard' }, // Will be expanded
  ];

  if (role === 'admin') {
    navItems.push({ name: 'Admin', icon: Settings, href: '/admin/users' });
  }

  return (
    <aside 
      className={cn(
        "bg-black text-white h-screen transition-all duration-300 flex flex-col fixed left-0 top-0 z-40",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 flex items-center justify-between">
        {!collapsed && <span className="font-bold text-lg tracking-tight">MHCI TASK</span>}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 hover:bg-zinc-800 rounded"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 mt-4 px-2 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center p-3 rounded-lg transition-colors",
                isActive ? "bg-white text-black" : "hover:bg-zinc-900 text-zinc-400",
                collapsed ? "justify-center" : "space-x-3"
              )}
            >
              <item.icon size={20} />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <form action={logout}>
          <button 
            type="submit"
            className={cn(
              "flex items-center text-zinc-400 hover:text-white transition-colors w-full p-2",
              collapsed ? "justify-center" : "space-x-3"
            )}
          >
            <LogOut size={20} />
            {!collapsed && <span>Logout</span>}
          </button>
        </form>
      </div>
    </aside>
  );
}
