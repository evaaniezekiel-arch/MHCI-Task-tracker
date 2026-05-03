"use client";

import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

interface MonthlyBarChartProps {
  data: any[];
}

export default function MonthlyBarChart({ data }: MonthlyBarChartProps) {
  return (
    <div className="h-full w-full min-h-[250px]">
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
          <XAxis 
            dataKey="month" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#888' }} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#888' }} 
          />
          <Tooltip 
            cursor={{ fill: '#f9f9f9' }}
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          />
          <Legend verticalAlign="top" align="right" height={36} iconType="circle" />
          <Bar dataKey="done" name="Done" stackId="a" fill="#C6EFCE" radius={[0, 0, 0, 0]} />
          <Bar dataKey="in_progress" name="In-Progress" stackId="a" fill="#FFEB9C" />
          <Bar dataKey="pending" name="Pending" stackId="a" fill="#DDEEFF" />
          <Bar dataKey="undone" name="Undone" stackId="a" fill="#FFC7CE" />
          <Bar dataKey="kiv" name="KIV" stackId="a" fill="#E2C4F0" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
