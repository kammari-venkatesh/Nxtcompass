
import { useAuth } from "../../auth/context/AuthContext"
import { useNavigate } from "react-router-dom"
import { LogOut } from "lucide-react"
import "../dashboard.css"

const ProfileCard = ({ savedCount = 0 }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  if (!user) return null

  const initials = user.name
    ?.split(" ")
    .map((n) => n.charAt(0))
    .join("")
    .toUpperCase()

  return (
    <div className="profile-card-container">
      <div className="profile-card">
        <div className="profile-header">
          <div className="profile-avatar">{initials || "U"}</div>
          <div className="profile-details">
            <h2 className="profile-name">{user.name}</h2>
            <p className="profile-email">{user.email}</p>
          </div>
        </div>

        <div className="profile-stats">
          <div className="profile-stat">
            <span className="stat-number">3</span>
            <span className="stat-name">Quizzes</span>
          </div>
          <div className="profile-stat">
            <span className="stat-number">2</span>
            <span className="stat-name">Predictions</span>
          </div>
          <div className="profile-stat">
            <span className="stat-number">{savedCount}</span>
            <span className="stat-name">Saved</span>
          </div>
        </div>

        <div className="profile-actions" style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={handleLogout}
            style={{
              width: '20%',
              minWidth: '120px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.5rem',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '50px',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
              transform: 'translateY(0)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
            }}
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default ProfileCard
