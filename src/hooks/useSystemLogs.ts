import { useEffect, useState } from 'react';
import { supabase, supabaseReady } from '../lib/supabaseClient';

export interface SystemLog {
  id: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  category: string;
  message: string;
  train_id: string | null;
  train_name: string | null;
  location: string | null;
  created_at: string;
}

const mockLogs: SystemLog[] = [
  { id: '1', level: 'info',     category: 'GPS',      message: 'GPS feed connected successfully.',                      train_id: null,    train_name: null,              location: null,        created_at: new Date(Date.now() - 60000).toISOString() },
  { id: '2', level: 'warning',  category: 'Conflict', message: 'Potential conflict detected on Main Line.',             train_id: '12632', train_name: 'Nellai Express',  location: 'Chennai',   created_at: new Date(Date.now() - 120000).toISOString() },
  { id: '3', level: 'critical', category: 'Conflict', message: 'Critical conflict: Nellai Express vs Bangalore Rajdhani.', train_id: '22910', train_name: 'Bangalore Rajdhani', location: 'Katpadi Junction', created_at: new Date(Date.now() - 180000).toISOString() },
  { id: '4', level: 'warning',  category: 'Delay',    message: 'Trivandrum Express delayed by 5 min at Chengalpattu.', train_id: '12430', train_name: 'Trivandrum Express', location: 'Chengalpattu', created_at: new Date(Date.now() - 300000).toISOString() },
  { id: '5', level: 'error',    category: 'AI',       message: 'AI dispatch failed for Freight 023.',                  train_id: '56023', train_name: 'Freight 023',     location: 'Jolarpettai', created_at: new Date(Date.now() - 420000).toISOString() },
  { id: '6', level: 'info',     category: 'AI',       message: 'AI instruction accepted: Freight 023 diverted to alternate track.', train_id: '56023', train_name: 'Freight 023', location: 'Jolarpettai', created_at: new Date(Date.now() - 540000).toISOString() },
  { id: '7', level: 'info',     category: 'System',   message: 'Database backup completed successfully.',              train_id: null,    train_name: null,              location: null,        created_at: new Date(Date.now() - 900000).toISOString() },
  { id: '8', level: 'warning',  category: 'Track',    message: 'Track utilization at Jolarpettai exceeds 85%.',        train_id: null,    train_name: null,              location: 'Jolarpettai', created_at: new Date(Date.now() - 1200000).toISOString() },
];

async function seedLogs() {
  if (!supabase) return;
  const rows = mockLogs.map(({ id: _id, ...l }) => ({
    level: l.level, category: l.category, message: l.message,
    train_id: l.train_id, train_name: l.train_name, location: l.location,
  }));
  await supabase.from('system_logs').insert(rows);
}

export function useSystemLogs() {
  const [logs, setLogs] = useState<SystemLog[]>(mockLogs);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabaseReady || !supabase) {
      setLoading(false);
      return;
    }

    supabase
      .from('system_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)
      .then(async ({ data, error }) => {
        if (error) {
          setError(error.message);
        } else if (!data || data.length === 0) {
          await seedLogs();
          setLogs(mockLogs);
        } else {
          setLogs(data as SystemLog[]);
        }
        setLoading(false);
      });

    const channel = supabase
      .channel('logs-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'system_logs' }, payload => {
        setLogs(prev => [payload.new as SystemLog, ...prev]);
      })
      .subscribe();

    return () => { supabase!.removeChannel(channel); };
  }, []);

  return { logs, loading, error };
}
