"use client";

import React, { useState } from 'react';
import { Brain, Settings2, ShieldCheck, Zap, Eye, EyeOff, Save, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AiConfigPage() {
  const [provider, setProvider] = useState<'gemini' | 'openai' | 'claude'>('gemini');
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  const toggleKey = (key: string) => {
    setShowKeys(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase">System Intelligence</h1>
          <p className="text-zinc-500 font-bold text-xs uppercase tracking-[0.2em] mt-2">AI Configuration & Model Oversight</p>
        </div>
        <div className="hidden md:flex space-x-2">
          <div className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center space-x-2">
            <Activity size={14} className="text-white" />
            <span className="text-[10px] text-white font-bold uppercase tracking-widest">Active Provider: {provider.toUpperCase()}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar Nav */}
        <div className="md:col-span-1 space-y-2">
          <button 
            onClick={() => setProvider('gemini')}
            className={cn(
              "w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left",
              provider === 'gemini' ? "bg-white text-black border-white" : "bg-[#1c1b1b] text-zinc-500 border-[#2a2a2a] hover:border-zinc-700"
            )}
          >
            <div className="flex items-center space-x-3">
              <Zap size={18} />
              <span className="font-bold text-sm">Google Gemini</span>
            </div>
            {provider === 'gemini' && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
          </button>
          <button 
            onClick={() => setProvider('openai')}
            className={cn(
              "w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left",
              provider === 'openai' ? "bg-white text-black border-white" : "bg-[#1c1b1b] text-zinc-500 border-[#2a2a2a] hover:border-zinc-700"
            )}
          >
            <div className="flex items-center space-x-3">
              <Brain size={18} />
              <span className="font-bold text-sm">OpenAI</span>
            </div>
            {provider === 'openai' && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
          </button>
          <button 
            onClick={() => setProvider('claude')}
            className={cn(
              "w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left",
              provider === 'claude' ? "bg-white text-black border-white" : "bg-[#1c1b1b] text-zinc-500 border-[#2a2a2a] hover:border-zinc-700"
            )}
          >
            <div className="flex items-center space-x-3">
              <ShieldCheck size={18} />
              <span className="font-bold text-sm">Anthropic Claude</span>
            </div>
            {provider === 'claude' && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
          </button>
        </div>

        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-[#1c1b1b] border border-[#2a2a2a] rounded-2xl p-8 space-y-8">
            <div className="space-y-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">API Configuration</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Access Key</label>
                  <div className="relative">
                    <input 
                      type={showKeys[provider] ? "text" : "password"} 
                      placeholder={`Enter ${provider} API key...`}
                      className="w-full bg-[#131313] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-700 focus:outline-none focus:border-white transition-all"
                    />
                    <button 
                      onClick={() => toggleKey(provider)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors"
                    >
                      {showKeys[provider] ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Preferred Model</label>
                  <select className="w-full bg-[#131313] border border-[#2a2a2a] rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white transition-all appearance-none">
                    {provider === 'gemini' && (
                      <>
                        <option>Gemini 1.5 Pro (Recommended)</option>
                        <option>Gemini 1.5 Flash</option>
                        <option>Gemini 1.0 Pro</option>
                      </>
                    )}
                    {provider === 'openai' && (
                      <>
                        <option>GPT-4o (Omni)</option>
                        <option>GPT-4 Turbo</option>
                        <option>GPT-3.5 Turbo</option>
                      </>
                    )}
                    {provider === 'claude' && (
                      <>
                        <option>Claude 3.5 Sonnet</option>
                        <option>Claude 3 Opus</option>
                        <option>Claude 3 Haiku</option>
                      </>
                    )}
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-[#2a2a2a]">
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400">Intelligence Constraints</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Token Limit per Request</label>
                    <span className="text-xs font-bold text-white">2,048</span>
                  </div>
                  <input type="range" className="w-full accent-white h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer" />
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4 pt-4">
              <button className="flex-1 px-6 py-3 bg-white text-black text-xs font-bold uppercase tracking-widest rounded-xl hover:bg-zinc-200 transition-all flex items-center justify-center space-x-2">
                <Save size={14} />
                <span>Save Configuration</span>
              </button>
              <button className="px-6 py-3 border border-zinc-800 text-zinc-500 text-xs font-bold uppercase tracking-widest rounded-xl hover:border-white hover:text-white transition-all">
                Test Connection
              </button>
            </div>
          </div>

          <div className="p-6 bg-zinc-900/30 border border-dashed border-zinc-800 rounded-2xl flex items-start space-x-4">
            <div className="p-2 bg-zinc-800 rounded-lg">
              <Settings2 size={16} className="text-zinc-400" />
            </div>
            <div>
              <p className="text-xs font-bold text-zinc-300 uppercase tracking-tight">Technical Advisory</p>
              <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                API keys are stored locally and encrypted. Ensure your provider limits are configured in their respective consoles to prevent unexpected overhead.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
