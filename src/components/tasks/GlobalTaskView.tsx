"use client";

import React, { useState, useMemo } from 'react';
import { Calendar as CalendarIcon, Filter, Search, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import TaskTable from './TaskTable';
import { createWeek } from '@/actions/weeks';
import toast from 'react-hot-toast';

export default function GlobalTaskView({ initialTasks, weeks }: { initialTasks: any[], weeks: any[] }) {
  const [filterMode, setFilterMode] = useState<'all' | 'month' | 'week' | 'day'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Get unique years from weeks data
  const availableYears = useMemo(() => {
    const years = [...new Set(weeks.map(w => w.year))].sort((a, b) => b - a);
    if (years.length === 0) years.push(new Date().getFullYear());
    return years;
  }, [weeks]);

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
      filteredWeeks = weeks.filter(w => {
        const startMonth = new Date(w.start_date).getMonth();
        return startMonth === selectedMonth && w.year === selectedYear;
      });
    } else if (filterMode === 'week') {
      const now = new Date();
      const currentWeek = weeks.find(w => 
        new Date(w.start_date) <= now && new Date(w.end_date) >= now
      );
      if (currentWeek) {
        filteredWeeks = [currentWeek];
      } else {
        // Show the latest week if no current week found
        filteredWeeks = weeks.length > 0 ? [weeks[weeks.length - 1]] : [];
      }
    } else if (filterMode === 'day') {
      // For day mode, show tasks due today within any week
      const now = new Date();
      const currentWeek = weeks.find(w => 
        new Date(w.start_date) <= now && new Date(w.end_date) >= now
      );
      filteredWeeks = currentWeek ? [currentWeek] : [];
    }

    // Map filtered weeks to their tasks
    return filteredWeeks.map(week => {
      let weekTasks = searchedTasks.filter(t => t.week_id === week.id);
      
      if (filterMode === 'day') {
        const today = new Date().toISOString().split('T')[0];
        weekTasks = weekTasks.filter(t => t.due_date === today || !t.due_date);
      }

      return {
        week,
        tasks: weekTasks
      };
    });
  }, [weeks, searchedTasks, filterMode, selectedMonth, selectedYear]);

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const handleCreateWeek = async () => {
    const nextNum = weeks.length > 0 ? Math.max(...weeks.map(w => w.week_number)) + 1 : 1;
    const today = new Date();
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    try {
      const result = await createWeek(
        nextNum,
        monday.toISOString().split('T')[0],
        sunday.toISOString().split('T')[0],
        today.getFullYear()
      );

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(`Week ${nextNum} created`);
      }
    } catch (error: any) {
      toast.error(error?.message || 'Failed to create week');
    }
  };

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
          <div className="flex items-center gap-3">
            {availableYears.length > 1 && (
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="text-xs font-bold bg-zinc-100 rounded-md px-2 py-1 border-none"
              >
                {availableYears.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            )}
            <div className="flex space-x-1 overflow-x-auto max-w-full custom-scrollbar pb-1 md:pb-0">
              {months.map((m, i) => (
                <button
                  key={m}
                  onClick={() => setSelectedMonth(i)}
                  className={cn(
                    "px-3 py-1 text-xs font-bold rounded-md transition-colors whitespace-nowrap",
                    selectedMonth === i ? "bg-black text-white" : "hover:bg-zinc-100 text-zinc-500"
                  )}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search + Create Week */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <input 
              type="text" 
              placeholder="Search tasks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-zinc-50 border-none rounded-lg text-sm focus:ring-2 focus:ring-black transition-all"
            />
          </div>
          <button
            onClick={handleCreateWeek}
            className="flex items-center space-x-1.5 bg-black text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-zinc-800 transition-colors whitespace-nowrap"
          >
            <Plus size={14} />
            <span>New Week</span>
          </button>
        </div>
      </div>

      {/* Task Tables by Week */}
      <div className="space-y-8">
        {displayedData.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-zinc-200">
            <Filter className="mx-auto text-zinc-300 mb-4" size={32} />
            <h3 className="text-zinc-500 font-medium">No weeks found for this view</h3>
            <p className="text-zinc-400 text-sm mt-1 mb-6">Create a new week to start adding tasks.</p>
            <button
              onClick={handleCreateWeek}
              className="inline-flex items-center space-x-2 bg-black text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all"
            >
              <Plus size={16} />
              <span>Create First Week</span>
            </button>
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
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest ml-auto">
                  {tasks.length} task{tasks.length !== 1 ? 's' : ''}
                </span>
              </div>
              <TaskTable initialTasks={tasks} weekId={week.id} />
            </div>
          ))
        )}
      </div>
    </div>
  );
}
