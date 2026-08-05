import { useState } from 'react';
import { AlertTriangle, Clock, CheckCircle, Eye, Loader2, Wifi, WifiOff } from 'lucide-react';
import { useConflicts } from '../../hooks/useConflicts';
import { supabase, supabaseReady } from '../../lib/supabaseClient';
import { Conflict } from '../../types';

const SEV: Record<string, { badge: React.CSSProperties; dot: string }> = {
  Critical: { badge: { background: '#1A1A2E', color: '#C9A84C', border: '1px solid #1A1A2E' }, dot: '#1A1A2E' },
  Warning:  { badge: { background: '#F5F4EF', color: '#6B6B7B', border: '1px solid #E2E0D8' }, dot: '#6B6B7B' },
  Minor:    { badge: { background: '#F5F4EF', color: '#9B9BAB', border: '1px solid #E2E0D8' }, dot: '#9B9BAB' },
};

export default function ConflictPredictionsPage() {
  const { conflicts, loading, error } = useConflicts();
  const [resolving, setResolving] = useState<string | null>(null);
  const [resolved, setResolved] = useState<string[]>([]);
  const [selected, setSelected] = useState<Conflict | null>(null);

  const handleAutoResolve = async (conflict: Conflict) => {
    setResolving(conflict.id);
    if (supabaseReady && supabase) {
      await supabase.from('conflicts').update({ resolved: true }).eq('id', conflict.id);
    }
    setResolved(prev => [...prev, conflict.id]);
    setResolving(null);
  };

  const visible = conflicts.filter(c => !resolved.includes(c.id));
  const critical = visible.filter(c => c.severity === 'Critical').length;
  const warning  = visible.filter(c => c.severity === 'Warning').length;

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <Loader2 className="w-6 h-6 animate-spin" style={{ color: '#6B6B7B' }} />
    </div>
  );

  if (error) return (
    <div className="p-6">
      <div className="rounded-xl border px-4 py-3 text-sm" style={{ background: '#FAFAF8', borderColor: '#E2E0D8', color: '#6B6B7B' }}>
        Error: {error}
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#1A1A2E' }}>Conflict Predictions</h1>
          <p className="text-sm mt-0.5" style={{ color: '#6B6B7B' }}>AI-detected track conflicts requiring attention</p>
        </div>
        {supabaseReady ? (
          <div className="flex items-center space-x-1.5 text-xs px-3 py-1.5 rounded-full border" style={{ color: '#1A1A2E', background: '#F5F4EF', borderColor: '#E2E0D8' }}>
            <Wifi className="w-3 h-3" /><span>Live</span>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#C9A84C' }} />
          </div>
        ) : (
          <div className="flex items-center space-x-1.5 text-xs px-3 py-1.5 rounded-full border" style={{ color: '#6B6B7B', background: '#F5F4EF', borderColor: '#E2E0D8' }}>
            <WifiOff className="w-3 h-3" /><span>Mock</span>
          </div>
        )}
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Active',   value: visible.length },
          { label: 'Critical',       value: critical,       style: { color: '#1A1A2E' } },
          { label: 'Warning',        value: warning,        style: { color: '#6B6B7B' } },
        ].map(s => (
          <div key={s.label} className="rounded-2xl border p-4" style={{ background: '#FFFFFF', borderColor: '#E2E0D8' }}>
            <p className="text-xs mb-1" style={{ color: '#6B6B7B' }}>{s.label}</p>
            <p className="text-3xl font-bold" style={s.style ?? { color: '#1A1A2E' }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Conflict list */}
      {visible.length === 0 ? (
        <div className="rounded-2xl border p-16 text-center" style={{ background: '#FFFFFF', borderColor: '#E2E0D8' }}>
          <CheckCircle className="w-10 h-10 mx-auto mb-3" style={{ color: '#E2E0D8' }} />
          <p className="text-sm font-medium" style={{ color: '#1A1A2E' }}>No active conflicts</p>
          <p className="text-xs mt-1" style={{ color: '#6B6B7B' }}>All sections are clear</p>
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map(c => {
            const sev = SEV[c.severity] ?? SEV.Minor;
            return (
              <div key={c.id} className="rounded-2xl border p-5 transition-all" style={{ background: '#FFFFFF', borderColor: '#E2E0D8' }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4" style={{ color: sev.dot }} />
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={sev.badge}>{c.severity}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-xs" style={{ color: '#6B6B7B' }}>
                    <Clock className="w-3 h-3" />
                    <span className="font-semibold">{c.timeToConflict} min</span>
                  </div>
                </div>

                <p className="text-sm mb-1" style={{ color: '#6B6B7B' }}>
                  <span className="font-semibold" style={{ color: '#1A1A2E' }}>{c.trainName1}</span>
                  {' ↔ '}
                  <span className="font-semibold" style={{ color: '#1A1A2E' }}>{c.trainName2}</span>
                </p>
                <p className="text-xs mb-4" style={{ color: '#9B9BAB' }}>Near <span style={{ color: '#6B6B7B', fontWeight: 600 }}>{c.location}</span></p>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelected(selected?.id === c.id ? null : c)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all"
                    style={{ background: '#FFFFFF', borderColor: '#E2E0D8', color: '#1A1A2E' }}
                  >
                    <Eye className="w-3 h-3" /><span>Details</span>
                  </button>
                  <button
                    onClick={() => handleAutoResolve(c)}
                    disabled={resolving === c.id}
                    className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all disabled:opacity-50"
                    style={{ background: '#1A1A2E', color: '#C9A84C' }}
                  >
                    {resolving === c.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
                    <span>{resolving === c.id ? 'Resolving...' : 'Auto-Resolve'}</span>
                  </button>
                </div>

                {selected?.id === c.id && (
                  <div className="mt-4 rounded-xl border p-4 space-y-2" style={{ background: '#FAFAF8', borderColor: '#E2E0D8' }}>
                    {[
                      ['Conflict ID', c.id],
                      ['Train 1', `${c.trainId1} — ${c.trainName1}`],
                      ['Train 2', `${c.trainId2} — ${c.trainName2}`],
                      ['Location', c.location],
                      ['Time to Conflict', `${c.timeToConflict} min`],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between text-xs">
                        <span style={{ color: '#6B6B7B' }}>{label}</span>
                        <span className="font-medium" style={{ color: '#1A1A2E' }}>{value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
