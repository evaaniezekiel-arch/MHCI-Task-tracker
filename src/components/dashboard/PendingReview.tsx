"use client";

import React, { useState } from 'react';
import { Sparkles, ArrowRight, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import AiStrategyLab from './AiStrategyLab';

interface PendingReviewProps {
  tasks?: any[];
}

export default function PendingReview({ tasks = [
  { id: 1, title: 'Q4 Budget Approval', assignee: 'Sarah Collins', status: 'Pending' },
  { id: 2, title: 'Global Security Audit', assignee: 'James Wilson', status: 'Pending' },
  { id: 3, title: 'Executive Retreat Planning', assignee: 'Emily Davis', status: 'Pending' }
] }: PendingReviewProps) {
  const [selectedTask, setSelectedTask] = useState<any>(null);

  return (
    <div className="bg-card text-card-foreground p-6 rounded-2xl border border-border shadow-sm flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">Pending Executive Review</h3>
        <span className="text-[10px] font-bold bg-white text-black px-2 py-0.5 rounded uppercase tracking-widest">
          {tasks.length} Items
        </span>
      </div>

      <div className="space-y-4">
        {tasks.map((task) => (
          <div 
            key={task.id}
            className="group flex items-center justify-between p-4 bg-[#131313] border border-[#2a2a2a] rounded-xl hover:border-white/20 transition-all"
          >
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                <User size={16} className="text-zinc-500" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{task.title}</h4>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase">{task.assignee}</span>
                  <span className="w-1 h-1 rounded-full bg-zinc-700" />
                  <span className="text-[10px] text-zinc-600 uppercase font-bold tracking-tighter">Review Required</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                onClick={() => setSelectedTask(task)}
                className="p-2 hover:bg-white hover:text-black rounded-lg transition-all text-zinc-400"
                title="AI Insights"
              >
                <Sparkles size={16} />
              </button>
              <button className="p-2 hover:bg-white hover:text-black rounded-lg transition-all text-zinc-400">
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="w-full mt-6 py-3 border border-dashed border-zinc-800 rounded-xl text-xs font-bold text-zinc-500 hover:border-zinc-600 hover:text-zinc-300 transition-all uppercase tracking-widest">
        View All Pending Activities
      </button>

      <AiStrategyLab 
        isOpen={!!selectedTask} 
        onClose={() => setSelectedTask(null)} 
        taskData={selectedTask}
      />
    </div>
  );
}
