"use client";

import { useEffect } from 'react';
import { createClient } from './client';
import { useRouter } from 'next/navigation';

export function useRealtimeSubscription(
  table: string,
  filter?: string,
  callback?: (payload: any) => void
) {
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const channel = supabase
      .channel(`realtime:${table}:${filter || 'all'}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
          filter: filter,
        },
        (payload) => {
          console.log('Realtime update:', payload);
          if (callback) {
            callback(payload);
          } else {
            // Default behavior: refresh the page to get latest server state
            router.refresh();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, filter, callback, router, supabase]);
}
