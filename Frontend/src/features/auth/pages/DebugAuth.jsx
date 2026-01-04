import { useAuth } from "../context/AuthContext"
import Button from "../../../components/ui/Button"

const DebugAuth = () => {
  const { user, token, isAuthenticated, logout } = useAuth()

  const handleClearStorage = () => {
    localStorage.clear()
    window.location.reload()
  }

  const handleTestAPI = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/saved-colleges', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      console.log('API Test Result:', data)
      alert(JSON.stringify(data, null, 2))
    } catch (error) {
      console.error('API Test Error:', error)
      alert('Error: ' + error.message)
    }
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>🔧 Authentication Debug</h1>

      <div style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
        <h3>Auth Status:</h3>
        <p><strong>Is Authenticated:</strong> {isAuthenticated ? '✅ Yes' : '❌ No'}</p>
        <p><strong>User:</strong> {user ? JSON.stringify(user, null, 2) : 'null'}</p>
        <p><strong>Token:</strong> {token ? `${token.substring(0, 50)}...` : 'null'}</p>
      </div>

      <div style={{ background: '#f5f5f5', padding: '1rem', borderRadius: '8px', marginTop: '1rem' }}>
        <h3>LocalStorage Contents:</h3>
        <pre>{JSON.stringify({
          nxt_token: localStorage.getItem('nxt_token'),
          nxt_user: localStorage.getItem('nxt_user')
        }, null, 2)}</pre>
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
        <Button onClick={handleClearStorage} variant="danger">
          Clear Storage & Reload
        </Button>
        <Button onClick={handleTestAPI} variant="primary" disabled={!token}>
          Test API Call
        </Button>
        <Button onClick={logout} variant="secondary">
          Logout
        </Button>
      </div>
    </div>
  )
}

export default DebugAuth
