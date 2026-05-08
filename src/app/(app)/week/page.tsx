import React from 'react';
import { getWeeks } from '@/actions/weeks';
import Link from 'next/link';
import { Calendar, ChevronRight, Target, Activity } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function WeeklyReviewPage() {
  const weeks = await getWeeks(2024); // Assuming 2024 for now, or fetch all

  return (
    <div className="space-y-12 max-w-5xl mx-auto py-8">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-white rounded-xl shadow-2xl">
            <Calendar size={24} className="text-black" />
          </div>
          <h1 className="text-5xl font-black tracking-tighter uppercase text-white">Strategic Calendar</h1>
        </div>
        <p className="text-zinc-500 font-bold text-xs uppercase tracking-[0.3em] ml-1">Select a tactical window for review and execution</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {weeks.map((week) => (
          <Link 
            key={week.id} 
            href={`/week/${week.id}`}
            className="group relative bg-[#131313] border border-[#2a2a2a] rounded-3xl p-8 hover:border-white transition-all duration-500 overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all" />
            
            <div className="relative z-10 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-white transition-colors">Tactical Week</span>
                <ChevronRight size={16} className="text-zinc-700 group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>

              <div>
                <h3 className="text-4xl font-black tracking-tighter text-white mb-1">W{week.week_number.toString().padStart(2, '0')}</h3>
                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  {formatDate(week.start_date)} — {formatDate(week.end_date)}
                </p>
              </div>

              <div className="pt-4 border-t border-[#2a2a2a] flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Activity size={12} className="text-zinc-600" />
                  <span className="text-[9px] font-black uppercase tracking-tighter text-zinc-600">Active Status</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Target size={12} className="text-zinc-600" />
                  <span className="text-[9px] font-black uppercase tracking-tighter text-zinc-600">High Priority</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
