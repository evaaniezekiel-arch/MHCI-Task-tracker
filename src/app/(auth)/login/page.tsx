"use client";

import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { login } from '@/actions/auth';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    const result = await login(formData);
    if (result?.error) {
      toast.error(result.error);
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 bg-black text-white p-16 flex-col justify-between relative overflow-hidden">
        <div className="z-10">
          <div className="w-12 h-12 bg-white rounded-xl mb-8 flex items-center justify-center">
            <div className="w-6 h-6 bg-black rounded-sm transform rotate-45" />
          </div>
          <h2 className="text-4xl font-bold tracking-tight leading-tight">
            Real-time Task <br /> Management for <br /> Executives.
          </h2>
          <p className="text-zinc-400 mt-4 max-w-sm">
            Collaborate, track, and visualize performance across your entire organization with premium insights.
          </p>
        </div>

        <div className="z-10">
          <p className="text-sm font-medium text-zinc-500 uppercase tracking-widest">MHCI Task Tracker © 2025</p>
        </div>

        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-zinc-900 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-zinc-900 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl opacity-50" />
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-zinc-500 mt-2">Enter your credentials to access your dashboard.</p>
          </div>

          <form action={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-zinc-500">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input 
                  required
                  name="email"
                  type="email" 
                  placeholder="name@company.com" 
                  className="w-full pl-12 pr-4 py-3 bg-zinc-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-bold uppercase tracking-wider text-zinc-500">Password</label>
                <a href="#" className="text-xs font-bold text-black hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input 
                  required
                  name="password"
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="w-full pl-12 pr-12 py-3 bg-zinc-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-black"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              disabled={isLoading}
              className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-zinc-800 transition-all shadow-xl shadow-black/10 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading && <Loader2 className="animate-spin" size={18} />}
              <span>{isLoading ? 'Signing In...' : 'Sign In'}</span>
            </button>
          </form>

          <div className="pt-6 border-t text-center">
            <p className="text-sm text-zinc-500">
              You may have been sent an invite — <a href="#" className="text-black font-bold hover:underline">check your email</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
