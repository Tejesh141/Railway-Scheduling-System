import { Bell, User } from 'lucide-react';
import { useEffect, useState } from 'react';

const notifications = [
  { id: 1, type: 'critical', message: 'Critical conflict detected between Nellai Express & Bangalore Rajdhani at Katpadi Junction', time: '2 min ago', read: false },
  { id: 2, type: 'warning', message: 'Trivandrum Express delayed by 5 min at Chengalpattu', time: '5 min ago', read: false },
  { id: 3, type: 'info', message: 'AI instruction accepted: Freight 023 diverted to alternate track', time: '10 min ago', read: true },
  { id: 4, type: 'info', message: 'Coimbatore SF running on schedule', time: '15 min ago', read: true },
  { id: 5, type: 'warning', message: 'Track utilization at Jolarpettai exceeds 85%', time: '20 min ago', read: true },
];

export default function TopNav() {
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
    <div className="border-b px-6 py-4 flex items-center justify-between relative z-50" style={{ background: '#FFFFFF', borderColor: '#E2E0D8' }}>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#1A1A2E' }}>
            <span className="font-bold text-xl" style={{ color: '#C9A84C' }}>R</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-wider" style={{ color: '#1A1A2E' }}>RAILGENIUS</h1>
            <p className="text-xs" style={{ color: '#6B6B7B' }}>AI Traffic Optimization</p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="text-right">
          <div className="text-sm" style={{ color: '#6B6B7B' }}>System Time</div>
          <div className="text-lg font-semibold font-mono" style={{ color: '#1A1A2E' }}>{currentTime.toLocaleTimeString()}</div>
        </div>

        <div className="text-right">
          <div className="text-sm" style={{ color: '#6B6B7B' }}>Section</div>
          <div className="text-sm font-semibold" style={{ color: '#C9A84C' }}>Chennai – Bangalore Corridor</div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowNotifications(prev => !prev)}
            className="p-2 rounded-lg transition-colors relative hover:bg-[#F5F4EF]"
          >
            <Bell className="w-5 h-5" style={{ color: '#1A1A2E' }} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold" style={{ background: '#1A1A2E', color: '#C9A84C' }}>
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-96 rounded-xl shadow-2xl overflow-hidden" style={{ background: '#FFFFFF', border: '1px solid #E2E0D8' }}>
              <div className="px-4 py-3 border-b flex items-center justify-between" style={{ borderColor: '#E2E0D8', background: '#F5F4EF' }}>
                <h3 className="text-sm font-semibold" style={{ color: '#1A1A2E' }}>Notifications</h3>
                <button onClick={markAllRead} className="text-xs transition-colors" style={{ color: '#C9A84C' }}>
                  Mark all read
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto divide-y" style={{ borderColor: '#F0EFE9' }}>
                {notifs.map(n => (
                  <div
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    className="px-4 py-3 flex items-start space-x-3 cursor-pointer transition-colors hover:bg-[#F5F4EF]"
                    style={{ background: !n.read ? '#FAFAF8' : undefined }}
                  >
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
                <p className="text-xs text-center" style={{ color: '#9B9BAB' }}>{unreadCount} unread notifications</p>
              </div>
            </div>
          )}
        </div>

        <button className="p-2 rounded-lg transition-colors hover:bg-[#F5F4EF]">
          <User className="w-5 h-5" style={{ color: '#1A1A2E' }} />
        </button>
      </div>
    </div>
  );
}
