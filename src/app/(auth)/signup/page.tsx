"use client";

import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader2, User } from 'lucide-react';
import { signup } from '@/actions/auth';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    const result = await signup(formData);
    if (result?.error) {
      toast.error(result.error);
      setIsLoading(false);
    } else {
      setIsSuccess(true);
      toast.success('Check your email to confirm your account!');
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-zinc-50">
        <div className="w-full max-w-md text-center space-y-6 bg-white p-12 rounded-3xl shadow-xl shadow-black/5 border border-zinc-100">
          <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto">
            <Mail size={32} />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Verify your email</h1>
          <p className="text-zinc-500">
            We've sent a confirmation link to your email. Please click the link to activate your account.
          </p>
          <Link href="/login" className="block text-black font-bold hover:underline pt-4">
            Back to login
          </Link>
        </div>
      </div>
    );
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
            The Executive <br /> Dashboard for <br /> Modern Teams.
          </h2>
          <p className="text-zinc-400 mt-4 max-w-sm">
            Join the most sophisticated task management platform designed for high-performance collaboration.
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
            <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
            <p className="text-zinc-500 mt-2">Get started with your executive workspace.</p>
          </div>

          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-zinc-500">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input 
                  required
                  name="fullName"
                  type="text" 
                  placeholder="John Doe" 
                  className="w-full pl-12 pr-4 py-3 bg-zinc-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all"
                />
              </div>
            </div>

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
              <label className="text-sm font-bold uppercase tracking-wider text-zinc-500">Password</label>
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
              <span>{isLoading ? 'Creating Account...' : 'Create Account'}</span>
            </button>
          </form>

          <div className="pt-6 border-t text-center">
            <p className="text-sm text-zinc-500">
              Already have an account? <Link href="/login" className="text-black font-bold hover:underline">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
