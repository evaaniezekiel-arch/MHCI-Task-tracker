"use client";

import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle, AlertCircle, Clock, Search, Filter, User, MoreVertical, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import AiStrategyLab from '@/components/dashboard/AiStrategyLab';
import { getReviewTasks, updateTaskStatus } from '@/actions/tasks';
import { Task } from '@/lib/types';
import { toast } from 'react-hot-toast';

export default function ReviewHubPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [filter, setFilter] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchTasks = async () => {
    setIsLoading(true);
    try {
      const data = await getReviewTasks();
      setTasks(data as Task[]);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
      toast.error('Failed to load review tasks');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleApprove = async (taskId: string) => {
    try {
      await updateTaskStatus(taskId, 'Done');
      toast.success('Activity Approved');
      fetchTasks();
    } catch (error) {
      toast.error('Failed to approve activity');
    }
  };

  const filteredTasks = tasks.filter(task => 
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase">Review Hub</h1>
          <p className="text-zinc-500 font-bold text-xs uppercase tracking-[0.2em] mt-2">Strategic Activity Approval</p>
        </div>
        <div className="flex space-x-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
            <input 
              type="text" 
              placeholder="Search activities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-[#1c1b1b] border border-[#2a2a2a] rounded-lg text-xs text-white placeholder:text-zinc-700 focus:outline-none focus:border-white transition-all w-64"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4 border-b border-[#2a2a2a] pb-4">
        {['pending', 'approved', 'flagged'].map((f) => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "text-[10px] font-bold uppercase tracking-widest px-4 py-2 rounded-lg transition-all",
              filter === f ? "bg-white text-black" : "text-zinc-500 hover:text-white"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 size={40} className="text-white animate-spin" />
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest animate-pulse">Syncing Executive Data...</p>
          </div>
        ) : filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div 
              key={task.id}
              className="group bg-[#1c1b1b] border border-[#2a2a2a] rounded-2xl p-6 flex items-center justify-between hover:border-white/20 transition-all"
            >
              <div className="flex items-center space-x-6">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center border",
                  task.priority === 'Critical' ? "bg-white text-black border-white" : "bg-[#131313] text-zinc-500 border-[#2a2a2a]"
                )}>
                  {task.status === 'Review' ? <Clock size={20} /> : <CheckCircle size={20} />}
                </div>
                <div>
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-bold text-white">{task.title}</h3>
                    <span className={cn(
                      "text-[8px] font-black uppercase tracking-tighter px-1.5 py-0.5 rounded border",
                      task.priority === 'Critical' ? "border-white text-white" : "border-zinc-800 text-zinc-600"
                    )}>
                      {task.priority}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center text-[8px] font-bold text-zinc-400">
                        {task.assignees?.[0]?.profile?.full_name?.charAt(0) || <User size={10} />}
                      </div>
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight">
                        {task.assignees?.[0]?.profile?.full_name || 'Unassigned'}
                      </span>
                    </div>
                    <span className="w-1 h-1 rounded-full bg-zinc-800" />
                    <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-tight">Due {task.due_date || 'TBD'}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button 
                  onClick={() => setSelectedTask(task)}
                  className="p-3 bg-[#131313] border border-[#2a2a2a] rounded-xl text-zinc-500 hover:text-white hover:border-white transition-all"
                  title="AI Strategic Analysis"
                >
                  <Sparkles size={18} />
                </button>
                <button 
                  onClick={() => handleApprove(task.id)}
                  className="px-6 py-3 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-xl hover:bg-zinc-200 transition-all"
                >
                  Approve Activity
                </button>
                <button className="p-3 hover:bg-[#2a2a2a] rounded-xl transition-all text-zinc-500">
                  <MoreVertical size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-10 border border-dashed border-[#2a2a2a] rounded-3xl flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-4 bg-[#1c1b1b] border border-[#2a2a2a] rounded-2xl">
              <AlertCircle size={32} className="text-zinc-700" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white uppercase tracking-widest">End of Stack</h4>
              <p className="text-xs text-zinc-600 mt-1">All high-priority pending activities have been reviewed.</p>
            </div>
          </div>
        )}
      </div>

      <AiStrategyLab 
        isOpen={!!selectedTask} 
        onClose={() => setSelectedTask(null)} 
        taskData={selectedTask}
      />
    </div>
  );
}
