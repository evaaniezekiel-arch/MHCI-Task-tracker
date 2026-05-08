import React from 'react';
import StatCards from '@/components/dashboard/StatCards';
import CompletionChart from '@/components/dashboard/CompletionChart';
import MonthlyBarChart from '@/components/dashboard/MonthlyBarChart';
import WeeklyTrendChart from '@/components/dashboard/WeeklyTrendChart';
import PendingReview from '@/components/dashboard/PendingReview';
import { getOverallStats, getMonthlyPerformance, getWeeklyTrend } from '@/actions/dashboard';
import { getReviewTasks } from '@/actions/tasks';

export const dynamic = 'force-dynamic';
export default async function DashboardPage() {
  let stats: any[] = [];
  let monthlyData: any[] = [];
  let weeklyTrend: any[] = [];
  let reviewTasks: any[] = [];

  try {
    const [statsRes, monthlyRes, weeklyRes, reviewRes] = await Promise.all([
      getOverallStats(),
      getMonthlyPerformance(),
      getWeeklyTrend(),
      getReviewTasks()
    ]);
    stats = statsRes;
    monthlyData = monthlyRes;
    weeklyTrend = weeklyRes;
    reviewTasks = reviewRes;
  } catch (error) {
    console.error('Dashboard data fetch error:', error);
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase">Executive Portal</h1>
          <p className="text-zinc-500 font-bold text-xs uppercase tracking-[0.2em] mt-2">Intelligence & Performance Oversight</p>
        </div>
        <div className="hidden md:flex space-x-2">
          <div className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg">
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">System Health</p>
            <p className="text-sm font-bold text-white">Optimal</p>
          </div>
        </div>
      </div>

      <StatCards data={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PendingReview tasks={reviewTasks} />
        </div>
        <div className="lg:col-span-1 bg-card text-card-foreground p-6 rounded-2xl border border-border shadow-sm flex flex-col">
          <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-6">Efficiency Quotient</h3>
          <div className="flex-1 min-h-[250px]">
            <CompletionChart data={stats} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-3 bg-card text-card-foreground p-6 rounded-2xl border border-border shadow-sm flex flex-col">
          <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground mb-6">Strategic Performance Index</h3>
          <div className="flex-1 min-h-[350px]">
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
