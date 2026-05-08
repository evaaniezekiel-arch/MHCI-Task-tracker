"use client";

import React from 'react';
import TaskTable from '@/components/tasks/TaskTable';
import { useRealtimeSubscription } from '@/lib/supabase/realtime';
import { Task } from '@/lib/types';
import { Sparkles, Brain, Target, Shield, Loader2 } from 'lucide-react';
import { getWeeklySummary } from '@/actions/ai';

interface WeekViewClientProps {
  weekId: string;
  initialTasks: Task[];
  weekNumber: number;
  startDate: string;
  endDate: string;
}

export default function WeekViewClient({ 
  weekId, 
  initialTasks, 
  weekNumber, 
  startDate, 
  endDate 
}: WeekViewClientProps) {
  // Subscribe to real-time updates for tasks in this week
  useRealtimeSubscription('tasks', `week_id=eq.${weekId}`);

  // Calculate completion
  const total = initialTasks.length;
  const done = initialTasks.filter(t => t.status === 'Done').length;
  const progress = total > 0 ? (done / total) * 100 : 0;

  const [summary, setSummary] = React.useState<{ strategicLoad: string, efficiencyForecast: string, recommendation: string } | null>(null);
  const [loadingSummary, setLoadingSummary] = React.useState(true);

  React.useEffect(() => {
    const fetchSummary = async () => {
      setLoadingSummary(true);
      try {
        const result = await getWeeklySummary(initialTasks, weekNumber);
        setSummary(result);
      } catch (error) {
        console.error('Failed to fetch weekly summary:', error);
      } finally {
        setLoadingSummary(false);
      }
    };
    fetchSummary();
  }, [weekId]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase mb-2">Week {weekNumber.toString().padStart(2, '0')}</h1>
          <p className="text-zinc-500 font-bold text-xs uppercase tracking-[0.2em]">{startDate} – {endDate} · Executive Review</p>
        </div>

        <div className="flex flex-col items-end space-y-2">
          <div className="w-full md:w-64 h-2 bg-[#1c1b1b] rounded-full overflow-hidden flex border border-[#2a2a2a]">
            <div className="h-full bg-white" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
            Strategic Progress: {Math.round(progress)}% ({done}/{total} Items)
          </span>
        </div>
      </div>

      {/* Global AI Summary Card */}
      <div className="bg-[#1c1b1b] border border-[#2a2a2a] rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 bg-[#131313] border-b border-[#2a2a2a] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-1.5 bg-white rounded-lg">
              <Sparkles size={16} className="text-black" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-white">Global AI Intelligence Overlay</span>
          </div>
          <div className="flex items-center space-x-2 text-[8px] font-bold text-zinc-500 uppercase tracking-widest">
            <Shield size={10} />
            <span>Secure Analysis Active</span>
          </div>
        </div>
        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8 min-h-[160px]">
          {loadingSummary ? (
            <div className="col-span-3 flex items-center justify-center space-x-3 text-zinc-500">
              <Loader2 size={16} className="animate-spin" />
              <span className="text-[10px] font-bold uppercase tracking-widest animate-pulse">Analyzing Week {weekNumber} Strategic Data...</span>
            </div>
          ) : summary ? (
            <>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-zinc-500">
                  <Brain size={14} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Strategic Load</span>
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {summary.strategicLoad}
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-zinc-500">
                  <Target size={14} />
                  <span className="text-[9px] font-black uppercase tracking-widest">Efficiency Forecast</span>
                </div>
                <p className="text-sm text-zinc-300 leading-relaxed">
                  {summary.efficiencyForecast}
                </p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-zinc-500">
                  <Sparkles size={14} />
                  <span className="text-[9px] font-black uppercase tracking-widest">AI Recommendation</span>
                </div>
                <div className="px-4 py-3 bg-[#131313] border border-[#2a2a2a] rounded-xl">
                  <p className="text-xs text-white font-medium">{summary.recommendation}</p>
                </div>
              </div>
            </>
          ) : (
            <div className="col-span-3 flex items-center justify-center text-zinc-600 italic text-xs">
              Configure AI in settings to enable weekly strategic intelligence.
            </div>
          )}
        </div>
      </div>

      <TaskTable initialTasks={initialTasks} weekId={weekId} />
    </div>
  );
}
