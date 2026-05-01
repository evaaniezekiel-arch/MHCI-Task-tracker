"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { 
  CheckCircle2, 
  CircleDashed, 
  Clock, 
  XCircle, 
  Eye, 
  BarChart3 
} from 'lucide-react';

const stats = [
  { name: 'Total Tasks', value: '1,240', change: '+12%', icon: BarChart3, color: 'bg-black text-white' },
  { name: 'Done', value: '850', change: '+5%', icon: CheckCircle2, color: 'bg-[#C6EFCE] text-[#2D7A3A]' },
  { name: 'In-Progress', value: '120', change: '-2%', icon: CircleDashed, color: 'bg-[#FFEB9C] text-[#856A00]' },
  { name: 'Pending', value: '180', change: '+8%', icon: Clock, color: 'bg-[#DDEEFF] text-[#1A4D8A]' },
  { name: 'Undone', value: '45', change: '-10%', icon: XCircle, color: 'bg-[#FFC7CE] text-[#9B2335]' },
  { name: 'KIV', value: '45', change: '0%', icon: Eye, color: 'bg-[#E2C4F0] text-[#6B3FA0]' },
];

export default function StatCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
      {stats.map((stat) => (
        <div key={stat.name} className="bg-white p-4 rounded-xl border border-zinc-100 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className={cn("p-2 rounded-lg", stat.color)}>
              <stat.icon size={18} />
            </div>
            <span className={cn(
              "text-[10px] font-bold px-1.5 py-0.5 rounded",
              stat.change.startsWith('+') ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
            )}>
              {stat.change}
            </span>
          </div>
          <div>
            <p className="text-zinc-500 text-xs font-medium uppercase tracking-wider">{stat.name}</p>
            <h3 className="text-2xl font-bold mt-1 tracking-tight">{stat.value}</h3>
          </div>
        </div>
      ))}
    </div>
  );
}
