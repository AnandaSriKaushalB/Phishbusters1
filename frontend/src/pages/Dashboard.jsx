// src/pages/Dashboard.jsx
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import EmailCard from '../components/EmailCard'


function Dashboard() {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()

  const [emails, setEmails] = useState([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState('all')

  const [selectedEmail, setSelectedEmail] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/')
    }
  }, [isAuthenticated, navigate])

  const fetchEmails = async () => {
    setLoading(true)
    try {
      const response = await api.get('/api/emails', {
        params: { max_results: 20 },
      })
      setEmails(response.data.emails || [])
    } catch (error) {
      console.error('Failed to fetch emails:', error)
      alert('Failed to fetch emails')
    } finally {
      setLoading(false)
    }
  }

  const openEmailDetail = async (messageId) => {
    setDetailLoading(true)
    try {
      const res = await api.get(`/api/emails/${messageId}`)
      setSelectedEmail(res.data)
    } catch (err) {
      console.error('Failed to load email details:', err)
      alert('Failed to load email details')
    } finally {
      setDetailLoading(false)
    }
  }

  const closeEmailDetail = () => setSelectedEmail(null)

  const filteredEmails = emails.filter((email) => {
    if (filter === 'all') return true
    return email.analysis.category === filter
  })

  const stats = {
    total: emails.length,
    safe: emails.filter((e) => e.analysis.category === 'Safe').length,
    suspicious: emails.filter((e) => e.analysis.category === 'Suspicious').length,
    fraudulent: emails.filter((e) => e.analysis.category === 'Fraudulent').length,
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#0a0e27',
      backgroundImage: 'url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1920&q=80)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      position: 'relative',
    }}>
      {/* Dark overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(135deg, rgba(10, 14, 39, 0.92) 0%, rgba(20, 25, 60, 0.88) 100%)',
        backdropFilter: 'blur(2px)',
      }} />

      <div style={{ 
        position: 'relative', 
        zIndex: 1, 
        padding: '24px',
      }}>
        {/* Header with glassmorphism */}
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '28px',
            marginBottom: '28px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(99, 102, 241, 0.3)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(99, 102, 241, 0.5)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(99, 102, 241, 0.3)'
          }}
        >
          <div>
            <h2 style={{ 
              marginBottom: 10,
              color: '#fff',
              fontSize: '32px',
              fontWeight: 800,
              textShadow: '0 0 20px rgba(99, 102, 241, 0.5)',
              background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #f472b6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              📧 Email Dashboard
            </h2>
            {user?.email && (
              <div style={{ 
                color: '#94a3b8', 
                fontSize: 15,
                fontWeight: 500,
                background: 'rgba(99, 102, 241, 0.1)',
                padding: '6px 14px',
                borderRadius: '20px',
                display: 'inline-block',
              }}>
                Signed in as <strong style={{ color: '#60a5fa' }}>{user.email}</strong>
              </div>
            )}
          </div>
          <button 
            onClick={fetchEmails} 
            disabled={loading}
            style={{
              background: loading ? 'rgba(71, 85, 105, 0.5)' : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #ec4899 100%)',
              color: '#fff',
              border: 'none',
              padding: '14px 32px',
              borderRadius: '16px',
              fontWeight: 700,
              fontSize: '15px',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 4px 20px rgba(99, 102, 241, 0.4)',
              transition: 'all 0.3s ease',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
            }}
            onMouseEnter={(e) => !loading && (e.target.style.transform = 'scale(1.05) translateY(-2px)', e.target.style.boxShadow = '0 8px 30px rgba(99, 102, 241, 0.6)')}
            onMouseLeave={(e) => !loading && (e.target.style.transform = 'scale(1)', e.target.style.boxShadow = '0 4px 20px rgba(99, 102, 241, 0.4)')}
          >
            {loading ? '⏳ Loading...' : '🔄 Fetch Emails'}
          </button>
        </div>

        {/* Stats Cards - Vibrant & Glowing */}
        {emails.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '24px',
              marginBottom: '28px',
            }}
          >
            {[
              { label: 'Total', value: stats.total, gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', glow: 'rgba(59, 130, 246, 0.4)', icon: '📊' },
              { label: 'Safe', value: stats.safe, gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', glow: 'rgba(16, 185, 129, 0.4)', icon: '✅' },
              { label: 'Suspicious', value: stats.suspicious, gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', glow: 'rgba(245, 158, 11, 0.4)', icon: '⚠️' },
              { label: 'Fraudulent', value: stats.fraudulent, gradient: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', glow: 'rgba(239, 68, 68, 0.4)', icon: '🚨' },
            ].map((stat, idx) => (
              <div
                key={idx}
                style={{
                  background: 'rgba(15, 23, 42, 0.7)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '20px',
                  padding: '28px',
                  textAlign: 'center',
                  boxShadow: `0 8px 32px ${stat.glow}, 0 0 0 1px rgba(255, 255, 255, 0.1)`,
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px) scale(1.02)'
                  e.currentTarget.style.boxShadow = `0 16px 48px ${stat.glow}, 0 0 0 1px rgba(255, 255, 255, 0.2)`
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)'
                  e.currentTarget.style.boxShadow = `0 8px 32px ${stat.glow}, 0 0 0 1px rgba(255, 255, 255, 0.1)`
                }}
              >
                {/* Gradient overlay */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '4px',
                  background: stat.gradient,
                  boxShadow: `0 0 20px ${stat.glow}`,
                }} />
                
                <div style={{ fontSize: '40px', marginBottom: '12px' }}>{stat.icon}</div>
                <div style={{ 
                  fontSize: '44px', 
                  fontWeight: 900,
                  background: stat.gradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  marginBottom: '8px',
                  textShadow: `0 0 30px ${stat.glow}`,
                }}>
                  {stat.value}
                </div>
                <div style={{ 
                  color: '#cbd5e1', 
                  fontWeight: 700, 
                  fontSize: '15px',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Filters - Neon Style */}
        <div
          style={{
            marginBottom: '24px',
            display: 'flex',
            gap: '14px',
            flexWrap: 'wrap',
          }}
        >
          {[
            { key: 'all', label: '🌐 All', color: '#60a5fa' },
            { key: 'Safe', label: '✅ Safe', color: '#10b981' },
            { key: 'Suspicious', label: '⚠️ Suspicious', color: '#f59e0b' },
            { key: 'Fraudulent', label: '🚨 Fraudulent', color: '#ef4444' },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                background: filter === f.key 
                  ? f.color
                  : 'rgba(15, 23, 42, 0.6)',
                backdropFilter: 'blur(10px)',
                color: '#fff',
                border: filter === f.key ? 'none' : `1px solid ${f.color}`,
                padding: '12px 26px',
                borderRadius: '30px',
                fontWeight: 700,
                fontSize: '14px',
                cursor: 'pointer',
                boxShadow: filter === f.key 
                  ? `0 0 20px ${f.color}80, 0 4px 15px rgba(0, 0, 0, 0.3)` 
                  : '0 2px 8px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.3s ease',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.08) translateY(-2px)'
                e.target.style.boxShadow = `0 0 25px ${f.color}80, 0 6px 20px rgba(0, 0, 0, 0.4)`
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)'
                e.target.style.boxShadow = filter === f.key 
                  ? `0 0 20px ${f.color}80, 0 4px 15px rgba(0, 0, 0, 0.3)` 
                  : '0 2px 8px rgba(0, 0, 0, 0.3)'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Email List */}
        <div>
          {filteredEmails.length === 0 && !loading && (
            <div style={{
              background: 'rgba(15, 23, 42, 0.7)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              padding: '50px',
              textAlign: 'center',
              color: '#94a3b8',
              fontSize: '16px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
            }}>
              {emails.length === 0
                ? '📭 Click "Fetch Emails" to load your emails'
                : '🔍 No emails match this filter'}
            </div>
          )}
          {filteredEmails.map((email) => (
            <EmailCard key={email.id} email={email} onView={openEmailDetail} />
          ))}
        </div>

        {/* Detail Modal - Dark Theme */}
        {selectedEmail && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 999,
              animation: 'fadeIn 0.3s ease',
            }}
            onClick={closeEmailDetail}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: 'rgba(15, 23, 42, 0.95)',
                backdropFilter: 'blur(20px)',
                borderRadius: '24px',
                maxWidth: '950px',
                width: '90%',
                maxHeight: '85vh',
                overflow: 'auto',
                padding: '36px',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(99, 102, 241, 0.3)',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                animation: 'slideUp 0.4s ease',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '24px',
                  paddingBottom: '16px',
                  borderBottom: '2px solid rgba(99, 102, 241, 0.3)',
                }}
              >
                <h3 style={{ 
                  margin: 0,
                  fontSize: '26px',
                  fontWeight: 800,
                  color: '#fff',
                  textShadow: '0 0 20px rgba(99, 102, 241, 0.5)',
                }}>
                  {selectedEmail.email.subject || '(no subject)'}
                </h3>
                <button 
                  onClick={closeEmailDetail}
                  style={{
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: '#fff',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontWeight: 700,
                    fontSize: '14px',
                    boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.05)'
                    e.target.style.boxShadow = '0 0 30px rgba(239, 68, 68, 0.6)'
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)'
                    e.target.style.boxShadow = '0 0 20px rgba(239, 68, 68, 0.4)'
                  }}
                >
                  ✕ Close
                </button>
              </div>

              {detailLoading && (
                <div style={{ marginBottom: '16px', color: '#94a3b8', fontStyle: 'italic' }}>
                  ⏳ Loading details...
                </div>
              )}

              <div style={{ 
                marginBottom: '24px', 
                fontSize: 14, 
                color: '#cbd5e1',
                background: 'rgba(99, 102, 241, 0.1)',
                padding: '20px',
                borderRadius: '16px',
                border: '1px solid rgba(99, 102, 241, 0.2)',
              }}>
                <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <strong style={{ color: '#60a5fa' }}>From:</strong> {selectedEmail.email.from}
                </div>
                <div style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <strong style={{ color: '#60a5fa' }}>To:</strong> {selectedEmail.email.to}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <strong style={{ color: '#60a5fa' }}>Date:</strong> {selectedEmail.email.date}
                </div>
              </div>

              <h4 style={{ color: '#fff', marginBottom: '14px', fontSize: '18px', fontWeight: 700 }}>
                📄 Full Message
              </h4>
              <pre
                style={{
                  whiteSpace: 'pre-wrap',
                  background: 'rgba(0, 0, 0, 0.6)',
                  color: '#e2e8f0',
                  padding: '24px',
                  borderRadius: '16px',
                  fontSize: 13,
                  lineHeight: 1.6,
                  maxHeight: '320px',
                  overflow: 'auto',
                  boxShadow: 'inset 0 2px 10px rgba(0, 0, 0, 0.5)',
                  border: '1px solid rgba(99, 102, 241, 0.2)',
                }}
              >
                {selectedEmail.email.body}
              </pre>

              <h4 style={{ marginTop: '28px', color: '#fff', marginBottom: '16px', fontSize: '18px', fontWeight: 700 }}>
                🔍 Behavioral and Content Analysis
              </h4>
              <table style={{ 
                width: '100%', 
                fontSize: 14, 
                borderCollapse: 'separate',
                borderSpacing: '0 10px'
              }}>
                <tbody>
                  {[
                    ['Category', selectedEmail.analysis.category],
                    ['Risk Score', selectedEmail.analysis.risk_score],
                    ['ML Probability (%)', selectedEmail.analysis.ml_probability],
                    ['Suspicious Keywords', selectedEmail.analysis.suspicious_keyword_count],
                    ['Urgency Tone', selectedEmail.analysis.urgency_tone],
                    ['URL Count', selectedEmail.analysis.url_count],
                    ['Word Count', selectedEmail.analysis.word_count],
                  ].map(([label, value], idx) => (
                    <tr key={idx} style={{
                      background: 'rgba(99, 102, 241, 0.08)',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.15)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(99, 102, 241, 0.08)'}
                    >
                      <td style={{ 
                        padding: '14px 20px', 
                        fontWeight: 700,
                        borderRadius: '12px 0 0 12px',
                        color: '#60a5fa',
                      }}>
                        {label}
                      </td>
                      <td style={{ 
                        padding: '14px 20px',
                        borderRadius: '0 12px 12px 0',
                        color: '#e2e8f0',
                        fontWeight: 600,
                      }}>
                        {value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from { 
              opacity: 0;
              transform: translateY(30px);
            }
            to { 
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    </div>
  )
}

export default Dashboard