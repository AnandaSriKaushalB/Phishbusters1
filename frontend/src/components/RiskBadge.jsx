function RiskBadge({ category, confidence }) {
  const colors = {
    Safe: { bg: '#e6f4ea', text: '#137333', border: '#34a853' },
    Suspicious: { bg: '#fef7e0', text: '#b36200', border: '#f9ab00' },
    Fraudulent: { bg: '#fce8e6', text: '#c5221f', border: '#ea4335' },
  }

  const style = colors[category] || colors.Safe

  return (
    <span style={{
      display: 'inline-block',
      padding: '4px 12px',
      borderRadius: '16px',
      fontSize: '14px',
      fontWeight: '600',
      backgroundColor: style.bg,
      color: style.text,
      border: `1px solid ${style.border}`,
    }}>
      {category} ({confidence}%)
    </span>
  )
}

export default RiskBadge
