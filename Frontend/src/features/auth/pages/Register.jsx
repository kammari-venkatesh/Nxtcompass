import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import Button from "../../../components/ui/Button"
import Input from "../../../components/ui/Input"
import "../auth.css"

const Register = () => {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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
      if (
        !formData.name ||
        !formData.email ||
        !formData.password ||
        !formData.confirmPassword
      ) {
        setError("All fields are required")
        setIsLoading(false)
        return
      }

      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match")
        setIsLoading(false)
        return
      }

      if (formData.password.length < 6) {
        setError("Password must be at least 6 characters")
        setIsLoading(false)
        return
      }

      // Call actual backend API
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed')
      }

      // Register + login via context
      login(data.user, data.token)

      // Redirect to dashboard
      navigate("/dashboard")
    } catch (err) {
      setError(err.message || "Registration failed. Please try again.")
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

        {/* Registration Form Card */}
        <div className="auth-card">
          <h2 className="auth-form-title">Create Your Account</h2>
          <p className="auth-form-subtitle">
            Register to save predictions and track your journey
          </p>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            {/* Name Field */}
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <Input
                id="name"
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>

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
              <p className="form-hint">At least 6 characters</p>
            </div>

            {/* Confirm Password Field */}
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
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
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          {/* Divider */}
          <div className="auth-divider">
            <span>Already have an account?</span>
          </div>

          {/* Login Link */}
          <Link to="/login" className="auth-cta">
            Sign In
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
                  name: "Test User",
                  email: "test@example.com",
                  password: "password123",
                  confirmPassword: "password123",
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

export default Register
