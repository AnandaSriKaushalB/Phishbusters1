// src/pages/AnalyticsPage.jsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'

const CATEGORY_COLORS = {
  Safe: '#22c55e',
  Suspicious: '#eab308',
  Fraudulent: '#ef4444',
}

function AnalyticsPage() {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [emails, setEmails] = useState([])
  const [loading, setLoading] = useState(false)

  const [manualText, setManualText] = useState('')
  const [manualResult, setManualResult] = useState(null)
  const [classifying, setClassifying] = useState(false)

  

  useEffect(() => {
    if (!isAuthenticated) navigate('/dashboard')
  }, [isAuthenticated, navigate])

  const fetchEmails = async () => {
    setLoading(true)
    try {
      const res = await api.get('/api/emails', { params: { max_results: 30 } })
      setEmails(res.data.emails || [])
    } catch (err) {
      console.error(err)
      alert('Failed to load analytics data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmails()
  }, [])

  // called from your existing detail view when a mail is opened
  // push {id, subject, category}
 

  // chart data
  const categoryCounts = ['Safe', 'Suspicious', 'Fraudulent'].map((c) => ({
    name: c,
    value: emails.filter((e) => e.analysis.category === c).length,
  }))

  const riskData = emails.map((e, idx) => ({
    name: `#${idx + 1}`,
    risk: e.analysis.risk_score,
  }))

  const avgUrl =
    emails.length > 0
      ? emails.reduce((s, e) => s + (e.analysis.url_count || 0), 0) / emails.length
      : 0

  const handleManualAnalyze = async () => {
    if (!manualText.trim()) return
    setClassifying(true)
    setManualResult(null)
    try {
      const res = await api.post('/api/analyze', { text: manualText })
      setManualResult(res.data.analysis)
    } catch (err) {
      console.error(err)
      alert('Failed to analyze text')
    } finally {
      setClassifying(false)
    }
  }

  return (
    <div style={{ padding: '24px 18px', maxWidth: 1200, margin: '0 auto' }}>
      {/* Header with back + refresh */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/dashboard')}
            style={{ padding: '6px 14px', fontSize: 13 }}
          >
            ← Back to emails
          </button>
          <h2 className="heading-gradient" style={{ margin: 0 }}>
            Analytics & Live Insights
          </h2>
        </div>

        <button
          className="btn btn-secondary"
          onClick={fetchEmails}
          disabled={loading}
        >
          {loading ? 'Refreshing…' : 'Refresh from Gmail'}
        </button>
      </div>

      {/* Top: pie + bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1.3fr)',
          gap: 20,
          marginBottom: 20,
          alignItems: 'stretch',
        }}
      >
        <div className="card card--hover">
          <h3 style={{ fontSize: 16, marginBottom: 6, color: '#e5e7eb' }}>
            Category Distribution
          </h3>
          <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 8 }}>
            Share of Safe, Suspicious, and Fraudulent emails in the latest batch.
          </p>
          <div style={{ width: '100%', height: 220 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={categoryCounts}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={2}
                >
                  {categoryCounts.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={CATEGORY_COLORS[entry.name] || '#64748b'}
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: '#020617',
                    border: '1px solid rgba(148,163,184,0.6)',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card card--hover">
          <h3 style={{ fontSize: 16, marginBottom: 6, color: '#e5e7eb' }}>
            Risk Score per Email
          </h3>
          <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 8 }}>
            Relative risk score of each analyzed email.
          </p>
          <div style={{ width: '100%', height: 220 }}>
            <ResponsiveContainer>
              <BarChart data={riskData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={11} />
                <YAxis stroke="#9ca3af" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: '#020617',
                    border: '1px solid rgba(148,163,184,0.6)',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="risk" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Middle: text classifier + small stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.6fr) minmax(0, 0.9fr)',
          gap: 20,
          marginBottom: 20,
        }}
      >
        <div className="card card--hover">
          <h3 style={{ fontSize: 16, marginBottom: 6, color: '#e5e7eb' }}>
            Try Custom Text
          </h3>
          <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 8 }}>
            Paste any email or message text to classify it as Safe, Suspicious, or
            Fraudulent.
          </p>
          <textarea
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            placeholder="Paste email content here..."
            style={{
              width: '100%',
              minHeight: 120,
              resize: 'vertical',
              borderRadius: 10,
              border: '1px solid rgba(148,163,184,0.6)',
              padding: 10,
              background: '#020617',
              color: '#e5e7eb',
              fontSize: 13,
              marginBottom: 8,
            }}
          />
          <button
            className="btn btn-primary"
            onClick={handleManualAnalyze}
            disabled={classifying}
          >
            {classifying ? 'Analyzing…' : 'Analyze Text'}
          </button>

          {manualResult && (
            <div
              style={{
                marginTop: 10,
                padding: '10px 12px',
                borderRadius: 12,
                background: 'rgba(15,23,42,0.9)',
                border: '1px solid rgba(148,163,184,0.6)',
                fontSize: 13,
                color: '#e5e7eb',
              }}
            >
              <div>
                <strong>Category:</strong> {manualResult.category}
              </div>
              <div>
                <strong>Risk Score:</strong> {manualResult.risk_score}
              </div>
              <div>
                <strong>ML Probability:</strong> {manualResult.ml_probability}%
              </div>
              <div>
                <strong>URLs:</strong> {manualResult.url_count} &nbsp;|&nbsp;
                <strong>Urgency:</strong> {manualResult.urgency_level}
              </div>
            </div>
          )}
        </div>

        <div className="card card--hover">
          <h3 style={{ fontSize: 16, marginBottom: 6, color: '#e5e7eb' }}>
            Snapshot
          </h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 13 }}>
            <li style={{ marginBottom: 6, color: '#cbd5f5' }}>
              <strong>Total analyzed:</strong> {emails.length}
            </li>
            <li style={{ marginBottom: 6, color: '#cbd5f5' }}>
              <strong>Avg URLs/email:</strong> {avgUrl.toFixed(2)}
            </li>
            <li style={{ marginBottom: 6, color: '#cbd5f5' }}>
              <strong>Safe / Suspicious / Fraudulent:</strong>{' '}
              {categoryCounts.map((c) => `${c.name}: ${c.value}`).join(' | ')}
            </li>
          </ul>
        </div>
      </div>

      
    </div>
  )
}

export default AnalyticsPage
