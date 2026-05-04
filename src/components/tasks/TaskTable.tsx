"use client";

import React, { useState, useEffect } from 'react';
import { cn, getStatusColor } from '@/lib/utils';
import { 
  MessageSquare, 
  MoreHorizontal, 
  Plus, 
  Download,
  Trash2
} from 'lucide-react';
import { Task, Status, Priority } from '@/lib/types';
import { updateTask, updateTaskStatus, createTask, deleteTask } from '@/actions/tasks';
import toast from 'react-hot-toast';
import AddTaskModal from './AddTaskModal';

interface TaskTableProps {
  initialTasks: Task[];
  weekId: string;
}

export default function TaskTable({ initialTasks, weekId }: TaskTableProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const handleAddTask = async (taskData: {
    title: string;
    description: string;
    dueDate: string;
    priority: Priority;
  }) => {
    const result = await createTask(
      weekId, 
      taskData.title, 
      taskData.description, 
      taskData.dueDate, 
      taskData.priority
    );
    if (result?.error) {
      toast.error(result.error);
      throw new Error(result.error);
    } else {
      toast.success('Task created');
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

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-500/15 text-red-500';
      case 'High': return 'bg-orange-500/15 text-orange-500';
      case 'Medium': return 'bg-amber-500/15 text-amber-500';
      case 'Low': return 'bg-green-500/15 text-green-500';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <>
      <div className="bg-card text-card-foreground rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between bg-muted/50">
          <div className="flex items-center space-x-4">
            <div className="flex -space-x-2">
              <div className="w-8 h-8 rounded-full border-2 border-card bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold">
                AU
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-all"
            >
              <Plus size={16} />
              <span>Add Task</span>
            </button>
            <button className="flex items-center space-x-2 text-muted-foreground hover:text-foreground px-3 py-2 rounded-lg text-sm font-medium border border-border hover:bg-muted transition-all">
              <Download size={16} />
              <span>Export</span>
            </button>
          </div>
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
              {tasks.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                        <Plus size={20} className="text-muted-foreground" />
                      </div>
                      <div>
                        <p className="text-muted-foreground font-medium">No tasks yet</p>
                        <p className="text-muted-foreground/60 text-xs mt-1">Click "Add Task" to create your first task for this week.</p>
                      </div>
                      <button
                        onClick={() => setIsModalOpen(true)}
                        className="mt-2 flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-xs font-bold hover:opacity-90 transition-all"
                      >
                        <Plus size={14} />
                        Add Task
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                tasks.map((task, index) => (
                  <tr key={task.id} className="hover:bg-muted/30 group transition-colors">
                    <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{index + 1}</td>
                    <td className="px-4 py-3 font-medium">
                      <div>
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
                        {task.description && (
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{task.description}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide",
                        getPriorityStyle(task.priority)
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddTask}
      />
    </>
  );
}
