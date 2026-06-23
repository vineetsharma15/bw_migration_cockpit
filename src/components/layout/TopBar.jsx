import { useNavigate } from 'react-router-dom'

export default function TopBar() {
  const navigate = useNavigate()
  return (
    <header className="topbar">
      <div className="topbar-logo">
        <span>🔷</span>
        <span>Migration Cockpit</span>
        <span className="sub">BW / HANA → BDC</span>
        <span className="topbar-badge">PROTOTYPE</span>
      </div>
      <div className="topbar-search">
        <input type="text" placeholder="🔍  Search objects, queries, agents..." />
      </div>
      <div className="topbar-right">
        <span className="env-badge">PRD-BW-01  ▾</span>
        <button className="copilot-btn" onClick={() => navigate('/ai-copilot')}>✦ Copilot</button>
        <div className="icon-btn">🔔<span className="notif-dot" /></div>
        <div className="icon-btn">⚙</div>
        <div className="avatar">VS</div>
      </div>
    </header>
  )
}
