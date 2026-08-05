import { useState } from 'react';
import { BrainCircuit, TrendingDown, Check, X, Loader2, Wifi, WifiOff, Filter, Clock, Train, RefreshCw, History } from 'lucide-react';
import { Recommendation } from '../../types';
import { supabase, supabaseReady } from '../../lib/supabaseClient';
import { useRecommendations } from '../../hooks/useRecommendations';

type ActionStatus = 'accepted' | 'overridden';
type FilterType = 'All' | 'Accepted' | 'Overridden' | 'Pending';

export default function AIRecommendationsPage() {
  const { recommendations, loading, error } = useRecommendations();
  const [statuses, setStatuses] = useState<Record<string, ActionStatus>>({});
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
  const [history, setHistory] = useState<(Recommendation & { status: ActionStatus; actedAt: Date })[]>([]);
  const [filter, setFilter] = useState<FilterType>('All');
  const [refreshing, setRefreshing] = useState(false);

  const handleAction = async (rec: Recommendation, action: ActionStatus) => {
    setActionLoading(prev => ({ ...prev, [rec.id]: true }));
    if (supabaseReady && supabase) {
      await supabase.from('ai_instructions').insert({
        train_id: rec.trainId, train_name: rec.trainName,
        action: rec.action, explanation: rec.explanation,
        delay_reduction: rec.delayReduction, status: action,
      });
      await supabase.from('ai_recommendations').update({ status: action }).eq('id', rec.id);
    }
    setStatuses(prev => ({ ...prev, [rec.id]: action }));
    setHistory(prev => [...prev, { ...rec, status: action, actedAt: new Date() }]);
    setActionLoading(prev => ({ ...prev, [rec.id]: false }));
  };

  const pending       = recommendations.filter(r => !statuses[r.id]);
  const accepted      = history.filter(h => h.status === 'accepted');
  const overridden    = history.filter(h => h.status === 'overridden');
  const totalDelaySaved = accepted.reduce((sum, r) => sum + r.delayReduction, 0);

  const filtered = filter === 'All'       ? recommendations
    : filter === 'Pending'    ? pending
    : filter === 'Accepted'   ? recommendations.filter(r => statuses[r.id] === 'accepted')
    : recommendations.filter(r => statuses[r.id] === 'overridden');

  const timeAgo = (date: Date) => {
    const s = Math.floor((Date.now() - date.getTime()) / 1000);
    if (s < 60) return `${s}s ago`;
    return `${Math.floor(s / 60)}m ago`;
  };

  return (
    <div className="p-6 space-y-5 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#1A1A2E' }}>AI Recommendations</h1>
          <p className="text-sm mt-0.5" style={{ color: '#6B6B7B' }}>Machine learning-powered traffic optimization suggestions</p>
        </div>
        <div className="flex items-center space-x-3">
          {supabaseReady ? (
            <div className="flex items-center space-x-2 text-xs px-3 py-1.5 rounded-full border" style={{ color: '#1A1A2E', background: '#F5F4EF', borderColor: '#E2E0D8' }}>
          <Wifi size={13} strokeWidth={1.8} /><span>Live from Supabase</span>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#C9A84C' }} />
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-xs px-3 py-1.5 rounded-full border" style={{ color: '#6B6B7B', background: '#F5F4EF', borderColor: '#E2E0D8' }}>
          <WifiOff size={13} strokeWidth={1.8} /><span>Mock data</span>
            </div>
          )}
          <button
            onClick={() => { setRefreshing(true); setTimeout(() => setRefreshing(false), 800); }}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-xl transition-colors"
            style={{ background: '#1A1A2E', color: '#C9A84C' }}
          >
            <RefreshCw size={15} strokeWidth={1.8} className={refreshing ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Suggestions', value: recommendations.length },
          { label: 'Pending',           value: pending.length,          dim: true },
          { label: 'Accepted',          value: accepted.length },
          { label: 'Delay Saved',       value: `${totalDelaySaved} min`, gold: true },
        ].map(card => (
          <div key={card.label} className="rounded-2xl border p-4" style={{ background: '#FFFFFF', borderColor: '#E2E0D8' }}>
            <p className="text-xs mb-1" style={{ color: '#6B6B7B' }}>{card.label}</p>
            <p className="text-3xl font-bold" style={{ color: card.gold ? '#C9A84C' : card.dim ? '#6B6B7B' : '#1A1A2E' }}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2">
        <Filter size={15} strokeWidth={1.8} style={{ color: '#9B9BAB' }} />
        {(['All', 'Pending', 'Accepted', 'Overridden'] as FilterType[]).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-colors border"
            style={filter === f
              ? { background: '#1A1A2E', borderColor: '#1A1A2E', color: '#C9A84C' }
              : { background: '#FFFFFF', borderColor: '#E2E0D8', color: '#6B6B7B' }
            }>
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recommendations List */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 size={28} strokeWidth={1.8} className="animate-spin" style={{ color: '#6B6B7B' }} />
            </div>
          ) : error ? (
            <div className="text-center py-10 text-sm" style={{ color: '#6B6B7B' }}>{error}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 rounded-2xl border" style={{ background: '#FFFFFF', borderColor: '#E2E0D8' }}>
              <BrainCircuit size={42} strokeWidth={1.8} className="mx-auto mb-3" style={{ color: '#E2E0D8' }} />
              <p style={{ color: '#6B6B7B' }}>No {filter.toLowerCase()} recommendations</p>
            </div>
          ) : (
            filtered.map(rec => {
              const status = statuses[rec.id];
              const isLoading = actionLoading[rec.id];
              return (
                <div key={rec.id} className="rounded-2xl border-2 p-5 transition-all"
                  style={{
                    background: status ? '#FAFAF8' : '#FFFFFF',
                    borderColor: status === 'accepted' ? '#1A1A2E' : status === 'overridden' ? '#E2E0D8' : '#E2E0D8',
                  }}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <Train size={13} strokeWidth={1.8} style={{ color: '#C9A84C' }} />
                        <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#1A1A2E' }}>Train {rec.trainId}</span>
                        <span style={{ color: '#E2E0D8' }}>•</span>
                        <span className="text-xs" style={{ color: '#6B6B7B' }}>{rec.trainName}</span>
                      </div>
                      <h3 className="text-sm font-semibold" style={{ color: '#1A1A2E' }}>{rec.action}</h3>
                    </div>
                    {rec.delayReduction > 0 && (
                      <div className="flex items-center space-x-1 px-3 py-1 rounded-full border flex-shrink-0"
                        style={{ background: '#F5F4EF', borderColor: '#E2E0D8' }}>
                        <TrendingDown size={14} strokeWidth={1.8} style={{ color: '#C9A84C' }} />
                        <span className="text-xs font-semibold" style={{ color: '#1A1A2E' }}>-{rec.delayReduction} min</span>
                      </div>
                    )}
                  </div>

                  <div className="rounded-xl border p-3 mb-3" style={{ background: '#F5F4EF', borderColor: '#E2E0D8' }}>
                    <p className="text-xs font-semibold mb-1" style={{ color: '#C9A84C' }}>AI Reasoning</p>
                    <p className="text-xs leading-relaxed" style={{ color: '#6B6B7B' }}>{rec.explanation}</p>
                  </div>

                  <div className="flex items-center space-x-1 text-xs mb-4" style={{ color: '#9B9BAB' }}>
                    <Clock size={13} strokeWidth={1.8} />
                    <span>Generated {timeAgo(rec.timestamp)}</span>
                  </div>

                  {status ? (
                    <div className="text-xs font-semibold px-3 py-2 rounded-xl inline-flex items-center space-x-2 border"
                      style={{
                        background: '#F5F4EF', borderColor: '#E2E0D8',
                        color: status === 'accepted' ? '#1A1A2E' : '#6B6B7B',
                      }}>
                      {status === 'accepted' ? <Check size={14} strokeWidth={1.8} /> : <X size={14} strokeWidth={1.8} />}
                      <span>{status === 'accepted' ? 'Accepted & Saved' : 'Overridden & Saved'}</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-3">
                      <button onClick={() => handleAction(rec, 'accepted')} disabled={isLoading}
                        className="flex items-center space-x-2 px-4 py-2 text-xs font-medium rounded-xl transition-colors disabled:opacity-50"
                        style={{ background: '#1A1A2E', color: '#C9A84C' }}>
                        <Check size={14} strokeWidth={1.8} />
                        <span>{isLoading ? 'Saving...' : 'Accept'}</span>
                      </button>
                      <button onClick={() => handleAction(rec, 'overridden')} disabled={isLoading}
                        className="flex items-center space-x-2 px-4 py-2 text-xs font-medium rounded-xl transition-colors disabled:opacity-50 border"
                        style={{ background: '#FFFFFF', borderColor: '#E2E0D8', color: '#6B6B7B' }}>
                        <X size={14} strokeWidth={1.8} />
                        <span>{isLoading ? 'Saving...' : 'Override'}</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Right Panel */}
        <div className="space-y-4">
          <div className="rounded-2xl border p-5" style={{ background: '#FFFFFF', borderColor: '#E2E0D8' }}>
            <h3 className="text-sm font-semibold mb-4 flex items-center space-x-2" style={{ color: '#1A1A2E' }}>
              <BrainCircuit size={15} strokeWidth={1.8} style={{ color: '#C9A84C' }} />
              <span>AI Performance</span>
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Acceptance Rate', value: history.length > 0 ? `${Math.round((accepted.length / history.length) * 100)}%` : '—' },
                { label: 'Total Delay Saved', value: `${totalDelaySaved} min`, gold: true },
                { label: 'Overridden',        value: overridden.length,        dim: true },
                { label: 'Pending Actions',   value: pending.length },
              ].map(stat => (
                <div key={stat.label} className="flex items-center justify-between pb-2 border-b" style={{ borderColor: '#F0EFE9' }}>
                  <span className="text-xs" style={{ color: '#6B6B7B' }}>{stat.label}</span>
                  <span className="text-sm font-bold" style={{ color: stat.gold ? '#C9A84C' : stat.dim ? '#9B9BAB' : '#1A1A2E' }}>{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border p-5" style={{ background: '#FFFFFF', borderColor: '#E2E0D8' }}>
            <h3 className="text-sm font-semibold mb-4 flex items-center space-x-2" style={{ color: '#1A1A2E' }}>
              <History size={15} strokeWidth={1.8} style={{ color: '#9B9BAB' }} />
              <span>Action History</span>
            </h3>
            {history.length === 0 ? (
              <p className="text-xs text-center py-4" style={{ color: '#9B9BAB' }}>No actions taken yet</p>
            ) : (
              <div className="space-y-3">
                {[...history].reverse().map((h, i) => (
                  <div key={i} className="flex items-start space-x-2">
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0"
                      style={{ background: h.status === 'accepted' ? '#1A1A2E' : '#9B9BAB' }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs truncate" style={{ color: '#1A1A2E' }}>Train {h.trainId} — {h.action}</p>
                      <div className="flex items-center space-x-2 mt-0.5">
                        <span className="text-xs font-medium" style={{ color: h.status === 'accepted' ? '#1A1A2E' : '#6B6B7B' }}>
                          {h.status === 'accepted' ? 'Accepted' : 'Overridden'}
                        </span>
                        <span className="text-xs" style={{ color: '#9B9BAB' }}>{timeAgo(h.actedAt)}</span>
                      </div>
                    </div>
                    {h.delayReduction > 0 && (
                      <span className="text-xs flex-shrink-0 font-semibold" style={{ color: '#C9A84C' }}>-{h.delayReduction}m</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
