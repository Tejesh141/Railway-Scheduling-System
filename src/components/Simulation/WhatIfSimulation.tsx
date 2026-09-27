import { useState } from 'react';
import { Train } from '../../types';
import { Play, RotateCcw, AlertCircle, TrendingDown, TrendingUp } from 'lucide-react';

interface WhatIfSimulationProps {
  trains: Train[];
}

export default function WhatIfSimulation({ trains }: WhatIfSimulationProps) {
  const [selectedTrain, setSelectedTrain] = useState<string>('');
  const [delayMinutes, setDelayMinutes] = useState<number>(0);
  const [blockedTrack, setBlockedTrack] = useState<string>('');
  const [simulationRun, setSimulationRun] = useState(false);

  const stations = ['Chennai Central', 'Tambaram', 'Chengalpattu', 'Katpadi Junction', 'Jolarpettai', 'Salem', 'Bangalore'];

  const inputCls = "w-full rounded-xl px-3 py-2.5 text-sm focus:outline-none transition-colors";
  const inputStyle = { background: '#F5F4EF', border: '1px solid #E2E0D8', color: '#1A1A2E' };

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: '#1A1A2E' }}>What-If Simulation</h1>
        <p className="text-sm mt-0.5" style={{ color: '#6B6B7B' }}>Test scenarios and predict outcomes before taking action</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Parameters */}
        <div className="space-y-4">
          <div className="rounded-2xl border p-5" style={{ background: '#FFFFFF', borderColor: '#E2E0D8' }}>
            <h2 className="text-sm font-semibold mb-4" style={{ color: '#1A1A2E' }}>Simulation Parameters</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#6B6B7B' }}>Select Train</label>
                <select value={selectedTrain} onChange={e => setSelectedTrain(e.target.value)}
                  className={inputCls} style={inputStyle}>
                  <option value="">Choose a train...</option>
                  {trains.map(t => (
                    <option key={t.id} value={t.id}>{t.id} - {t.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#6B6B7B' }}>Add Delay (minutes)</label>
                <input type="number" value={delayMinutes} onChange={e => setDelayMinutes(Number(e.target.value))}
                  min="0" max="60" placeholder="0"
                  className={inputCls} style={inputStyle} />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#6B6B7B' }}>Block Track Section</label>
                <select value={blockedTrack} onChange={e => setBlockedTrack(e.target.value)}
                  className={inputCls} style={inputStyle}>
                  <option value="">No blockage</option>
                  {stations.slice(0, -1).map((s, i) => (
                    <option key={i} value={`${s} - ${stations[i + 1]}`}>{s} → {stations[i + 1]}</option>
                  ))}
                </select>
              </div>

              <div className="pt-2 space-y-2">
                <button onClick={() => setSimulationRun(true)} disabled={!selectedTrain && !blockedTrack}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 font-semibold text-sm rounded-xl transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: '#1A1A2E', color: '#C9A84C' }}>
                  <Play className="w-4 h-4" /><span>Run Simulation</span>
                </button>
                <button onClick={() => { setSelectedTrain(''); setDelayMinutes(0); setBlockedTrack(''); setSimulationRun(false); }}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 font-medium text-sm rounded-xl transition-colors border"
                  style={{ background: '#F5F4EF', borderColor: '#E2E0D8', color: '#6B6B7B' }}>
                  <RotateCcw className="w-4 h-4" /><span>Reset</span>
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border p-4" style={{ background: '#FFFFFF', borderColor: '#E2E0D8' }}>
            <h3 className="text-xs font-semibold mb-3" style={{ color: '#1A1A2E' }}>Current Configuration</h3>
            <div className="space-y-2">
              {[
                ['Selected Train', selectedTrain || 'None'],
                ['Added Delay',    `${delayMinutes} min`],
                ['Blocked Track',  blockedTrack || 'None'],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between text-xs">
                  <span style={{ color: '#6B6B7B' }}>{label}</span>
                  <span className="font-medium" style={{ color: '#1A1A2E' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-4">
          {!simulationRun ? (
            <div className="rounded-2xl border p-12 text-center" style={{ background: '#FFFFFF', borderColor: '#E2E0D8' }}>
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: '#F5F4EF' }}>
                <Play className="w-8 h-8" style={{ color: '#9B9BAB' }} />
              </div>
              <h3 className="text-base font-semibold mb-2" style={{ color: '#1A1A2E' }}>No Simulation Running</h3>
              <p className="text-sm" style={{ color: '#6B6B7B' }}>Configure parameters and run simulation to see predicted outcomes</p>
            </div>
          ) : (
            <>
              <div className="rounded-2xl border overflow-hidden" style={{ background: '#FFFFFF', borderColor: '#E2E0D8' }}>
                <div className="px-5 py-4 border-b" style={{ borderColor: '#E2E0D8', background: '#F5F4EF' }}>
                  <h2 className="text-sm font-semibold" style={{ color: '#1A1A2E' }}>Predicted Outcomes</h2>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-3 gap-4 mb-5">
                    {[
                      { label: 'Total Network Delay', value: `+${12 + delayMinutes} min`, icon: TrendingUp,   bold: true },
                      { label: 'Affected Trains',     value: blockedTrack ? 6 : 3,        icon: AlertCircle, bold: false },
                      { label: 'New Conflicts',        value: blockedTrack ? 2 : 1,        icon: AlertCircle, bold: false },
                    ].map(card => {
                      const Icon = card.icon;
                      return (
                        <div key={card.label} className="rounded-xl border p-4" style={{ background: '#FAFAF8', borderColor: '#E2E0D8' }}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs" style={{ color: '#6B6B7B' }}>{card.label}</span>
                            <Icon className="w-4 h-4" style={{ color: card.bold ? '#1A1A2E' : '#9B9BAB' }} />
                          </div>
                          <p className="text-2xl font-bold" style={{ color: '#1A1A2E' }}>{card.value}</p>
                        </div>
                      );
                    })}
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wide" style={{ color: '#6B6B7B' }}>Impact Analysis</h3>
                    <div className="rounded-xl border p-4" style={{ background: '#FAFAF8', borderColor: '#E2E0D8' }}>
                      <div className="flex items-start space-x-3">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#1A1A2E' }} />
                        <div>
                          <p className="text-xs font-semibold mb-1" style={{ color: '#1A1A2E' }}>Critical Impact</p>
                          <p className="text-xs" style={{ color: '#6B6B7B' }}>
                            Train {selectedTrain || '12632'} delay causes cascading effect on {blockedTrack ? '4' : '2'} downstream trains. Expected delay propagation: 8–15 minutes.
                          </p>
                        </div>
                      </div>
                    </div>
                    {blockedTrack && (
                      <div className="rounded-xl border p-4" style={{ background: '#F5F4EF', borderColor: '#E2E0D8' }}>
                        <div className="flex items-start space-x-3">
                          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#6B6B7B' }} />
                          <div>
                            <p className="text-xs font-semibold mb-1" style={{ color: '#6B6B7B' }}>Track Blockage Impact</p>
                            <p className="text-xs" style={{ color: '#6B6B7B' }}>
                              Blocking {blockedTrack} requires rerouting 3 express trains and 2 passenger trains. Alternative routes add 12–18 minutes.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border overflow-hidden" style={{ background: '#FFFFFF', borderColor: '#E2E0D8' }}>
                <div className="px-5 py-4 border-b" style={{ borderColor: '#E2E0D8', background: '#F5F4EF' }}>
                  <h2 className="text-sm font-semibold" style={{ color: '#1A1A2E' }}>AI Recommended Actions</h2>
                </div>
                <div className="p-5 space-y-3">
                  {[
                    { title: 'Priority Reordering', desc: 'Elevate priority of Train 22910 to clear the section faster and reduce downstream delays.',       saving: 8 },
                    { title: 'Alternative Routing', desc: 'Divert freight trains to auxiliary tracks to maintain express train schedules.',                    saving: 5 },
                    { title: 'Speed Optimization',  desc: 'Adjust speed profiles for trains approaching the affected section to minimize waiting time.',       saving: 3 },
                  ].map(item => (
                    <div key={item.title} className="rounded-xl border p-4" style={{ background: '#FAFAF8', borderColor: '#E2E0D8' }}>
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="text-xs font-semibold" style={{ color: '#1A1A2E' }}>{item.title}</h4>
                        <div className="flex items-center space-x-1 px-2 py-0.5 rounded-full border flex-shrink-0"
                          style={{ background: '#F5F4EF', borderColor: '#E2E0D8' }}>
                          <TrendingDown className="w-3 h-3" style={{ color: '#C9A84C' }} />
                          <span className="text-xs font-semibold" style={{ color: '#1A1A2E' }}>-{item.saving} min</span>
                        </div>
                      </div>
                      <p className="text-xs" style={{ color: '#6B6B7B' }}>{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
