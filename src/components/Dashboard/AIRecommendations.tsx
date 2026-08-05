import { Recommendation } from '../../types';
import { Sparkles, TrendingDown } from 'lucide-react';

interface AIRecommendationsProps {
  recommendations: Recommendation[];
}

export default function AIRecommendations({ recommendations }: AIRecommendationsProps) {
  return (
    <div className="card-hover rounded-2xl border overflow-hidden" style={{ background: '#FFFFFF', borderColor: '#E2E0D8' }}>
      <div className="px-5 py-4 border-b" style={{ borderColor: '#E2E0D8', background: '#F5F4EF' }}>
        <h2 className="text-sm font-semibold" style={{ color: '#1A1A2E' }}>AI Recommended Actions</h2>
        <p className="text-xs mt-0.5" style={{ color: '#6B6B7B' }}>{recommendations.length} optimization suggestions</p>
      </div>
      <div className="p-4 space-y-3">
        {recommendations.map((rec) => (
          <div key={rec.id} className="card-hover rounded-xl p-4 border" style={{ background: '#FAFAF8', borderColor: '#E2E0D8' }}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4" style={{ color: '#C9A84C' }} />
                <span className="text-sm font-semibold" style={{ color: '#1A1A2E' }}>{rec.trainName}</span>
                <span className="text-xs font-mono" style={{ color: '#9B9BAB' }}>#{rec.trainId}</span>
              </div>
              {rec.delayReduction > 0 && (
                <div className="flex items-center space-x-1 px-2 py-1 rounded-full border" style={{ background: '#F5F4EF', borderColor: '#E2E0D8', color: '#1A1A2E' }}>
                  <TrendingDown className="w-3 h-3" style={{ color: '#C9A84C' }} />
                  <span className="text-xs font-semibold">-{rec.delayReduction} min</span>
                </div>
              )}
            </div>
            <p className="text-sm font-medium mb-1" style={{ color: '#1A1A2E' }}>{rec.action}</p>
            <p className="text-xs leading-relaxed" style={{ color: '#6B6B7B' }}>{rec.explanation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
