import { useState } from 'react';
import { Page } from './types';

import TopNav from './components/Layout/TopNav';
import HeroPage from './components/Layout/HeroPage';
import DashboardPage from './components/Dashboard/DashboardPage';
import LiveTraffic from './components/LiveMap/LiveTraffic';
import ConflictPredictionsPage from './components/Conflicts/ConflictPredictionsPage';
import AIRecommendationsPage from './components/Recommendations/AIRecommendationsPage';
import SettingsPage from './components/Settings/SettingsPage';

import { useTrains } from './hooks/useTrains';
import { useConflicts } from './hooks/useConflicts';
import { mockRecommendations, mockMetrics } from './data/mockData';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const { trains, loading, error } = useTrains();
  const { conflicts, loading: conflictsLoading, error: conflictsError } = useConflicts();

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HeroPage onNavigate={setCurrentPage} />;
      case 'dashboard':
        return (
          <DashboardPage
            trains={trains}
            conflicts={conflicts}
            recommendations={mockRecommendations}
            metrics={mockMetrics}
            loading={loading}
            error={error}
            conflictsLoading={conflictsLoading}
            conflictsError={conflictsError}
          />
        );
      case 'live-map':
        return <LiveTraffic />;
      case 'conflicts':
        return <ConflictPredictionsPage />;
      case 'recommendations':
        return <AIRecommendationsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <HeroPage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F5F4EF' }}>
      <TopNav currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="flex-1 overflow-y-auto">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
