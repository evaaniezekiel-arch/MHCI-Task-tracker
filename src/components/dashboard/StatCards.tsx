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
  'Done': 'bg-white text-black',
  'In-Progress': 'bg-zinc-800 text-white',
  'Pending': 'bg-zinc-900 text-zinc-400',
  'Undone': 'bg-zinc-950 text-zinc-600',
  'KIV': 'bg-black text-zinc-800',
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
