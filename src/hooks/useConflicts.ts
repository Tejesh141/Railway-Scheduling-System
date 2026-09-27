import { useEffect, useState } from 'react';
import { supabase, supabaseReady } from '../lib/supabaseClient';
import { Conflict } from '../types';
import { mockConflicts } from '../data/mockData';

function mapRow(row: Record<string, unknown>): Conflict {
  return {
    id: row.id as string,
    trainId1: row.train_id1 as string,
    trainId2: row.train_id2 as string,
    trainName1: row.train_name1 as string,
    trainName2: row.train_name2 as string,
    location: row.location as string,
    timeToConflict: row.time_to_conflict as number,
    severity: row.severity as Conflict['severity'],
  };
}

async function seedConflicts() {
  if (!supabase) return;
  const rows = mockConflicts.map(c => ({
    id: c.id,
    train_id1: c.trainId1,
    train_id2: c.trainId2,
    train_name1: c.trainName1,
    train_name2: c.trainName2,
    location: c.location,
    time_to_conflict: c.timeToConflict,
    severity: c.severity,
    resolved: false,
  }));
  await supabase.from('conflicts').upsert(rows, { onConflict: 'id' });
}

export function useConflicts() {
  const [conflicts, setConflicts] = useState<Conflict[]>(mockConflicts);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabaseReady || !supabase) {
      setLoading(false);
      return;
    }

    supabase
      .from('conflicts')
      .select('*')
      .eq('resolved', false)
      .order('time_to_conflict')
      .then(async ({ data, error }) => {
        if (error) {
          setError(error.message);
        } else if (!data || data.length === 0) {
          // DB empty — seed mock data then use it
          await seedConflicts();
          setConflicts(mockConflicts);
        } else {
          setConflicts(data.map(mapRow));
        }
        setLoading(false);
      });

    const channel = supabase
      .channel('conflicts-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'conflicts' }, payload => {
        if (payload.eventType === 'INSERT') {
          setConflicts(prev => [...prev, mapRow(payload.new as Record<string, unknown>)]);
        }
        if (payload.eventType === 'UPDATE') {
          const updated = payload.new as Record<string, unknown>;
          if (updated.resolved) {
            setConflicts(prev => prev.filter(c => c.id !== updated.id));
          } else {
            setConflicts(prev => prev.map(c => c.id === updated.id ? mapRow(updated) : c));
          }
        }
        if (payload.eventType === 'DELETE') {
          setConflicts(prev => prev.filter(c => c.id !== (payload.old as { id: string }).id));
        }
      })
      .subscribe();

    return () => { supabase!.removeChannel(channel); };
  }, []);

  return { conflicts, loading, error };
}
