import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Button from "../../../components/ui/Button"
import Input from "../../../components/ui/Input"
import "../auth.css"

const Login = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      // Validate inputs
      if (!formData.email || !formData.password) {
        setError("Email and password are required")
        setIsLoading(false)
        return
      }

      // Call actual backend API
      const API_URL = import.meta.env.VITE_API_URL || 'https://nxtcompass06.onrender.com/api'
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      // Login via context
      login(data.user, data.token)

      // Redirect to dashboard
      navigate("/dashboard")
    } catch (err) {
      setError(err.message || "Login failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-container">
        {/* Brand Section */}
        <div className="auth-brand">
          <h1 className="auth-title">NxtCompass</h1>
          <p className="auth-subtitle">Your AI-Powered College Guide</p>
        </div>

        {/* Login Form Card */}
        <div className="auth-card">
          <h2 className="auth-form-title">Welcome Back</h2>
          <p className="auth-form-subtitle">Login to access your predictions</p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <Input
                id="password"
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isLoading}
              fullWidth
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          {/* Divider */}
          <div className="auth-divider">
            <span>New to NxtCompass?</span>
          </div>

          {/* Sign Up Link */}
          <Link to="/register" className="auth-cta">
            Create an account
          </Link>

          {/* Footer Links */}
          <div className="auth-footer">
            <Link to="/" className="auth-footer-link">
              Back to Home
            </Link>
          </div>
        </div>

        {/* Demo Credentials (Development Only) */}
        {import.meta.env.DEV && (
          <div className="auth-demo">
            <p className="auth-demo-title">Demo Credentials (Dev Only)</p>
            <button
              type="button"
              className="auth-demo-btn"
              onClick={() => {
                setFormData({
                  email: "test@example.com",
                  password: "password123",
                })
              }}
            >
              Prefill Demo Credentials
            </button>
          </div>
        )}
      </div>

      {/* Decorative Background */}
      <div className="auth-background">
        <div className="auth-glow auth-glow-1"></div>
        <div className="auth-glow auth-glow-2"></div>
      </div>
    </main>
  )
}

export default Login
