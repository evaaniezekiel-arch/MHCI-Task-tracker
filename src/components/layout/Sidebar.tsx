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
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { logout } from '@/actions/auth';

interface SidebarProps {
  role?: string;
  weeks?: any[];
}

export default function Sidebar({ role = 'member', weeks = [] }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [weeksExpanded, setWeeksExpanded] = useState(true);
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  ];

  if (role === 'admin') {
    navItems.push({ name: 'User Mgmt', icon: Settings, href: '/admin/users' });
  }

  return (
    <aside 
      className={cn(
        "bg-black text-white h-screen transition-all duration-300 flex flex-col fixed left-0 top-0 z-40",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 flex items-center justify-between border-b border-zinc-900">
        {!collapsed && <span className="font-bold text-lg tracking-tight">MHCI TASK</span>}
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 hover:bg-zinc-800 rounded"
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
                "flex items-center p-3 rounded-lg transition-colors group",
                isActive ? "bg-white text-black font-bold" : "hover:bg-zinc-900 text-zinc-400",
                collapsed ? "justify-center" : "space-x-3"
              )}
            >
              <item.icon size={20} />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}

        {/* Weeks Dropdown */}
        <div className="pt-2">
          {!collapsed && (
            <button 
              onClick={() => setWeeksExpanded(!weeksExpanded)}
              className="flex items-center justify-between w-full p-3 text-zinc-500 hover:text-white text-[10px] uppercase font-bold tracking-widest transition-colors"
            >
              <span>Weekly Logs</span>
              <ChevronDown size={14} className={cn("transition-transform", weeksExpanded && "rotate-180")} />
            </button>
          )}
          
          {(weeksExpanded || collapsed) && (
            <div className={cn("space-y-1", !collapsed && "pl-2")}>
              {weeks.map((week) => {
                const href = `/week/${week.id}`;
                const isActive = pathname === href;
                return (
                  <Link
                    key={week.id}
                    href={href}
                    className={cn(
                      "flex items-center p-3 rounded-lg transition-colors text-sm",
                      isActive ? "bg-white/10 text-white font-bold" : "hover:bg-zinc-900 text-zinc-500 hover:text-zinc-300",
                      collapsed ? "justify-center" : "space-x-3"
                    )}
                  >
                    <Calendar size={collapsed ? 20 : 16} />
                    {!collapsed && (
                      <span className="truncate">
                        Week {week.week_number.toString().padStart(2, '0')}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="p-4 border-t border-zinc-900">
        <form action={logout}>
          <button 
            type="submit"
            className={cn(
              "flex items-center text-zinc-500 hover:text-white transition-colors w-full p-2 group",
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
