"use client";

import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-6 max-w-md mx-auto p-8">
        <div className="w-16 h-16 mx-auto bg-red-50 rounded-2xl flex items-center justify-center">
          <AlertTriangle className="text-red-500" size={28} />
        </div>
        <div>
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="text-sm text-zinc-500">
            There was an error loading this page. This might be a temporary issue with the database connection.
          </p>
        </div>
        <button
          onClick={() => reset()}
          className="inline-flex items-center space-x-2 bg-black text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-all"
        >
          <RefreshCw size={16} />
          <span>Try Again</span>
        </button>
      </div>
    </div>
  );
}
