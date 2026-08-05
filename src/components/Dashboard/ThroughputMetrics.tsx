import { Metrics } from '../../types';
import { Clock, TrendingUp, Activity, Target } from 'lucide-react';

interface ThroughputMetricsProps {
  metrics: Metrics;
}

export default function ThroughputMetrics({ metrics }: ThroughputMetricsProps) {
  const metricCards = [
    { label: 'Average Delay',       value: `${metrics.averageDelay}`,       unit: 'min', icon: <Clock className="w-5 h-5" />,     trend: -12 },
    { label: 'Trains Per Hour',     value: `${metrics.trainsPerHour}`,      unit: '',    icon: <TrendingUp className="w-5 h-5" />,  trend: 8  },
    { label: 'Track Utilization',   value: `${metrics.trackUtilization}`,   unit: '%',   icon: <Activity className="w-5 h-5" />,   trend: 5  },
    { label: 'On-Time Performance', value: `${metrics.onTimePerformance}`,  unit: '%',   icon: <Target className="w-5 h-5" />,     trend: 3  },
  ];

  return (
    <div className="rounded-2xl border overflow-hidden" style={{ background: '#FFFFFF', borderColor: '#E2E0D8' }}>
      <div className="px-6 py-4 border-b" style={{ borderColor: '#E2E0D8', background: '#F5F4EF' }}>
        <h2 className="text-base font-semibold" style={{ color: '#1A1A2E' }}>Section Throughput Metrics</h2>
        <p className="text-sm mt-0.5" style={{ color: '#6B6B7B' }}>Real-time performance indicators</p>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metricCards.map((metric, index) => (
            <div key={index} className="card-hover rounded-xl p-5 border" style={{ background: '#FAFAF8', borderColor: '#E2E0D8' }}>
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#1A1A2E' }}>
                  <div style={{ color: '#C9A84C' }}>{metric.icon}</div>
                </div>
                <span className="text-xs font-semibold" style={{ color: metric.trend > 0 ? '#1A1A2E' : '#6B6B7B' }}>
                  {metric.trend > 0 ? '+' : ''}{metric.trend}%
                </span>
              </div>
              <div className="mb-1">
                <span className="text-3xl font-bold" style={{ color: '#1A1A2E' }}>{metric.value}</span>
                {metric.unit && <span className="text-base ml-1" style={{ color: '#6B6B7B' }}>{metric.unit}</span>}
              </div>
              <div className="text-sm" style={{ color: '#6B6B7B' }}>{metric.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="rounded-xl p-5 border" style={{ background: '#FAFAF8', borderColor: '#E2E0D8' }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: '#1A1A2E' }}>Hourly Throughput</h3>
            <div className="space-y-2">
              {[
                { hour: '08:00', trains: 22, width: 90 },
                { hour: '09:00', trains: 18, width: 75 },
                { hour: '10:00', trains: 20, width: 82 },
                { hour: '11:00', trains: 16, width: 65 },
                { hour: '12:00', trains: 19, width: 78 },
              ].map((item) => (
                <div key={item.hour} className="flex items-center space-x-3">
                  <span className="text-xs w-12 font-mono" style={{ color: '#6B6B7B' }}>{item.hour}</span>
                  <div className="flex-1 rounded-full h-5 overflow-hidden" style={{ background: '#F0EFE9' }}>
                    <div className="h-full rounded-full flex items-center justify-end px-2" style={{ width: `${item.width}%`, background: '#1A1A2E' }}>
                      <span className="text-xs font-semibold" style={{ color: '#C9A84C' }}>{item.trains}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl p-5 border" style={{ background: '#FAFAF8', borderColor: '#E2E0D8' }}>
            <h3 className="text-sm font-semibold mb-4" style={{ color: '#1A1A2E' }}>Delay Distribution</h3>
            <div className="space-y-2">
              {[
                { range: 'On Time',  count: 65, opacity: 1    },
                { range: '1-5 min',  count: 20, opacity: 0.7  },
                { range: '6-15 min', count: 10, opacity: 0.45 },
                { range: '15+ min',  count: 5,  opacity: 0.25 },
              ].map((item) => (
                <div key={item.range} className="flex items-center space-x-3">
                  <span className="text-xs w-20" style={{ color: '#6B6B7B' }}>{item.range}</span>
                  <div className="flex-1 rounded-full h-5 overflow-hidden" style={{ background: '#F0EFE9' }}>
                    <div className="h-full rounded-full flex items-center justify-end px-2" style={{ width: `${item.count}%`, background: `rgba(26,26,46,${item.opacity})` }}>
                      <span className="text-xs font-semibold" style={{ color: '#C9A84C' }}>{item.count}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
