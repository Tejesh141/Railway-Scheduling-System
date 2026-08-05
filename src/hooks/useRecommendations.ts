import { useEffect, useState } from 'react';
import { supabase, supabaseReady } from '../lib/supabaseClient';
import { Recommendation } from '../types';
import { mockRecommendations } from '../data/mockData';

function mapRow(row: Record<string, unknown>): Recommendation {
  return {
    id: row.id as string,
    trainId: row.train_id as string,
    trainName: row.train_name as string,
    action: row.action as string,
    explanation: row.explanation as string,
    delayReduction: row.delay_reduction as number,
    timestamp: new Date(row.created_at as string),
  };
}

async function seedRecommendations() {
  if (!supabase) return;
  const rows = mockRecommendations.map(r => ({
    train_id: r.trainId,
    train_name: r.trainName,
    action: r.action,
    explanation: r.explanation,
    delay_reduction: r.delayReduction,
    status: 'pending',
  }));
  await supabase.from('ai_recommendations').insert(rows);
}

export function useRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>(mockRecommendations);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabaseReady || !supabase) {
      setLoading(false);
      return;
    }

    supabase
      .from('ai_recommendations')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .then(async ({ data, error }) => {
        if (error) {
          setError(error.message);
        } else if (!data || data.length === 0) {
          // DB empty — seed mock data then use it
          await seedRecommendations();
          setRecommendations(mockRecommendations);
        } else {
          setRecommendations(data.map(mapRow));
        }
        setLoading(false);
      });

    const channel = supabase
      .channel('recommendations-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ai_recommendations' }, payload => {
        if (payload.eventType === 'INSERT') {
          setRecommendations(prev => [mapRow(payload.new as Record<string, unknown>), ...prev]);
        }
        if (payload.eventType === 'UPDATE') {
          const updated = payload.new as Record<string, unknown>;
          if (updated.status !== 'pending') {
            setRecommendations(prev => prev.filter(r => r.id !== updated.id));
          }
        }
        if (payload.eventType === 'DELETE') {
          setRecommendations(prev => prev.filter(r => r.id !== (payload.old as { id: string }).id));
        }
      })
      .subscribe();

    return () => { supabase!.removeChannel(channel); };
  }, []);

  return { recommendations, loading, error };
}
