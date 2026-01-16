// src/components/EmailCard.jsx
import RiskBadge from './RiskBadge'

function EmailCard({ email, onView }) {
  const { subject, from, snippet, date, analysis } = email

  const categoryConfig = {
    'Fraudulent': { 
      color: '#ef4444', 
      gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      glow: 'rgba(239, 68, 68, 0.4)', 
      icon: '🚨',
      bg: 'rgba(239, 68, 68, 0.1)'
    },
    'Suspicious': { 
      color: '#f59e0b', 
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      glow: 'rgba(245, 158, 11, 0.4)', 
      icon: '⚠️',
      bg: 'rgba(245, 158, 11, 0.1)'
    },
    'Safe': { 
      color: '#10b981', 
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      glow: 'rgba(16, 185, 129, 0.4)', 
      icon: '✅',
      bg: 'rgba(16, 185, 129, 0.1)'
    }
  }

  const config = categoryConfig[analysis.category] || categoryConfig['Safe']

  return (
    <div
      style={{
        background: 'rgba(15, 23, 42, 0.7)',
        backdropFilter: 'blur(20px)',
        borderRadius: '20px',
        padding: '28px',
        marginBottom: '20px',
        borderLeft: `5px solid ${config.color}`,
        boxShadow: `0 8px 32px ${config.glow}, 0 0 0 1px rgba(255, 255, 255, 0.1)`,
        border: `1px solid ${config.color}40`,
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-6px) scale(1.01)'
        e.currentTarget.style.boxShadow = `0 16px 48px ${config.glow}, 0 0 0 1px rgba(255, 255, 255, 0.2)`
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)'
        e.currentTarget.style.boxShadow = `0 8px 32px ${config.glow}, 0 0 0 1px rgba(255, 255, 255, 0.1)`
      }}
    >
      {/* Animated gradient overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        right: 0,
        width: '250px',
        height: '250px',
        background: `radial-gradient(circle, ${config.bg} 0%, transparent 70%)`,
        pointerEvents: 'none',
        opacity: 0.6,
        animation: 'pulse 3s ease-in-out infinite',
      }} />

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '16px',
          alignItems: 'flex-start',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ 
              fontSize: '28px',
              filter: 'drop-shadow(0 0 8px currentColor)',
            }}>
              {config.icon}
            </span>
            <h3 style={{ 
              fontSize: '20px', 
              fontWeight: 800, 
              margin: 0,
              color: '#fff',
              lineHeight: 1.3,
              textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)',
            }}>
              {subject || '(No Subject)'}
            </h3>
          </div>
          <div style={{ 
            fontSize: 13, 
            color: '#94a3b8',
            fontWeight: 600,
            letterSpacing: '0.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <span>📅</span> {date}
          </div>
        </div>
        <RiskBadge category={analysis.category} confidence={analysis.confidence} />
      </div>

      <div style={{
        background: config.bg,
        backdropFilter: 'blur(10px)',
        padding: '16px',
        borderRadius: '12px',
        marginBottom: '16px',
        border: `1px solid ${config.color}30`,
        boxShadow: `inset 0 2px 8px ${config.glow}`,
      }}>
        <p style={{ 
          fontSize: '15px', 
          color: '#e2e8f0', 
          marginBottom: '0',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <strong style={{ 
            color: config.color,
            textShadow: `0 0 10px ${config.glow}`,
          }}>
            From:
          </strong> 
          {from}
        </p>
      </div>

      <p style={{ 
        fontSize: '14px', 
        color: '#cbd5e1', 
        marginBottom: '20px',
        lineHeight: 1.7,
        fontStyle: 'italic',
        paddingLeft: '12px',
        borderLeft: '3px solid rgba(99, 102, 241, 0.3)',
      }}>
        {snippet}
      </p>

      <div
        style={{
          display: 'flex',
          gap: '14px',
          fontSize: '12px',
          color: '#94a3b8',
          borderTop: '2px solid rgba(99, 102, 241, 0.2)',
          paddingTop: '18px',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ 
          display: 'flex', 
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          {[
            { label: 'Risk', value: analysis.risk_score, icon: '📊', color: '#6366f1' },
            { label: 'ML', value: `${analysis.ml_probability}%`, icon: '🤖', color: '#8b5cf6' },
            { label: 'URLs', value: analysis.url_count, icon: '🔗', color: '#ec4899' },
            { label: 'Urgency', value: analysis.urgency_level, icon: '⚡', color: '#f59e0b' },
          ].map((stat, idx) => (
            <span 
              key={idx}
              style={{
                background: `${stat.color}20`,
                padding: '8px 16px',
                borderRadius: '25px',
                fontWeight: 700,
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.3s ease',
                border: `1px solid ${stat.color}40`,
                boxShadow: `0 0 15px ${stat.color}30`,
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.08) translateY(-2px)'
                e.target.style.boxShadow = `0 0 25px ${stat.color}50`
                e.target.style.background = `${stat.color}30`
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)'
                e.target.style.boxShadow = `0 0 15px ${stat.color}30`
                e.target.style.background = `${stat.color}20`
              }}
            >
              <span style={{ fontSize: '16px' }}>{stat.icon}</span>
              <span>{stat.label}:</span>
              <strong>{stat.value}</strong>
            </span>
          ))}
        </div>

        <button
          style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
            color: '#fff',
            border: 'none',
            fontSize: 14,
            padding: '12px 24px',
            borderRadius: '25px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)',
            transition: 'all 0.3s ease',
            whiteSpace: 'nowrap',
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
          }}
          onClick={(e) => {
            e.stopPropagation()
            onView && onView(email.id)
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = 'scale(1.08) translateY(-2px)'
            e.target.style.boxShadow = '0 0 30px rgba(99, 102, 241, 0.7)'
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'scale(1)'
            e.target.style.boxShadow = '0 0 20px rgba(99, 102, 241, 0.5)'
          }}
        >
          👁️ View Details
        </button>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
      `}</style>
    </div>
  )
}

export default EmailCard