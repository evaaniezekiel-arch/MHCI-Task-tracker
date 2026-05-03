"use client";

import React from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend, 
  Tooltip 
} from 'recharts';

const COLORS = {
  'Done': '#C6EFCE',
  'In-Progress': '#FFEB9C',
  'Pending': '#DDEEFF',
  'Undone': '#FFC7CE',
  'KIV': '#E2C4F0'
};

interface CompletionChartProps {
  data: { status: string; count: number }[];
}

export default function CompletionChart({ data }: CompletionChartProps) {
  const total = data.reduce((sum, item) => sum + Number(item.count), 0);
  const doneCount = data.find(d => d.status === 'Done')?.count || 0;
  const percentage = total > 0 ? Math.round((Number(doneCount) / total) * 100) : 0;

  return (
    <div className="h-full w-full min-h-[250px] relative">
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="count"
            nameKey="status"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.status as keyof typeof COLORS] || '#eee'} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
          <Legend verticalAlign="bottom" height={36} iconType="circle" />
        </PieChart>
      </ResponsiveContainer>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
        <span className="text-3xl font-bold tracking-tighter text-foreground">{percentage}%</span>
        <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Complete</span>
      </div>
    </div>
  );
}
