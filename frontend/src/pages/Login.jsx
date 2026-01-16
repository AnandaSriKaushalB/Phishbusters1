// src/pages/Login.jsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'

function Login() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const handleGoogleLogin = async () => {
    try {
      const res = await api.get('/auth/google/login')
      window.location.href = res.data.url
    } catch (err) {
      console.error(err)
      alert('Failed to start Google login')
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a0e27',
        backgroundImage: 'url(https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1920&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Dark overlay with gradient */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.92) 0%, rgba(20, 25, 60, 0.88) 100%)',
        backdropFilter: 'blur(3px)',
      }} />

      {/* Animated glowing orbs */}
      <div style={{
        position: 'absolute',
        top: '15%',
        left: '10%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        animation: 'float 8s ease-in-out infinite',
      }} />
      <div style={{
        position: 'absolute',
        bottom: '10%',
        right: '10%',
        width: '350px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        animation: 'float 10s ease-in-out infinite',
        animationDelay: '2s',
      }} />
      <div style={{
        position: 'absolute',
        top: '50%',
        right: '20%',
        width: '300px',
        height: '300px',
        background: 'radial-gradient(circle, rgba(236, 72, 153, 0.2) 0%, transparent 70%)',
        borderRadius: '50%',
        filter: 'blur(80px)',
        animation: 'float 12s ease-in-out infinite',
        animationDelay: '4s',
      }} />

      <div 
        style={{
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(20px)',
          borderRadius: '28px',
          maxWidth: '520px',
          width: '100%',
          padding: '52px',
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(99, 102, 241, 0.3)',
          border: '1px solid rgba(99, 102, 241, 0.2)',
          position: 'relative',
          zIndex: 1,
          animation: 'slideIn 0.8s ease-out',
        }}
      >
        {/* Logo/Icon with glow */}
        <div style={{
          textAlign: 'center',
          marginBottom: '32px',
        }}>
          <div style={{
            width: '100px',
            height: '100px',
            margin: '0 auto 20px',
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
            borderRadius: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '50px',
            boxShadow: '0 0 40px rgba(99, 102, 241, 0.6), 0 10px 30px rgba(0, 0, 0, 0.4)',
            animation: 'bounce 3s ease-in-out infinite',
            position: 'relative',
          }}>
            🛡️
            {/* Pulsing ring */}
            <div style={{
              position: 'absolute',
              inset: '-8px',
              border: '2px solid rgba(99, 102, 241, 0.5)',
              borderRadius: '28px',
              animation: 'pulse-ring 2s ease-out infinite',
            }} />
          </div>
          <h2 style={{ 
            marginBottom: '12px',
            fontSize: '38px',
            fontWeight: 900,
            background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #f472b6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 0 30px rgba(99, 102, 241, 0.5)',
            letterSpacing: '1px',
          }}>
            MailShield: AI‑Powered Phishing Scanner
          </h2>
          <p style={{ 
            color: '#94a3b8', 
            fontSize: '16px',
            lineHeight: 1.7,
            marginBottom: '36px',
            fontWeight: 500,
          }}>
            Protect yourself from phishing threats with AI-powered email analysis
          </p>
        </div>

        {/* Feature highlights with glowing icons */}
        <div style={{
          marginBottom: '36px',
          display: 'grid',
          gap: '16px',
        }}>
          {[
            { icon: '🔍', text: 'Real-time threat detection', color: '#6366f1' },
            { icon: '🤖', text: 'AI-powered analysis', color: '#8b5cf6' },
            { icon: '📊', text: 'Detailed risk scoring', color: '#ec4899' },
          ].map((feature, idx) => (
            <div 
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px',
                background: `${feature.color}15`,
                borderRadius: '16px',
                transition: 'all 0.3s ease',
                border: `1px solid ${feature.color}30`,
                boxShadow: `0 0 20px ${feature.color}20`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = `${feature.color}25`
                e.currentTarget.style.transform = 'translateX(8px)'
                e.currentTarget.style.boxShadow = `0 0 30px ${feature.color}40`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = `${feature.color}15`
                e.currentTarget.style.transform = 'translateX(0)'
                e.currentTarget.style.boxShadow = `0 0 20px ${feature.color}20`
              }}
            >
              <span style={{ 
                fontSize: '32px',
                filter: `drop-shadow(0 0 10px ${feature.color})`,
              }}>
                {feature.icon}
              </span>
              <span style={{ 
                fontWeight: 700, 
                color: '#e2e8f0',
                fontSize: '15px',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
              }}>
                {feature.text}
              </span>
            </div>
          ))}
        </div>

        {/* Google Sign In Button with glow */}
        <button
          onClick={handleGoogleLogin}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '14px',
            width: '100%',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
            border: '2px solid rgba(99, 102, 241, 0.3)',
            color: '#1e293b',
            padding: '18px',
            borderRadius: '14px',
            fontSize: '17px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 20px rgba(99, 102, 241, 0.3)',
            position: 'relative',
            overflow: 'hidden',
          }}
          onMouseEnter={(e) => {
            e.target.style.borderColor = '#6366f1'
            e.target.style.boxShadow = '0 8px 30px rgba(99, 102, 241, 0.5)'
            e.target.style.transform = 'translateY(-3px)'
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = 'rgba(99, 102, 241, 0.3)'
            e.target.style.boxShadow = '0 4px 20px rgba(99, 102, 241, 0.3)'
            e.target.style.transform = 'translateY(0)'
          }}
        >
          {/* Shine effect */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent)',
            animation: 'shine 3s ease-in-out infinite',
          }} />
          
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            style={{ width: '26px', height: '26px', position: 'relative', zIndex: 1 }}
          />
          <span style={{ position: 'relative', zIndex: 1 }}>Continue with Google</span>
        </button>

        <p style={{
          marginTop: '28px',
          textAlign: 'center',
          fontSize: '13px',
          color: '#64748b',
          lineHeight: 1.6,
          fontWeight: 500,
        }}>
          By signing in, you agree to let MailShield access your Gmail to analyze emails for security threats
        </p>

        {/* Decorative elements */}
        <div style={{
          position: 'absolute',
          bottom: '-40px',
          right: '-40px',
          width: '150px',
          height: '150px',
          background: 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%)',
          borderRadius: '50%',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }} />
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0); }
          33% { transform: translate(30px, -30px); }
          66% { transform: translate(-20px, 20px); }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(40px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes pulse-ring {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(1.3);
            opacity: 0;
          }
        }
        @keyframes shine {
          0% { left: -100%; }
          50% { left: 100%; }
          100% { left: 100%; }
        }
      `}</style>
    </div>
  )
}

export default Login