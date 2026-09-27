import { Bell, User, LayoutDashboard, Radio, AlertTriangle, BrainCircuit, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Page } from '../../types';

const notifications = [
  { id: 1, type: 'critical', message: 'Critical conflict detected between Nellai Express & Bangalore Rajdhani at Katpadi Junction', time: '2 min ago', read: false },
  { id: 2, type: 'warning',  message: 'Trivandrum Express delayed by 5 min at Chengalpattu', time: '5 min ago', read: false },
  { id: 3, type: 'info',     message: 'AI instruction accepted: Freight 023 diverted to alternate track', time: '10 min ago', read: true },
  { id: 4, type: 'info',     message: 'Coimbatore SF running on schedule', time: '15 min ago', read: true },
  { id: 5, type: 'warning',  message: 'Track utilization at Jolarpettai exceeds 85%', time: '20 min ago', read: true },
];

interface TopNavProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

const navItems: { id: Page; label: string; icon: React.ReactNode }[] = [
  { id: 'home',            label: 'Home',            icon: null },
  { id: 'dashboard',       label: 'Dashboard',       icon: <LayoutDashboard size={15} strokeWidth={1.8} /> },
  { id: 'live-map',        label: 'Live Map',        icon: <Radio size={15} strokeWidth={1.8} /> },
  { id: 'conflicts',       label: 'Conflicts',       icon: <AlertTriangle size={15} strokeWidth={1.8} /> },
  { id: 'recommendations', label: 'AI Insights',     icon: <BrainCircuit size={15} strokeWidth={1.8} /> },
  { id: 'settings',        label: 'Settings',        icon: <Settings size={15} strokeWidth={1.8} /> },
];

export default function TopNav({ currentPage, onPageChange }: TopNavProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifs, setNotifs] = useState(notifications);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const unreadCount = notifs.filter(n => !n.read).length;
  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  const markRead = (id: number) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const typeDot = (type: string): React.CSSProperties => {
    if (type === 'critical') return { background: '#1A1A2E' };
    if (type === 'warning')  return { background: '#C9A84C' };
    return { background: '#9B9BAB' };
  };

  return (
    <div
      className="sticky top-0 z-50 px-8 py-0 flex items-center justify-between"
      style={{
        background: 'rgba(255,255,255,0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid #E2E0D8',
        minHeight: 68,
      }}
    >
      {/* ── Logo ── */}
      <button onClick={() => onPageChange('home')} className="flex items-center space-x-3 group flex-shrink-0">
        {/* Icon mark */}
        <div
          className="relative flex items-center justify-center"
          style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'linear-gradient(135deg, #1A1A2E 60%, #2d2d4e 100%)',
            boxShadow: '0 4px 18px rgba(26,26,46,0.22)',
          }}
        >
          <span style={{ fontSize: 22, fontWeight: 900, color: '#C9A84C', letterSpacing: -1, lineHeight: 1 }}>R</span>
          {/* small gold dot accent */}
          <span style={{
            position: 'absolute', top: 6, right: 6,
            width: 7, height: 7, borderRadius: '50%',
            background: '#C9A84C', opacity: 0.85,
          }} />
        </div>
        {/* Wordmark */}
        <div className="flex flex-col leading-none">
          <span style={{
            fontSize: 26, fontWeight: 900, letterSpacing: 3,
            color: '#1A1A2E', lineHeight: 1,
            fontFamily: "'Segoe UI', system-ui, sans-serif",
          }}>
            RAIL<span style={{ color: '#C9A84C' }}>GENIUS</span>
          </span>
          <span style={{ fontSize: 10, color: '#9B9BAB', letterSpacing: 2, marginTop: 2, fontWeight: 500 }}>
            AI TRAFFIC OPTIMIZATION
          </span>
        </div>
      </button>

      {/* ── Nav items (right side) ── */}
      <div className="flex items-center space-x-1 mx-6">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap"
            style={
              currentPage === item.id
                ? { background: '#1A1A2E', color: '#C9A84C', boxShadow: '0 2px 12px rgba(26,26,46,0.18)' }
                : { color: '#6B6B7B', background: 'transparent' }
            }
            onMouseEnter={e => { if (currentPage !== item.id) (e.currentTarget as HTMLButtonElement).style.background = '#F5F4EF'; }}
            onMouseLeave={e => { if (currentPage !== item.id) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* ── Right actions ── */}
      <div className="flex items-center space-x-3 flex-shrink-0">
        {/* Clock */}
        <div className="text-right hidden lg:block">
          <div className="text-xs" style={{ color: '#9B9BAB' }}>System Time</div>
          <div className="text-sm font-semibold font-mono" style={{ color: '#1A1A2E' }}>{currentTime.toLocaleTimeString()}</div>
        </div>

        {/* Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(prev => !prev)}
            className="p-2 rounded-xl transition-colors relative"
            style={{ background: 'transparent' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#F5F4EF')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <Bell size={18} strokeWidth={1.8} style={{ color: '#1A1A2E' }} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold"
                style={{ background: '#1A1A2E', color: '#C9A84C' }}>
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-96 rounded-2xl shadow-2xl overflow-hidden"
              style={{ background: '#FFFFFF', border: '1px solid #E2E0D8' }}>
              <div className="px-4 py-3 border-b flex items-center justify-between"
                style={{ borderColor: '#E2E0D8', background: '#F5F4EF' }}>
                <h3 className="text-sm font-semibold" style={{ color: '#1A1A2E' }}>Notifications</h3>
                <button onClick={markAllRead} className="text-xs" style={{ color: '#C9A84C' }}>Mark all read</button>
              </div>
              <div className="max-h-80 overflow-y-auto divide-y" style={{ borderColor: '#F0EFE9' }}>
                {notifs.map(n => (
                  <div key={n.id} onClick={() => markRead(n.id)}
                    className="px-4 py-3 flex items-start space-x-3 cursor-pointer hover:bg-[#F5F4EF] transition-colors"
                    style={{ background: !n.read ? '#FAFAF8' : undefined }}>
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={typeDot(n.type)} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs leading-relaxed" style={{ color: n.read ? '#6B6B7B' : '#1A1A2E' }}>{n.message}</p>
                      <p className="text-xs mt-1" style={{ color: '#9B9BAB' }}>{n.time}</p>
                    </div>
                    {!n.read && <div className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ background: '#C9A84C' }} />}
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 border-t" style={{ borderColor: '#E2E0D8', background: '#F5F4EF' }}>
                <p className="text-xs text-center" style={{ color: '#9B9BAB' }}>{unreadCount} unread</p>
              </div>
            </div>
          )}
        </div>

        {/* User */}
        <button className="p-2 rounded-xl transition-colors"
          onMouseEnter={e => (e.currentTarget.style.background = '#F5F4EF')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
          <User size={18} strokeWidth={1.8} style={{ color: '#1A1A2E' }} />
        </button>
      </div>
    </div>
  );
}
