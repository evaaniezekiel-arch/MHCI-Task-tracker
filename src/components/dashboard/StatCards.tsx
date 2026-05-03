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

const iconMap: Record<string, any> = {
  'Done': CheckCircle2,
  'In-Progress': CircleDashed,
  'Pending': Clock,
  'Undone': XCircle,
  'KIV': Eye,
};

const colorMap: Record<string, string> = {
  'Done': 'bg-[#C6EFCE] text-[#2D7A3A]',
  'In-Progress': 'bg-[#FFEB9C] text-[#856A00]',
  'Pending': 'bg-[#DDEEFF] text-[#1A4D8A]',
  'Undone': 'bg-[#FFC7CE] text-[#9B2335]',
  'KIV': 'bg-[#E2C4F0] text-[#6B3FA0]',
};

interface StatCardsProps {
  data?: any[];
}

export default function StatCards({ data = [] }: StatCardsProps) {
  const total = data.reduce((sum, s) => sum + (s.count || 0), 0);

  const cards = [
    { name: 'Total Tasks', value: total, icon: BarChart3, color: 'bg-primary text-primary-foreground' },
    ...data.map(s => ({
      name: s.status,
      value: s.count || 0,
      icon: iconMap[s.status] || BarChart3,
      color: colorMap[s.status] || 'bg-zinc-100 text-zinc-600',
    }))
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((stat) => (
        <div key={stat.name} className="bg-card text-card-foreground p-4 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-3">
            <div className={cn("p-2 rounded-lg", stat.color)}>
              <stat.icon size={18} />
            </div>
          </div>
          <div>
            <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider">{stat.name}</p>
            <h3 className="text-2xl font-bold mt-1 tracking-tight">{stat.value}</h3>
          </div>
        </div>
      ))}
    </div>
  );
}
