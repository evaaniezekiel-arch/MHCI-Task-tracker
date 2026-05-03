import React from 'react';
import StatCards from '@/components/dashboard/StatCards';
import CompletionChart from '@/components/dashboard/CompletionChart';
import MonthlyBarChart from '@/components/dashboard/MonthlyBarChart';
import WeeklyTrendChart from '@/components/dashboard/WeeklyTrendChart';
import { getOverallStats, getMonthlyPerformance, getWeeklyTrend } from '@/actions/dashboard';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  let stats: any[] = [];
  let monthlyData: any[] = [];
  let weeklyTrend: any[] = [];

  try {
    [stats, monthlyData, weeklyTrend] = await Promise.all([
      getOverallStats(),
      getMonthlyPerformance(),
      getWeeklyTrend()
    ]);
  } catch (error) {
    console.error('Dashboard data fetch error:', error);
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Real-time overview of task performance across all weeks.</p>
      </div>

      <StatCards data={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-card text-card-foreground p-6 rounded-2xl border border-border shadow-sm flex flex-col">
          <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-6">Overall Completion</h3>
          <div className="flex-1 min-h-[300px]">
            <CompletionChart data={stats} />
          </div>
        </div>

        <div className="lg:col-span-2 bg-card text-card-foreground p-6 rounded-2xl border border-border shadow-sm flex flex-col">
          <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-6">Monthly Performance Breakdown</h3>
          <div className="flex-1 min-h-[300px]">
            <MonthlyBarChart data={monthlyData} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card text-card-foreground p-6 rounded-2xl border border-border shadow-sm flex flex-col">
          <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-6">Weekly Completion Trend</h3>
          <div className="flex-1 min-h-[300px]">
            <WeeklyTrendChart data={weeklyTrend} />
          </div>
        </div>

        <div className="lg:col-span-1 bg-card text-card-foreground p-6 rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col">
          <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-6">Monthly Summary</h3>
          <div className="flex-1 overflow-auto">
            {monthlyData.length > 0 ? (
              <table className="w-full text-left text-sm">
                <thead className="bg-muted sticky top-0">
                  <tr className="text-[10px] uppercase font-bold text-muted-foreground tracking-tighter">
                    <th className="px-4 py-2">Month</th>
                    <th className="px-4 py-2">Total</th>
                    <th className="px-4 py-2">Done</th>
                    <th className="px-4 py-2">Pct</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {monthlyData.map((m: any, idx: number) => (
                    <tr key={idx} className="hover:bg-muted/50 transition-colors">
                      <td className="px-4 py-3 font-medium">{typeof m.month === 'string' ? m.month.trim() : m.month}</td>
                      <td className="px-4 py-3">{m.total || 0}</td>
                      <td className="px-4 py-3 text-green-600 dark:text-green-400 font-bold">{m.done || 0}</td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-bold bg-muted px-1.5 py-0.5 rounded">
                          {(m.total || 0) > 0 ? Math.round(((m.done || 0) / m.total) * 100) : 0}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                No data available yet. Add some tasks to see analytics.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
