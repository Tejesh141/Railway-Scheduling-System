import { useState } from 'react';
import { Conflict } from '../../types';
import { AlertTriangle, Clock, CheckCircle, Eye, Loader2, Wifi, WifiOff } from 'lucide-react';
import { supabase, supabaseReady } from '../../lib/supabaseClient';

interface ConflictAlertsProps {
  conflicts: Conflict[];
  loading?: boolean;
  error?: string | null;
}

export default function ConflictAlerts({ conflicts, loading, error }: ConflictAlertsProps) {
  const [resolving, setResolving] = useState<string | null>(null);
  const [resolved, setResolved]   = useState<string[]>([]);
  const [selected, setSelected]   = useState<Conflict | null>(null);

  const handleAutoResolve = async (conflict: Conflict) => {
    setResolving(conflict.id);
    if (supabaseReady && supabase) {
      await supabase.from('conflicts').update({ resolved: true, updated_at: new Date() }).eq('id', conflict.id);
    }
    setResolved(prev => [...prev, conflict.id]);
    setResolving(null);
  };

  const visible = conflicts.filter(c => !resolved.includes(c.id));

  return (
    <div className="card-hover bg-white rounded-2xl border border-[#E2E0D8] shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-[#F0EFE9] flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Conflict Alerts</h2>
          <p className="text-xs text-gray-400 mt-0.5">{visible.length} potential conflicts</p>
        </div>
        {supabaseReady ? (
          <div className="flex items-center space-x-1.5 text-xs px-2.5 py-1 rounded-full border" style={{ color: '#1A1A2E', background: '#F5F4EF', borderColor: '#E2E0D8' }}>
            <Wifi className="w-3 h-3" /><span>Live</span>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#C9A84C' }} />
          </div>
        ) : (
          <div className="flex items-center space-x-1.5 text-xs px-2.5 py-1 rounded-full border" style={{ color: '#6B6B7B', background: '#F5F4EF', borderColor: '#E2E0D8' }}>
            <WifiOff className="w-3 h-3" /><span>Mock</span>
          </div>
        )}
      </div>

      <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-5 h-5 animate-spin" style={{ color: '#6B6B7B' }} />
          </div>
        ) : error ? (
          <p className="text-xs text-center py-6" style={{ color: '#6B6B7B' }}>{error}</p>
        ) : visible.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="w-8 h-8 mx-auto mb-2" style={{ color: '#E2E0D8' }} />
            <p className="text-sm" style={{ color: '#6B6B7B' }}>No active conflicts</p>
          </div>
        ) : (
          visible.map(conflict => (
            <div key={conflict.id} className="border rounded-xl p-4 transition-all duration-200" style={{ background: '#FAFAF8', borderColor: '#E2E0D8' }}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4" style={{ color: conflict.severity === 'Critical' ? '#1A1A2E' : '#6B6B7B' }} />
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full border" style={{
                    background: conflict.severity === 'Critical' ? '#1A1A2E' : '#F5F4EF',
                    color:      conflict.severity === 'Critical' ? '#C9A84C'  : '#6B6B7B',
                    borderColor: '#E2E0D8'
                  }}>{conflict.severity}</span>
                </div>
                <div className="flex items-center space-x-1 text-xs" style={{ color: '#6B6B7B' }}>
                  <Clock className="w-3 h-3" />
                  <span className="font-semibold">{conflict.timeToConflict} min</span>
                </div>
              </div>

              <p className="text-xs mb-3 leading-relaxed" style={{ color: '#6B6B7B' }}>
                <span className="font-semibold" style={{ color: '#1A1A2E' }}>{conflict.trainName1}</span>
                {' vs '}
                <span className="font-semibold" style={{ color: '#1A1A2E' }}>{conflict.trainName2}</span>
                {' near '}
                <span className="font-semibold" style={{ color: '#1A1A2E' }}>{conflict.location}</span>
              </p>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelected(selected?.id === conflict.id ? null : conflict)}
                  className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all active:scale-95"
                  style={{ background: '#FFFFFF', borderColor: '#E2E0D8', color: '#1A1A2E' }}
                >
                  <Eye className="w-3 h-3" /><span>Details</span>
                </button>
                <button
                  onClick={() => handleAutoResolve(conflict)}
                  disabled={resolving === conflict.id}
                  className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all active:scale-95 disabled:opacity-50"
                  style={{ background: '#1A1A2E', color: '#C9A84C' }}
                >
                  {resolving === conflict.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
                  <span>{resolving === conflict.id ? 'Resolving...' : 'Auto-Resolve'}</span>
                </button>
              </div>

              {selected?.id === conflict.id && (
                <div className="mt-3 rounded-xl p-3 space-y-1.5 border" style={{ background: '#FFFFFF', borderColor: '#E2E0D8' }}>
                  {[
                    ['Conflict ID', conflict.id],
                    ['Train 1', `${conflict.trainId1} — ${conflict.trainName1}`],
                    ['Train 2', `${conflict.trainId2} — ${conflict.trainName2}`],
                    ['Location', conflict.location],
                    ['Time to Conflict', `${conflict.timeToConflict} min`],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between text-xs">
                      <span style={{ color: '#6B6B7B' }}>{label}</span>
                      <span className="font-medium" style={{ color: '#1A1A2E' }}>{value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
