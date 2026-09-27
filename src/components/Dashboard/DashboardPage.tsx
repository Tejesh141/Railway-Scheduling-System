import { Train, Conflict, Recommendation, Metrics } from '../../types';
import LiveTrainStatus from './LiveTrainStatus';
import ConflictAlerts from './ConflictAlerts';
import AIRecommendations from './AIRecommendations';
import ThroughputMetrics from './ThroughputMetrics';
import { useLanguage } from '../../context/LanguageContext';

interface DashboardPageProps {
  trains: Train[];
  conflicts: Conflict[];
  recommendations: Recommendation[];
  metrics: Metrics;
  loading?: boolean;
  error?: string | null;
  conflictsLoading?: boolean;
  conflictsError?: string | null;
}

export default function DashboardPage({ trains, conflicts, recommendations, metrics, loading, error, conflictsLoading, conflictsError }: DashboardPageProps) {
  const { t } = useLanguage();
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-1" style={{ color: '#1A1A2E' }}>{t('dashboardTitle')}</h1>
        <p className="text-sm" style={{ color: '#6B6B7B' }}>{t('dashboardSubtitle')}</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <LiveTrainStatus trains={trains} loading={loading} error={error} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ConflictAlerts conflicts={conflicts} loading={conflictsLoading} error={conflictsError} />
          <AIRecommendations recommendations={recommendations} />
        </div>

        <ThroughputMetrics metrics={metrics} />
      </div>
    </div>
  );
}
