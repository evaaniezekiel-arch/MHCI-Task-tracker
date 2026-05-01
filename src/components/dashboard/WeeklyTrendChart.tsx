"use client";

import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';

interface WeeklyTrendChartProps {
  data: any[];
}

export default function WeeklyTrendChart({ data }: WeeklyTrendChartProps) {
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorPct" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#000000" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#000000" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis 
            dataKey="week_number" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#888' }}
            label={{ value: 'Week Number', position: 'insideBottom', offset: -5, fontSize: 10 }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#888' }}
            unit="%"
          />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
          <Area 
            type="monotone" 
            dataKey="completion_pct" 
            name="Completion %"
            stroke="#000000" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorPct)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
