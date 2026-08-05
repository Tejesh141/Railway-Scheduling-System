import { useEffect, useState } from 'react';
import { supabase, supabaseReady } from '../lib/supabaseClient';
import { Train } from '../types';
import { mockTrains } from '../data/mockData';

function mapRow(row: Record<string, unknown>): Train {
  return {
    id: row.id as string,
    name: row.name as string,
    type: row.type as Train['type'],
    currentStation: row.current_station as string,
    nextStation: row.next_station as string,
    delay: row.delay as number,
    priority: row.priority as Train['priority'],
    status: row.status as Train['status'],
    speed: row.speed as number,
    route: row.route as string[],
    position: { x: 0, y: 0 },
    gps: { lat: row.gps_lat as number, lng: row.gps_lng as number },
    heading: row.heading as number,
    routeIndex: row.route_index as number,
    segmentProgress: row.segment_progress as number,
    gpsRoute: [],
  };
}

async function seedTrains() {
  if (!supabase) return;
  const rows = mockTrains.map(t => ({
    id: t.id,
    name: t.name,
    type: t.type,
    current_station: t.currentStation,
    next_station: t.nextStation,
    delay: t.delay,
    priority: t.priority,
    status: t.status,
    speed: t.speed,
    route: t.route,
    gps_lat: t.gps.lat,
    gps_lng: t.gps.lng,
    heading: t.heading,
    route_index: t.routeIndex,
    segment_progress: t.segmentProgress,
  }));
  await supabase.from('trains').upsert(rows, { onConflict: 'id' });
}

export function useTrains() {
  const [trains, setTrains] = useState<Train[]>(mockTrains);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabaseReady || !supabase) {
      setLoading(false);
      return;
    }

    supabase
      .from('trains')
      .select('*')
      .order('id')
      .then(async ({ data, error }) => {
        if (error) {
          setError(error.message);
        } else if (!data || data.length === 0) {
          await seedTrains();
          setTrains(mockTrains);
        } else {
          setTrains(data.map(mapRow));
        }
        setLoading(false);
      });

    const channel = supabase
      .channel('trains-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'trains' }, payload => {
        if (payload.eventType === 'UPDATE' || payload.eventType === 'INSERT') {
          const updated = mapRow(payload.new as Record<string, unknown>);
          setTrains(prev => {
            const exists = prev.find(t => t.id === updated.id);
            return exists ? prev.map(t => t.id === updated.id ? updated : t) : [...prev, updated];
          });
        }
        if (payload.eventType === 'DELETE') {
          setTrains(prev => prev.filter(t => t.id !== (payload.old as { id: string }).id));
        }
      })
      .subscribe();

    return () => { supabase!.removeChannel(channel); };
  }, []);

  return { trains, loading, error };
}
