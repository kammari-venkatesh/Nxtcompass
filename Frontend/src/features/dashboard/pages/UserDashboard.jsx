import { useState, useEffect } from "react"
import Navbar from "../../../components/navigation/Navbar"
import ProfileCard from "../components/ProfileCard"
import SavedColleges from "../components/SavedColleges"
import PredictionHistory from "../components/PredictionHistory"
import { getSavedColleges as getSavedCollegesAPI, removeSavedCollege as removeSavedCollegeAPI } from "../../../api/savedColleges"
import { getPredictorResults } from "../../../api/predictorResults"
import { useAuth } from "../../auth/context/AuthContext"
import "../dashboard.css"

const UserDashboard = () => {
  const { isAuthenticated } = useAuth();
  const [savedColleges, setSavedColleges] = useState([]);
  const [predictionHistory, setPredictionHistory] = useState([]);
  const [rawSavedCount, setRawSavedCount] = useState(0); // Track raw count from backend

  // Fetch saved colleges and prediction history on mount (only if authenticated)
  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated) {
        setSavedColleges([]);
        setPredictionHistory([]);
        return;
      }

      try {
        // Fetch saved colleges - backend now returns populated college data
        const savedCollegesData = await getSavedCollegesAPI();
        setRawSavedCount(savedCollegesData.length);

        const formattedColleges = savedCollegesData.map(college => ({
          id: college._id,
          name: college.name,
          branch: college.branches?.[0] || 'N/A', // Use first branch or N/A
          probability: Math.floor(Math.random() * 100) + 1, // Random for now
          nirf: college.nireRank || Math.floor(Math.random() * 100) + 1
        }));
        setSavedColleges(formattedColleges);

        // Fetch prediction history
        const predictorResults = await getPredictorResults();
        const formattedHistory = predictorResults.map(result => ({
          id: result._id,
          exam: result.exam,
          rank: result.input?.rank || result.input?.percentile || result.input?.score || 'N/A',
          category: result.input?.category || 'N/A',
          date: new Date(result.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          }),
          topMatch: result.topMatch?.collegeName || 'N/A',
          input: result.input, // Store full input for re-running prediction
        }));
        setPredictionHistory(formattedHistory);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setSavedColleges([]);
        setPredictionHistory([]);
      }
    };

    fetchData();
  }, [isAuthenticated]);

  const handleRemoveCollege = async (collegeId) => {
    try {
      await removeSavedCollegeAPI(collegeId);
      setSavedColleges(prev => prev.filter(college => college.id !== collegeId));
      setRawSavedCount(prev => prev - 1);
    } catch (error) {
      console.error('Failed to remove saved college:', error);
    }
  };

  return (
    <>
      <Navbar />
      <main className="dashboard-page">
        <div className="dashboard-container">
          <section className="dashboard-section">
            <ProfileCard savedCount={savedColleges.length} />
          </section>

          <section className="dashboard-section">
            <h2 className="dashboard-section-title">Your Saved Colleges</h2>
            {savedColleges.length === 0 && rawSavedCount > 0 && (
              <div style={{
                padding: '1rem',
                backgroundColor: '#fef3c7',
                border: '1px solid #f59e0b',
                borderRadius: '0.5rem',
                marginBottom: '1rem',
                color: '#92400e'
              }}>
                ⚠️ You have {rawSavedCount} saved college(s) with old data. Click "Clear All" to remove them and start fresh.
              </div>
            )}
            <SavedColleges colleges={savedColleges} onRemove={handleRemoveCollege} />
          </section>

          <section className="dashboard-section">
            <h2 className="dashboard-section-title">Prediction History</h2>
            <PredictionHistory history={predictionHistory} />
          </section>
        </div>
      </main>
    </>
  )
}

export default UserDashboard
