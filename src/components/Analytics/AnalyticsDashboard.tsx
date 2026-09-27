import { BarChart3, TrendingUp, Activity, Clock } from 'lucide-react';

const C = { dark: '#1A1A2E', gold: '#C9A84C', muted: '#6B6B7B', bg: '#F5F4EF', card: '#FFFFFF', border: '#E2E0D8', soft: '#F0EFE9' };

export default function AnalyticsDashboard() {
  const summaryCards = [
    { label: 'Avg Delay',        value: '6.5 min', icon: Clock,      trend: '-5%'  },
    { label: 'Trains Processed', value: '432',     icon: TrendingUp, trend: '+12%' },
    { label: 'Track Utilization',value: '73%',     icon: Activity,   trend: '+3%'  },
    { label: 'On-Time',          value: '82%',     icon: BarChart3,  trend: '+8%'  },
  ];

  const routeEfficiency = [
    { route: 'Chennai – Bangalore', trains: 148, efficiency: 91 },
    { route: 'Chennai – Coimbatore', trains: 112, efficiency: 84 },
    { route: 'Chennai – Trivandrum', trains: 96,  efficiency: 78 },
    { route: 'Chennai – Salem',      trains: 76,  efficiency: 88 },
  ];

  const conflictResolution = [
    { week: 'Week 1', total: 18, resolved: 16 },
    { week: 'Week 2', total: 22, resolved: 20 },
    { week: 'Week 3', total: 15, resolved: 15 },
    { week: 'Week 4', total: 25, resolved: 21 },
  ];

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: C.dark }}>Section Analytics</h1>
        <p className="text-sm mt-0.5" style={{ color: C.muted }}>Comprehensive performance metrics and insights</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map(card => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-2xl border p-5" style={{ background: C.card, borderColor: C.border }}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: C.dark }}>
                  <Icon className="w-4 h-4" style={{ color: C.gold }} />
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full border" style={{ color: C.dark, background: C.bg, borderColor: C.border }}>{card.trend}</span>
              </div>
              <p className="text-2xl font-bold" style={{ color: C.dark }}>{card.value}</p>
              <p className="text-xs mt-1" style={{ color: C.muted }}>{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Route Efficiency */}
        <div className="rounded-2xl border overflow-hidden" style={{ background: C.card, borderColor: C.border }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: C.border, background: C.bg }}>
            <h2 className="text-sm font-semibold" style={{ color: C.dark }}>Route Efficiency</h2>
            <p className="text-xs mt-0.5" style={{ color: C.muted }}>Trains run vs efficiency score per corridor</p>
          </div>
          <div className="p-5 space-y-4">
            {routeEfficiency.map(item => (
              <div key={item.route}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-medium" style={{ color: C.dark }}>{item.route}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs" style={{ color: C.muted }}>{item.trains} trains</span>
                    <span className="text-xs font-semibold" style={{ color: C.gold }}>{item.efficiency}%</span>
                  </div>
                </div>
                <div className="w-full rounded-full h-2" style={{ background: C.soft }}>
                  <div className="h-full rounded-full" style={{ width: `${item.efficiency}%`, background: C.dark }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Conflict Resolution Rate */}
        <div className="rounded-2xl border overflow-hidden" style={{ background: C.card, borderColor: C.border }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: C.border, background: C.bg }}>
            <h2 className="text-sm font-semibold" style={{ color: C.dark }}>Conflict Resolution Rate</h2>
            <p className="text-xs mt-0.5" style={{ color: C.muted }}>Weekly conflicts detected vs resolved</p>
          </div>
          <div className="p-5 space-y-4">
            {conflictResolution.map(item => {
              const rate = Math.round((item.resolved / item.total) * 100);
              return (
                <div key={item.week}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium" style={{ color: C.dark }}>{item.week}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs" style={{ color: C.muted }}>{item.resolved}/{item.total} resolved</span>
                      <span className="text-xs font-semibold" style={{ color: C.gold }}>{rate}%</span>
                    </div>
                  </div>
                  <div className="w-full rounded-full h-2 relative" style={{ background: C.soft }}>
                    <div className="h-full rounded-full" style={{ width: `${(item.total / 25) * 100}%`, background: C.soft, border: `1px solid ${C.border}` }} />
                    <div className="h-full rounded-full absolute top-0 left-0" style={{ width: `${rate}%`, background: C.dark }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Train Type Distribution */}
        <div className="rounded-2xl border overflow-hidden" style={{ background: C.card, borderColor: C.border }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: C.border, background: C.bg }}>
            <h2 className="text-sm font-semibold" style={{ color: C.dark }}>Train Type Distribution</h2>
          </div>
          <div className="p-5 space-y-4">
            {[
              { type: 'Express',   count: 245, percentage: 57, opacity: 1    },
              { type: 'Passenger', count: 132, percentage: 30, opacity: 0.55 },
              { type: 'Freight',   count: 55,  percentage: 13, opacity: 0.3  },
            ].map(item => (
              <div key={item.type}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs" style={{ color: C.muted }}>{item.type}</span>
                  <span className="text-xs font-semibold" style={{ color: C.dark }}>{item.count} <span style={{ color: C.muted }}>({item.percentage}%)</span></span>
                </div>
                <div className="w-full rounded-full h-2" style={{ background: C.soft }}>
                  <div className="h-full rounded-full" style={{ width: `${item.percentage}%`, background: `rgba(26,26,46,${item.opacity})` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Trend */}
        <div className="rounded-2xl border overflow-hidden" style={{ background: C.card, borderColor: C.border }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: C.border, background: C.bg }}>
            <h2 className="text-sm font-semibold" style={{ color: C.dark }}>Weekly Trend</h2>
          </div>
          <div className="p-4 space-y-1">
            {[
              { day: 'Monday',    trains: 428, change: +5  },
              { day: 'Tuesday',   trains: 445, change: +12 },
              { day: 'Wednesday', trains: 432, change: -8  },
              { day: 'Thursday',  trains: 458, change: +15 },
              { day: 'Friday',    trains: 412, change: -3  },
              { day: 'Saturday',  trains: 385, change: -18 },
              { day: 'Sunday',    trains: 352, change: -22 },
            ].map(item => (
              <div key={item.day} className="flex items-center justify-between px-3 py-2 rounded-lg" style={{ background: 'transparent' }}
                onMouseEnter={e => (e.currentTarget.style.background = C.bg)}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <span className="text-xs" style={{ color: C.muted }}>{item.day}</span>
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-semibold" style={{ color: C.dark }}>{item.trains}</span>
                  <span className="text-xs font-medium" style={{ color: item.change > 0 ? C.dark : C.muted }}>
                    {item.change > 0 ? '+' : ''}{item.change}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Score */}
        <div className="rounded-2xl border overflow-hidden" style={{ background: C.card, borderColor: C.border }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: C.border, background: C.bg }}>
            <h2 className="text-sm font-semibold" style={{ color: C.dark }}>Performance Score</h2>
          </div>
          <div className="p-5">
            <div className="text-center mb-5">
              <div className="relative inline-flex">
                <svg className="w-32 h-32 -rotate-90">
                  <circle cx="64" cy="64" r="54" stroke={C.soft} strokeWidth="10" fill="none" />
                  <circle cx="64" cy="64" r="54" stroke={C.dark} strokeWidth="10" fill="none"
                    strokeDasharray={`${2 * Math.PI * 54}`}
                    strokeDashoffset={`${2 * Math.PI * 54 * 0.15}`}
                    strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <div className="text-3xl font-bold" style={{ color: C.dark }}>85</div>
                  <div className="text-xs" style={{ color: C.muted }}>Score</div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {[
                { metric: 'Punctuality', score: 88 },
                { metric: 'Efficiency',  score: 82 },
                { metric: 'Safety',      score: 95 },
                { metric: 'Capacity',    score: 78 },
              ].map(item => (
                <div key={item.metric}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs" style={{ color: C.muted }}>{item.metric}</span>
                    <span className="text-xs font-semibold" style={{ color: C.dark }}>{item.score}/100</span>
                  </div>
                  <div className="w-full rounded-full h-1.5" style={{ background: C.soft }}>
                    <div className="h-full rounded-full" style={{ width: `${item.score}%`, background: C.dark }} />
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
