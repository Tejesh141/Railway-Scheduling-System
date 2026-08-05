import { LayoutDashboard, Map, AlertTriangle, Sparkles, Gauge, BarChart3, FileText, Settings } from 'lucide-react';
import { Page } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface SidebarProps {
  currentPage: Page;
  onPageChange: (page: Page) => void;
}

export default function Sidebar({ currentPage, onPageChange }: SidebarProps) {
  const { t } = useLanguage();

  const menuItems: { id: Page; labelKey: string; icon: React.ReactNode }[] = [
    { id: 'dashboard',       labelKey: 'dashboard',       icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'live-map',        labelKey: 'liveMap',         icon: <Map className="w-4 h-4" /> },
    { id: 'conflicts',       labelKey: 'conflicts',       icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'recommendations', labelKey: 'recommendations', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'simulation',      labelKey: 'simulation',      icon: <Gauge className="w-4 h-4" /> },
    { id: 'analytics',       labelKey: 'analytics',       icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'logs',            labelKey: 'logs',            icon: <FileText className="w-4 h-4" /> },
    { id: 'settings',        labelKey: 'settings',        icon: <Settings className="w-4 h-4" /> },
  ];

  return (
    <div
      className="sticky top-4 z-40 mx-6 my-4"
      style={{ filter: 'drop-shadow(0 8px 32px rgba(26,26,46,0.13))' }}
    >
      <nav
        className="flex items-center gap-1 px-3 py-2 rounded-2xl overflow-x-auto"
        style={{
          background: 'rgba(255,255,255,0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid #E2E0D8',
          scrollbarWidth: 'none',
        }}
      >
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onPageChange(item.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all text-sm font-medium flex-shrink-0"
            style={
              currentPage === item.id
                ? { background: '#1A1A2E', color: '#C9A84C', boxShadow: '0 2px 12px rgba(26,26,46,0.18)' }
                : { color: '#6B6B7B', background: 'transparent' }
            }
            onMouseEnter={e => { if (currentPage !== item.id) (e.currentTarget as HTMLButtonElement).style.background = '#F5F4EF'; }}
            onMouseLeave={e => { if (currentPage !== item.id) (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
          >
            {item.icon}
            <span>{t(item.labelKey)}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
