import { Routes, Route } from "react-router-dom"

// Landing
import LandingPage from "../features/landing/LandingPage"

// Auth
import AuthGuard from "../features/auth/components/AuthGuard"
import Login from "../features/auth/pages/Login"
import Register from "../features/auth/pages/Register"
import DebugAuth from "../features/auth/pages/DebugAuth"

// Quiz
import QuizEntry from "../features/quiz/QuizEntry"
import QuizStart from "../features/quiz/QuizStart"
import QuizResults from "../features/quiz/QuizResults"
import PathfinderQuiz from "../features/quiz/PathfinderQuiz"
import PathfinderResults from "../features/quiz/PathfinderResults"

// Predictor
import PredictorEntry from "../features/predictor/PredictorEntry"
import PredictorStart from "../features/predictor/PredictorStart"
import PredictorResults from "../features/predictor/PredictorResults"

// Colleges
import CollegePage from "../features/colleges/CollegePage"
import CollegeDetails from "../features/college/CollegeDetails"

// Chat
import ChatPage from "../features/chat/ChatPage"

// Career Manifesto
import CareerManifesto from "../features/manifesto/CareerManifesto"
import ManifestoAnalysis from "../features/manifesto/ManifestoAnalysis"

// Dashboard
import UserDashboard from "../features/dashboard/pages/UserDashboard"

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<LandingPage />} />

      {/* Authentication */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/debug-auth" element={<DebugAuth />} />

      {/* Quiz */}
      <Route path="/quiz" element={<QuizEntry />} />
      <Route path="/quiz/start" element={<QuizStart />} />
      <Route path="/quiz/results" element={<QuizResults />} />

      {/* Pathfinder Quiz 2.0 */}
      <Route path="/pathfinder" element={<PathfinderQuiz />} />
      <Route path="/pathfinder/results" element={<PathfinderResults />} />

      {/* Predictor */}
      <Route path="/predictor" element={<PredictorEntry />} />
      <Route path="/predictor/start" element={<PredictorStart />} />
      <Route path="/predictor/results" element={<PredictorResults />} />

      {/* Colleges */}
      <Route path="/college/:collegeId" element={<CollegePage />} />
      <Route path="/college/details/:id" element={<CollegeDetails />} />

      {/* AI Chat */}
      <Route path="/chat" element={<ChatPage />} />

      {/* Career Manifesto */}
      <Route path="/manifesto" element={<CareerManifesto />} />
      <Route path="/manifesto/analysis" element={<ManifestoAnalysis />} />

      {/* Dashboard (Protected) */}
      <Route
        path="/dashboard"
        element={
          <AuthGuard>
            <UserDashboard />
          </AuthGuard>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<h1>404 – Page Not Found</h1>} />
    </Routes>
  )
}

export default AppRoutes
