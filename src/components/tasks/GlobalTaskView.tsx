"use client";

import React, { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, Filter, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import TaskTable from './TaskTable';

export default function GlobalTaskView({ initialTasks, weeks }: { initialTasks: any[], weeks: any[] }) {
  const [filterMode, setFilterMode] = useState<'all' | 'month' | 'week' | 'day'>('month');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  
  const currentYear = new Date().getFullYear();

  // Filter tasks based on search query
  const searchedTasks = useMemo(() => {
    if (!searchQuery) return initialTasks;
    return initialTasks.filter(t => 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      t.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [initialTasks, searchQuery]);

  // Group weeks and tasks based on filter mode
  const displayedData = useMemo(() => {
    let filteredWeeks = [...weeks];

    if (filterMode === 'month') {
      filteredWeeks = weeks.filter(w => new Date(w.start_date).getMonth() === selectedMonth);
    } else if (filterMode === 'week') {
      // Just show current week for now, or allow selecting a week
      const currentWeekNum = weeks.find(w => new Date(w.start_date) <= new Date() && new Date(w.end_date) >= new Date())?.week_number || 1;
      filteredWeeks = weeks.filter(w => w.week_number === currentWeekNum);
    } else if (filterMode === 'day') {
      // Show tasks specifically due today or in the current week
      const today = new Date().toISOString().split('T')[0];
      // We will still group by week but filter tasks heavily
    }

    // Map filtered weeks to their tasks
    return filteredWeeks.map(week => {
      let weekTasks = searchedTasks.filter(t => t.week_id === week.id);
      
      if (filterMode === 'day') {
        const today = new Date().toISOString().split('T')[0];
        weekTasks = weekTasks.filter(t => t.due_date === today);
      }

      return {
        week,
        tasks: weekTasks
      };
    }).filter(data => data.tasks.length > 0 || filterMode === 'week'); // Always show current week even if empty, otherwise only show weeks with tasks

  }, [weeks, searchedTasks, filterMode, selectedMonth]);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="bg-white p-4 rounded-xl border border-zinc-100 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        
        {/* Filter Tabs */}
        <div className="flex bg-zinc-100 p-1 rounded-lg">
          {(['all', 'month', 'week', 'day'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setFilterMode(mode)}
              className={cn(
                "px-4 py-1.5 rounded-md text-xs font-bold uppercase tracking-widest transition-all",
                filterMode === mode ? "bg-white text-black shadow-sm" : "text-zinc-500 hover:text-zinc-700"
              )}
            >
              {mode}
            </button>
          ))}
        </div>

        {/* Month Selector (only show if mode is month) */}
        {filterMode === 'month' && (
          <div className="flex space-x-1 overflow-x-auto max-w-full custom-scrollbar pb-1 md:pb-0">
            {months.map((m, i) => (
              <button
                key={m}
                onClick={() => setSelectedMonth(i)}
                className={cn(
                  "px-3 py-1 text-xs font-bold rounded-md transition-colors",
                  selectedMonth === i ? "bg-black text-white" : "hover:bg-zinc-100 text-zinc-500"
                )}
              >
                {m}
              </button>
            ))}
          </div>
        )}

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
          <input 
            type="text" 
            placeholder="Search all tasks..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-zinc-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-black transition-all"
          />
        </div>
      </div>

      {/* Task Tables by Week */}
      <div className="space-y-8">
        {displayedData.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-zinc-200">
            <Filter className="mx-auto text-zinc-300 mb-4" size={32} />
            <h3 className="text-zinc-500 font-medium">No tasks found for this view</h3>
            <p className="text-zinc-400 text-sm mt-1">Try changing your filters or adding a new task.</p>
          </div>
        ) : (
          displayedData.map(({ week, tasks }) => (
            <div key={week.id} className="space-y-3">
              <div className="flex items-center space-x-3 px-1">
                <div className="bg-black text-white w-8 h-8 rounded-lg flex items-center justify-center">
                  <CalendarIcon size={16} />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-none">Week {week.week_number.toString().padStart(2, '0')}</h3>
                  <p className="text-xs text-zinc-500 font-medium">{new Date(week.start_date).toLocaleDateString()} — {new Date(week.end_date).toLocaleDateString()}</p>
                </div>
              </div>
              <TaskTable initialTasks={tasks} weekId={week.id} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
