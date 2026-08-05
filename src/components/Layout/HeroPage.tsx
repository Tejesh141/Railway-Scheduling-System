import { Radio, BrainCircuit, Zap, BarChart2, LucideIcon } from 'lucide-react';
import { Page } from '../../types';

interface HeroPageProps {
  onNavigate: (page: Page) => void;
}

export default function HeroPage({ onNavigate }: HeroPageProps) {
  const stats = [
    { value: '99.2%', label: 'Uptime' },
    { value: '< 3s',  label: 'Conflict Detection' },
    { value: '8+',    label: 'Active Trains' },
    { value: '82%',   label: 'On-Time Rate' },
  ];

  const features: { icon: LucideIcon; title: string; desc: string }[] = [
    { icon: Radio,        title: 'Real-Time GPS Tracking', desc: 'Live position updates for every train across the corridor' },
    { icon: BrainCircuit, title: 'AI Conflict Prediction', desc: 'Detects and resolves track conflicts before they happen' },
    { icon: Zap,          title: 'Instant AI Dispatch',    desc: 'Auto-dispatch instructions with one-click override control' },
    { icon: BarChart2,    title: 'Section Analytics',      desc: 'Throughput, delay distribution and performance scoring' },
  ];

  return (
    <div style={{ background: '#F5F4EF' }}>

      {/* ── Hero Section ── */}
      <div className="relative overflow-hidden" style={{ minHeight: '140vh' }}>

        {/* Background image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1474487548417-781cb71495f3?w=1800&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />

        {/* Dark overlay */}
        <div className="absolute inset-0" style={{ background: 'rgba(15,15,30,0.72)' }} />

        {/* Gold gradient accent bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-32"
          style={{ background: 'linear-gradient(to top, rgba(201,168,76,0.12), transparent)' }} />

        {/* Hero content */}
        <div className="relative z-10 flex flex-col justify-start h-full px-16 py-24" style={{ minHeight: '140vh' }}>
          <div className="max-w-2xl">

            {/* Badge */}
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full mb-6 border"
              style={{ background: 'rgba(201,168,76,0.12)', borderColor: 'rgba(201,168,76,0.35)', color: '#C9A84C' }}>
              <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#C9A84C' }} />
              <span className="text-xs font-semibold tracking-widest uppercase">Live System Active</span>
            </div>

            {/* Headline */}
            <h1 style={{
              fontSize: 'clamp(2.8rem, 5vw, 4.2rem)',
              fontWeight: 900,
              color: '#FFFFFF',
              lineHeight: 1.1,
              letterSpacing: -1,
              marginBottom: 24,
            }}>
              Intelligent Railway<br />
              <span style={{ color: '#C9A84C' }}>Traffic Control</span>
            </h1>

            {/* Subtitle */}
            <p style={{
              fontSize: '1.1rem',
              color: 'rgba(255,255,255,0.72)',
              lineHeight: 1.7,
              marginBottom: 40,
              maxWidth: 520,
            }}>
              RailGenius uses AI to predict conflicts, optimize train schedules, and dispatch real-time instructions — keeping the Chennai–Bangalore corridor running at peak efficiency.
            </p>

            {/* CTA Buttons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-8 py-3.5 rounded-2xl font-semibold text-sm transition-all hover:scale-105"
                style={{
                  background: '#C9A84C',
                  color: '#1A1A2E',
                  boxShadow: '0 8px 32px rgba(201,168,76,0.35)',
                }}
              >
                Open Dashboard →
              </button>
              <button
                onClick={() => onNavigate('live-map')}
                className="px-8 py-3.5 rounded-2xl font-semibold text-sm transition-all border hover:scale-105"
                style={{
                  background: 'transparent',
                  color: '#FFFFFF',
                  borderColor: 'rgba(255,255,255,0.35)',
                }}
              >
                Live Train Map
              </button>
            </div>
          </div>

          {/* Stats strip */}
          <div className="absolute bottom-12 right-16">
            <div className="grid grid-cols-4 gap-4 w-max">
              {stats.map(s => (
                <div key={s.label} className="rounded-2xl px-5 py-4 border"
                  style={{
                    background: 'rgba(255,255,255,0.07)',
                    backdropFilter: 'blur(12px)',
                    borderColor: 'rgba(255,255,255,0.12)',
                  }}>
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#C9A84C', lineHeight: 1 }}>{s.value}</div>
                  <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.55)', marginTop: 4, letterSpacing: 1 }}>{s.label.toUpperCase()}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Features Section ── */}
      <div className="px-16 py-20">
        <div className="text-center mb-12">
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#1A1A2E', marginBottom: 8 }}>
            Everything you need to control the corridor
          </h2>
          <p style={{ color: '#6B6B7B', fontSize: '1rem' }}>
            Built for railway operations teams who need speed, accuracy, and reliability.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(f => (
            <div key={f.title} className="rounded-2xl border p-6 transition-all hover:-translate-y-1"
              style={{ background: '#FFFFFF', borderColor: '#E2E0D8', boxShadow: '0 2px 12px rgba(26,26,46,0.05)' }}>
              <div className="mb-4" style={{ color: '#C9A84C' }}>
                <f.icon size={28} strokeWidth={1.8} />
              </div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1A1A2E', marginBottom: 6 }}>{f.title}</h3>
              <p style={{ fontSize: '0.8rem', color: '#6B6B7B', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 rounded-3xl p-12 text-center"
          style={{ background: '#1A1A2E' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', marginBottom: 8 }}>
            Ready to take control?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', marginBottom: 28, fontSize: '0.95rem' }}>
            Monitor live trains, resolve conflicts instantly, and let AI optimize your section.
          </p>
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-10 py-3.5 rounded-2xl font-semibold text-sm transition-all hover:scale-105"
            style={{ background: '#C9A84C', color: '#1A1A2E', boxShadow: '0 8px 32px rgba(201,168,76,0.25)' }}
          >
            Launch Control Dashboard →
          </button>
        </div>
      </div>
    </div>
  );
}
