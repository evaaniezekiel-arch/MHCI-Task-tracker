"use client";

import React from 'react';
import { Sparkles, X, Brain, Target, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AiStrategyLabProps {
  isOpen: boolean;
  onClose: () => void;
  taskData?: {
    title: string;
    description: string;
    priority: string;
  };
}

export default function AiStrategyLab({ isOpen, onClose, taskData }: AiStrategyLabProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-[#1c1b1b] border border-[#2a2a2a] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="p-6 border-b border-[#2a2a2a] flex items-center justify-between bg-[#131313]">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-white rounded-lg">
                <Sparkles size={20} className="text-black" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white">AI Strategy Lab</h2>
                <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Intelligence Overlay</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-[#2a2a2a] rounded-full transition-colors text-zinc-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-8 space-y-8">
            {/* Executive Summary */}
            <section className="space-y-3">
              <div className="flex items-center space-x-2 text-zinc-400">
                <Brain size={16} />
                <span className="text-[10px] uppercase font-bold tracking-widest">Executive Summary</span>
              </div>
              <p className="text-lg text-white leading-relaxed font-medium">
                AI analysis indicates this task ({taskData?.title || 'Selected Objective'}) is a critical driver for Q4 growth. 
                Immediate resource leveling is recommended to mitigate potential compliance bottlenecks.
              </p>
            </section>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Recommended Approach */}
              <section className="space-y-4">
                <div className="flex items-center space-x-2 text-zinc-400">
                  <Target size={16} />
                  <span className="text-[10px] uppercase font-bold tracking-widest">Recommended Approach</span>
                </div>
                <ul className="space-y-3">
                  {[
                    "Verify cross-departmental impact.",
                    "Standardize documentation protocols.",
                    "Prioritize high-value milestones."
                  ].map((item, i) => (
                    <li key={i} className="flex items-start space-x-3 text-sm text-zinc-300">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-white flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Resource Allocation */}
              <section className="space-y-4">
                <div className="flex items-center space-x-2 text-zinc-400">
                  <Users size={16} />
                  <span className="text-[10px] uppercase font-bold tracking-widest">Resource Allocation</span>
                </div>
                <div className="bg-[#131313] border border-[#2a2a2a] p-4 rounded-xl space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold">S</div>
                    <div>
                      <p className="text-sm font-bold text-white">Sarah Collins</p>
                      <p className="text-[10px] text-zinc-500 font-bold uppercase">Senior Assistant</p>
                    </div>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    Sarah is best suited for this task given her deep expertise in institutional compliance and Q4 protocol history.
                  </p>
                </div>
              </section>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 bg-[#131313] border-t border-[#2a2a2a] flex justify-end">
            <button 
              onClick={onClose}
              className="px-6 py-2 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-zinc-200 transition-colors"
            >
              Acknowledge Strategy
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
