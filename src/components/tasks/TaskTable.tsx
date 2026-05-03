"use client";

import React, { useState, useEffect } from 'react';
import { cn, getStatusColor } from '@/lib/utils';
import { 
  MessageSquare, 
  MoreHorizontal, 
  Plus, 
  Download,
  Calendar as CalendarIcon,
  Trash2
} from 'lucide-react';
import { Task, Status, Priority } from '@/lib/types';
import { updateTask, updateTaskStatus, createTask, deleteTask } from '@/actions/tasks';
import toast from 'react-hot-toast';

interface TaskTableProps {
  initialTasks: Task[];
  weekId: string;
}

export default function TaskTable({ initialTasks, weekId }: TaskTableProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  // Sync with prop updates (from server refresh)
  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const handleStatusChange = async (taskId: string, newStatus: Status) => {
    // Optimistic update
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    
    try {
      const result = await updateTaskStatus(taskId, newStatus);
      if (result?.error) {
        toast.error(result.error);
        setTasks(initialTasks); // Rollback
      } else {
        toast.success('Status updated');
      }
    } catch (error) {
      toast.error('Failed to update status');
      setTasks(initialTasks); // Rollback
    }
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const result = await createTask(weekId, newTitle);
      if (result?.error) {
        toast.error(result.error);
      } else {
        setNewTitle('');
        setIsAdding(false);
        toast.success('Task added');
      }
    } catch (error) {
      toast.error('Failed to add task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    
    const originalTasks = [...tasks];
    // Optimistic update
    setTasks(prev => prev.filter(t => t.id !== taskId));
    
    try {
      const result = await deleteTask(taskId);
      if (result?.error) {
        toast.error(result.error);
        setTasks(originalTasks); // Rollback
      } else {
        toast.success('Task deleted');
      }
    } catch (error) {
      toast.error('Failed to delete task');
      setTasks(originalTasks); // Rollback
    }
  };

  return (
    <div className="bg-card text-card-foreground rounded-xl border border-border shadow-sm overflow-hidden">
      <div className="p-4 border-b border-border flex items-center justify-between bg-muted/50">
        <div className="flex items-center space-x-4">
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full border-2 border-card bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold">
              AU
            </div>
          </div>
        </div>

        <button className="flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-all">
          <Download size={16} />
          <span>Export Week</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted/50 border-b border-border text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
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
          <tbody className="divide-y divide-border text-sm">
            {tasks.map((task, index) => (
              <tr key={task.id} className="hover:bg-muted/30 group transition-colors">
                <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{index + 1}</td>
                <td className="px-4 py-3 font-medium">
                  <div 
                    className="cursor-text focus-within:ring-2 focus-within:ring-ring rounded px-1 -mx-1"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => {
                      const newTitle = e.currentTarget.innerText;
                      if (newTitle !== task.title) {
                        updateTask(task.id, { title: newTitle });
                      }
                    }}
                  >
                    {task.title}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide",
                    task.priority === 'High' || task.priority === 'Critical' ? 'bg-red-500/10 text-red-500' : 'bg-muted text-muted-foreground'
                  )}>
                    {task.priority}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground text-xs">{task.due_date || '-'}</td>
                <td className="px-4 py-3">
                  <select 
                    value={task.status}
                    onChange={(e) => handleStatusChange(task.id, e.target.value as Status)}
                    className={cn("status-badge border-none cursor-pointer focus:ring-0 bg-transparent", getStatusColor(task.status))}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In-Progress">In-Progress</option>
                    <option value="Done">Done</option>
                    <option value="Undone">Undone</option>
                    <option value="KIV">KIV</option>
                  </select>
                </td>
                <td className="px-4 py-3 text-muted-foreground text-xs italic">{task.notes}</td>
                <td className="px-4 py-3 text-center">
                  <button className="text-muted-foreground/40 hover:text-foreground transition-colors">
                    <MessageSquare size={16} />
                  </button>
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-muted-foreground/40 hover:text-red-500 transition-colors p-1"
                      title="Delete task"
                    >
                      <Trash2 size={16} />
                    </button>
                    <button className="text-muted-foreground/40 hover:text-foreground transition-colors p-1">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            
            {/* Add Task Input */}
            {isAdding ? (
              <tr className="bg-muted/20">
                <td className="px-4 py-3 text-muted-foreground/50 font-mono text-xs italic">+</td>
                <td colSpan={7} className="px-4 py-3">
                  <form onSubmit={handleAddTask} className="flex items-center space-x-2">
                    <input 
                      autoFocus
                      type="text" 
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      onBlur={() => !newTitle && setIsAdding(false)}
                      placeholder="Task name..."
                      className="flex-1 bg-transparent border-b border-foreground text-sm focus:outline-none text-foreground placeholder:text-muted-foreground"
                    />
                    <button type="submit" className="text-xs font-bold uppercase tracking-widest text-foreground">Add</button>
                  </form>
                </td>
              </tr>
            ) : (
              <tr className="bg-muted/20">
                <td className="px-4 py-3 text-muted-foreground/50 font-mono text-xs italic">+</td>
                <td colSpan={7} className="px-4 py-3">
                  <button 
                    onClick={() => setIsAdding(true)}
                    className="text-muted-foreground text-sm italic hover:text-foreground flex items-center space-x-2 transition-colors"
                  >
                    <Plus size={14} />
                    <span>Add new task...</span>
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
