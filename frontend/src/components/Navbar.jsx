// src/components/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav
      style={{
        background:
          'linear-gradient(90deg, rgba(56,189,248,0.18), rgba(129,140,248,0.35), rgba(236,72,153,0.25))',
        backdropFilter: 'blur(18px)',
        padding: '10px 24px',
        boxShadow: '0 6px 26px rgba(15,23,42,0.75)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(148,163,184,0.35)',
        minHeight: 60,
        /* removed position: 'sticky', top, zIndex */
      }}
    >
      {/* left logo */}
      <Link
        to="/"
        style={{
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 999,
            background:
              'radial-gradient(circle at 30% 20%, #facc15, #f97316 40%, #ef4444 80%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 18px rgba(248,250,252,0.45)',
          }}
        >
          🛡️
        </div>
        <span
          style={{
            fontSize: 22,
            fontWeight: 800,
            background:
              'linear-gradient(120deg, #e5e7eb, #bfdbfe, #f9a8d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: 0.5,
          }}
        >
          MailShield: AI‑Powered Phishing Scanner
        </span>
      </Link>

      {isAuthenticated && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link
            to="/analytics"
            style={{
              color: '#e5e7eb',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: 14,
              padding: '8px 18px',
              borderRadius: 999,
              background: 'rgba(30,64,175,0.25)',
              border: '1px solid rgba(129,140,248,0.7)',
              boxShadow: '0 0 14px rgba(129,140,248,0.55)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              transition: 'background 0.2s ease, box-shadow 0.2s ease, transform 0.1s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(79,70,229,0.55)'
              e.currentTarget.style.boxShadow =
                '0 0 22px rgba(129,140,248,0.85)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(30,64,175,0.25)'
              e.currentTarget.style.boxShadow =
                '0 0 14px rgba(129,140,248,0.55)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            📊 Dashboard
          </Link>

          <button
            onClick={handleLogout}
            style={{
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              color: '#f9fafb',
              border: 'none',
              padding: '8px 20px',
              borderRadius: 999,
              fontWeight: 700,
              cursor: 'pointer',
              fontSize: 14,
              boxShadow: '0 0 20px rgba(239,68,68,0.55)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              transition: 'transform 0.1s ease, box-shadow 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-1px)'
              e.currentTarget.style.boxShadow =
                '0 0 26px rgba(239,68,68,0.8)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow =
                '0 0 20px rgba(239,68,68,0.55)'
            }}
          >
            🚪 Logout
          </button>
        </div>
      )}
    </nav>
  )
}

export default Navbar
