import { Train } from '../../types';
import { Train as TrainIcon, Loader2, Wifi, WifiOff } from 'lucide-react';
import { supabaseReady } from '../../lib/supabaseClient';

interface LiveTrainStatusProps {
  trains: Train[];
  loading?: boolean;
  error?: string | null;
}

export default function LiveTrainStatus({ trains, loading, error }: LiveTrainStatusProps) {
  const getStatusDot = (status: string) => {
    if (status === 'Running')        return { bg: '#1A1A2E', opacity: 1 };
    if (status === 'Emergency Stop') return { bg: '#1A1A2E', opacity: 0.9 };
    return { bg: '#6B6B7B', opacity: 0.5 };
  };

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ background: '#FFFFFF', borderColor: '#E2E0D8' }}>
      <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: '#E2E0D8', background: '#F5F4EF' }}>
        <div>
          <h2 className="text-base font-semibold" style={{ color: '#1A1A2E' }}>Live Train Status</h2>
          <p className="text-sm mt-0.5" style={{ color: '#6B6B7B' }}>{trains.length} trains in section</p>
        </div>
        <div className="flex items-center space-x-2">
          {loading ? (
            <div className="flex items-center space-x-2 text-xs" style={{ color: '#6B6B7B' }}>
          <Loader2 size={13} strokeWidth={1.8} style={{ color: '#6B6B7B' }} /><span>Loading...</span>
            </div>
          ) : error ? (
            <div className="flex items-center space-x-2 text-xs px-3 py-1 rounded-full border" style={{ color: '#1A1A2E', background: '#F5F4EF', borderColor: '#E2E0D8' }}>
              <WifiOff size={13} strokeWidth={1.8} /><span>DB error</span>
            </div>
          ) : supabaseReady ? (
            <div className="flex items-center space-x-2 text-xs px-3 py-1 rounded-full border" style={{ color: '#1A1A2E', background: '#F5F4EF', borderColor: '#E2E0D8' }}>
              <Wifi size={13} strokeWidth={1.8} /><span>Live</span>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#C9A84C' }} />
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-xs px-3 py-1 rounded-full border" style={{ color: '#6B6B7B', background: '#F5F4EF', borderColor: '#E2E0D8' }}>
              <WifiOff size={13} strokeWidth={1.8} /><span>Mock</span>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 size={28} strokeWidth={1.8} className="animate-spin" style={{ color: '#C9A84C' }} />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ background: '#F5F4EF' }}>
                {['Train ID', 'Train Name', 'Type', 'Current Station', 'Next Station', 'Delay', 'Priority', 'Status'].map(h => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider" style={{ color: '#6B6B7B' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trains.map((train, i) => (
                <tr key={train.id} style={{ borderTop: '1px solid #F0EFE9', background: i % 2 === 0 ? '#FFFFFF' : '#FAFAF8' }}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-mono font-semibold" style={{ color: '#C9A84C' }}>{train.id}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium" style={{ color: '#1A1A2E' }}>{train.name}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full border" style={{ background: '#F5F4EF', color: '#1A1A2E', borderColor: '#E2E0D8' }}>{train.type}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#6B6B7B' }}>{train.currentStation}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm" style={{ color: '#6B6B7B' }}>{train.nextStation}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-semibold" style={{ color: train.delay > 0 ? '#1A1A2E' : '#6B6B7B' }}>
                      {train.delay > 0 ? `+${train.delay} min` : 'On time'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs font-medium rounded-full border" style={{
                      background: train.priority === 'High' ? '#1A1A2E' : '#F5F4EF',
                      color:      train.priority === 'High' ? '#C9A84C'  : '#6B6B7B',
                      borderColor: '#E2E0D8'
                    }}>{train.priority}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <TrainIcon size={13} strokeWidth={1.8} style={{ color: getStatusDot(train.status).bg, opacity: getStatusDot(train.status).opacity }} />
                      <span className="text-sm" style={{ color: '#1A1A2E' }}>{train.status}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
