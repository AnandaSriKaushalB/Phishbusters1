import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function AuthCallback() {
  const [searchParams] = useSearchParams()
  const { login } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const token = searchParams.get('token')
    if (token) {
      login(token)
      navigate('/dashboard')
    } else {
      navigate('/')
    }
  }, [searchParams, login, navigate])

  return (
    <div style={{ textAlign: 'center', padding: '40px' }}>
      <p>Authenticating...</p>
    </div>
  )
}

export default AuthCallback
