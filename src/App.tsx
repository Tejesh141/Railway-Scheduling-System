import { useState } from 'react';
import { Page } from './types';

import TopNav from './components/Layout/TopNav';
import Sidebar from './components/Layout/Sidebar';
import DashboardPage from './components/Dashboard/DashboardPage';
import LiveTraffic from './components/LiveMap/LiveTraffic';
import WhatIfSimulation from './components/Simulation/WhatIfSimulation';
import AnalyticsDashboard from './components/Analytics/AnalyticsDashboard';
import SettingsPage from './components/Settings/SettingsPage';
import ConflictPredictionsPage from './components/Conflicts/ConflictPredictionsPage';
import AIRecommendationsPage from './components/Recommendations/AIRecommendationsPage';
import SystemLogsPage from './components/Logs/SystemLogsPage';

import { useTrains } from './hooks/useTrains';
import { useConflicts } from './hooks/useConflicts';
import { mockRecommendations, mockMetrics } from './data/mockData';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const { trains, loading, error } = useTrains();
  const { conflicts, loading: conflictsLoading, error: conflictsError } = useConflicts();

  const renderPage = () => {
    switch (currentPage) {
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
      case 'simulation':
        return <WhatIfSimulation trains={trains} />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'logs':
        return <SystemLogsPage />;
      case 'settings':
        return <SettingsPage />;
      default:
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
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#F5F4EF' }}>
      <TopNav />
      <Sidebar currentPage={currentPage} onPageChange={setCurrentPage} />
      <main className="flex-1 overflow-y-auto px-6 pb-8">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
