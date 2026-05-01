"use client";

import React, { useState } from 'react';
import { cn, getStatusColor } from '@/lib/utils';
import { 
  MessageSquare, 
  MoreHorizontal, 
  Plus, 
  Download,
  Calendar as CalendarIcon
} from 'lucide-react';

const mockTasks = [
  { id: '1', title: 'Q1 Financial Review', priority: 'High', dueDate: '2025-01-10', status: 'Done', notes: 'Completed with CFO' },
  { id: '2', title: 'Board Meeting Prep', priority: 'High', dueDate: '2025-01-12', status: 'In-Progress', notes: 'Need slides from HR' },
  { id: '3', title: 'Team Sync', priority: 'Medium', dueDate: '2025-01-08', status: 'Pending', notes: 'Weekly recurring' },
  { id: '4', title: 'Product Launch Planning', priority: 'High', dueDate: '2025-01-20', status: 'Pending', notes: 'On hold until design signoff' },
  { id: '5', title: 'Quarterly OKR Alignment', priority: 'Medium', dueDate: '2025-01-15', status: 'Done', notes: 'All teams aligned' },
];

export default function TaskTable() {
  const [tasks, setTasks] = useState(mockTasks);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-xl border border-zinc-100 shadow-sm overflow-hidden">
      <div className="p-4 border-b flex items-center justify-between bg-zinc-50/50">
        <div className="flex items-center space-x-4">
          <div className="flex -space-x-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-zinc-200 flex items-center justify-center text-[10px] font-bold">
                U{i}
              </div>
            ))}
            <div className="w-8 h-8 rounded-full border-2 border-white bg-zinc-100 flex items-center justify-center text-[10px] font-bold text-zinc-400">
              +2
            </div>
          </div>
          <div className="h-4 w-px bg-zinc-200" />
          <div className="flex items-center space-x-1 text-zinc-500">
            <CalendarIcon size={14} />
            <span className="text-xs font-medium">06 Jan – 10 Jan 2025</span>
          </div>
        </div>

        <button className="flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors">
          <Download size={16} />
          <span>Export Week</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-zinc-50/50 border-b text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
              <th className="px-4 py-3 w-10">#</th>
              <th className="px-4 py-3">Task / Objective</th>
              <th className="px-4 py-3 w-32">Priority</th>
              <th className="px-4 py-3 w-32">Due Date</th>
              <th className="px-4 py-3 w-32">Status</th>
              <th className="px-4 py-3">Notes</th>
              <th className="px-4 py-3 w-10 text-center"><MessageSquare size={14} className="mx-auto" /></th>
              <th className="px-4 py-3 w-10"></th>
            </tr>
          </thead>
          <tbody className="divide-y text-sm">
            {tasks.map((task, index) => (
              <tr key={task.id} className="hover:bg-zinc-50/30 group transition-colors">
                <td className="px-4 py-3 text-zinc-400 font-mono text-xs">{index + 1}</td>
                <td className="px-4 py-3 font-medium">
                  <div 
                    className="cursor-text focus-within:ring-2 focus-within:ring-black rounded px-1 -mx-1"
                    contentEditable
                    suppressContentEditableWarning
                  >
                    {task.title}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide",
                    task.priority === 'High' ? 'bg-red-50 text-red-600' : 'bg-zinc-100 text-zinc-600'
                  )}>
                    {task.priority}
                  </span>
                </td>
                <td className="px-4 py-3 text-zinc-500 text-xs">{task.dueDate}</td>
                <td className="px-4 py-3">
                  <span className={cn("status-badge", getStatusColor(task.status))}>
                    {task.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-zinc-500 text-xs italic">{task.notes}</td>
                <td className="px-4 py-3 text-center">
                  <button className="text-zinc-300 hover:text-black transition-colors">
                    <MessageSquare size={16} />
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <button className="text-zinc-300 hover:text-black transition-colors p-1 rounded hover:bg-zinc-100">
                    <MoreHorizontal size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {/* Add Task Row */}
            <tr className="bg-zinc-50/20">
              <td className="px-4 py-3 text-zinc-300 font-mono text-xs italic">+</td>
              <td colSpan={7} className="px-4 py-3">
                <button className="text-zinc-400 text-sm italic hover:text-black flex items-center space-x-2 transition-colors">
                  <Plus size={14} />
                  <span>Add new task...</span>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
