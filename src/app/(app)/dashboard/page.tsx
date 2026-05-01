import React from 'react';
import StatCards from '@/components/dashboard/StatCards';
import CompletionChart from '@/components/dashboard/CompletionChart';
import MonthlyBarChart from '@/components/dashboard/MonthlyBarChart';
import WeeklyTrendChart from '@/components/dashboard/WeeklyTrendChart';
import { getOverallStats, getMonthlyPerformance, getWeeklyTrend } from '@/actions/dashboard';
import { cn } from '@/lib/utils';

export default async function DashboardPage() {
  const [stats, monthlyData, weeklyTrend] = await Promise.all([
    getOverallStats(),
    getMonthlyPerformance(2025),
    getWeeklyTrend(2025)
  ]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Executive Dashboard</h1>
        <p className="text-zinc-500 mt-1">Real-time overview of task performance across all weeks.</p>
      </div>

      <StatCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm flex flex-col">
          <h3 className="font-bold text-sm uppercase tracking-widest text-zinc-400 mb-6">Overall Completion</h3>
          <div className="flex-1 min-h-[300px]">
            <CompletionChart data={stats} />
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm flex flex-col">
          <h3 className="font-bold text-sm uppercase tracking-widest text-zinc-400 mb-6">Monthly Performance Breakdown</h3>
          <div className="flex-1 min-h-[300px]">
            <MonthlyBarChart data={monthlyData} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm flex flex-col">
          <h3 className="font-bold text-sm uppercase tracking-widest text-zinc-400 mb-6">Weekly Completion Trend</h3>
          <div className="flex-1 min-h-[300px]">
            <WeeklyTrendChart data={weeklyTrend} />
          </div>
        </div>

        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-zinc-100 shadow-sm overflow-hidden flex flex-col">
          <h3 className="font-bold text-sm uppercase tracking-widest text-zinc-400 mb-6 px-6 pt-6">Monthly Summary</h3>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 sticky top-0">
                <tr className="text-[10px] uppercase font-bold text-zinc-400 tracking-tighter">
                  <th className="px-4 py-2">Month</th>
                  <th className="px-4 py-2">Total</th>
                  <th className="px-4 py-2">Done</th>
                  <th className="px-4 py-2">Pct</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {monthlyData.map((m: any) => (
                  <tr key={m.month} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-4 py-3 font-medium">{m.month.trim()}</td>
                    <td className="px-4 py-3">{m.total}</td>
                    <td className="px-4 py-3 text-green-600 font-bold">{m.done}</td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] font-bold bg-zinc-100 px-1.5 py-0.5 rounded">
                        {m.total > 0 ? Math.round((m.done / m.total) * 100) : 0}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
