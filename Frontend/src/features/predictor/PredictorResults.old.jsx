import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../../components/navigation/Navbar';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';

const PredictorResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { results, input } = location.state || {};

  if (!results || results.length === 0) {
    return (
      <>
        <Navbar />
        <main style={{ padding: '40px', textAlign: 'center' }}>
          <GlassCard>
            <h2>No Results Found</h2>
            <p>No colleges match your criteria. Try adjusting your preferences.</p>
            <Button onClick={() => navigate('/predictor/start')}>
              Try Again
            </Button>
          </GlassCard>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main style={{ padding: '40px' }}>
        <div className="container">
          <h1 style={{ marginBottom: '24px', textAlign: 'center' }}>
            Your College Predictions
          </h1>

          {input && (
            <GlassCard style={{ marginBottom: '24px', padding: '16px' }}>
              <p><strong>Rank:</strong> {input.rank}</p>
              <p><strong>Category:</strong> {input.category}</p>
              <p><strong>Home State:</strong> {input.homeState}</p>
            </GlassCard>
          )}

          <div style={{ display: 'grid', gap: '16px' }}>
            {results.map((result, index) => (
              <GlassCard key={index} style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                  <div>
                    <h3 style={{ margin: 0, marginBottom: '8px' }}>
                      {result.college?.name || result.college?.shortName}
                    </h3>
                    <p style={{ margin: 0, color: '#94a3b8' }}>
                      {result.branch}
                    </p>
                    <p style={{ margin: '8px 0 0 0', fontSize: '14px' }}>
                      <strong>Cutoff Rank:</strong> {result.cutoffRank} |
                      <strong> Your Rank:</strong> {result.yourRank} |
                      <strong> Margin:</strong> {result.margin > 0 ? '+' : ''}{result.margin}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: result.probability >= 70 ? '#10b981' : result.probability >= 50 ? '#f59e0b' : '#ef4444'
                    }}>
                      {result.probability}%
                    </div>
                    <div style={{
                      fontSize: '12px',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      backgroundColor: result.label === 'HIGH' ? 'rgba(16, 185, 129, 0.1)' :
                                       result.label === 'MODERATE' ? 'rgba(245, 158, 11, 0.1)' :
                                       'rgba(239, 68, 68, 0.1)',
                      color: result.label === 'HIGH' ? '#10b981' :
                             result.label === 'MODERATE' ? '#f59e0b' :
                             '#ef4444',
                      marginTop: '4px'
                    }}>
                      {result.label}
                    </div>
                    <p style={{ fontSize: '12px', marginTop: '8px', color: '#94a3b8' }}>
                      {result.reason}
                    </p>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          <div style={{ marginTop: '24px', textAlign: 'center' }}>
            <Button onClick={() => navigate('/predictor/start')}>
              Run Another Prediction
            </Button>
          </div>
        </div>
      </main>
    </>
  );
};

export default PredictorResults;
