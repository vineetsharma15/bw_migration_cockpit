import { useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext'
import KPICard from '../components/common/KPICard'
import PageHeader from '../components/common/PageHeader'
import Badge from '../components/common/Badge'

const statusColor = { 'On Track': 'green', 'Partial': 'orange', 'In Review': 'orange', 'Analyzing': '' }

export default function CommandCenter() {
  const { dashboard, waves } = useData()
  const navigate = useNavigate()
  if (!dashboard) return null

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Home' }]}
        title="Migration Command Center"
        sub={`SAP BW (${dashboard.system.id}) → SAP Business Data Cloud · Landscape scan: ${new Date(dashboard.system.lastScan).toLocaleString()}`}
        actions={<>
          <button className="btn btn-ghost btn-sm">📤 Export Report</button>
          <button className="btn btn-primary btn-sm">▶ Run Full Assessment</button>
        </>}
      />

      {/* KPIs */}
      <div className="grid-4 mb-12">
        <KPICard label="Migration Readiness" value={<>{dashboard.readinessScore}<span style={{fontSize:16}}>%</span></>}
          barPct={dashboard.readinessScore} trend={`↑ +${dashboard.readinessDelta}% vs last scan`} trendType="up" />
        <KPICard label="BW Objects" value={dashboard.totalObjects.toLocaleString()}
          sub="ADSOs · Queries · Extractors · PChs" trend={`⚠ ${dashboard.pendingDecisions} require decision`} trendType="warn" />
        <KPICard label="Migration Waves" value={waves.length}
          sub="Wave 1 in progress · 3 planned"
          barPct={28} barColor="green" trend="28% complete" trendType="up" />
        <KPICard label="Open Risks" value={<span style={{color:'var(--red)'}}>{dashboard.openRisks.total}</span>}
          sub={`${dashboard.openRisks.high} High · ${dashboard.openRisks.medium} Medium · ${dashboard.openRisks.low} Low`}
          trend="↑ 3 new since last week" trendType="down" />
      </div>

      <div className="grid-split mb-12">
        {/* Object Inventory */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">BW Object Inventory</span>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/bw-discovery')}>View Discovery →</button>
          </div>
          <table className="data-table">
            <thead><tr><th>Object Type</th><th>Total</th><th>Migrate</th><th>Retire</th><th>Pending</th><th>Status</th></tr></thead>
            <tbody>
              {dashboard.objectInventory.map(row => (
                <tr key={row.type}>
                  <td>{row.type}</td>
                  <td>{row.total.toLocaleString()}</td>
                  <td className="font-bold" style={{color:'var(--green)'}}>{row.migrate}</td>
                  <td style={{color:'var(--red)'}}>{row.retire}</td>
                  <td style={{color:'var(--orange)'}}>{row.pending}</td>
                  <td><Badge status={row.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* AI Recommendations */}
        <div className="ai-panel">
          <div className="ai-panel-header"><span className="ai-label">AI</span> Agent Recommendations</div>
          {dashboard.aiRecommendations.map((rec, i) => (
            <div className="ai-rec" key={i}>
              <span className="ai-rec-icon">{rec.icon}</span>
              <div className="ai-rec-text">
                <strong>{rec.priority}:</strong> {rec.text}
                <span className="conf-pill">{rec.confidence}% conf</span>
              </div>
            </div>
          ))}
          <div className="mt-12 btn-group">
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/action-center')}>Review Actions</button>
            <button className="btn btn-ghost btn-sm">Dismiss All</button>
          </div>
        </div>
      </div>

      <div className="grid-2">
        {/* Wave Progress */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Migration Wave Progress</span>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/wave-planner')}>Wave Planner →</button>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:14}}>
            {waves.map(w => (
              <div key={w.id}>
                <div className="flex-between mb-4">
                  <span className="text-sm font-bold">{w.name}</span>
                  <Badge status={w.status} />
                </div>
                <div className="progress-bar">
                  <div className={`progress-fill ${w.progress > 0 ? (w.status === 'In Progress' ? 'green' : 'orange') : ''}`}
                    style={{width:`${w.progress}%`}} />
                </div>
                <div className="flex-between mt-4 text-muted">
                  <span>{w.progress}% · {w.doneObjects}/{w.totalObjects} objects</span>
                  <span>Target: {w.targetDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Risks */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Top Risks</span>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/action-center')}>Action Center →</button>
          </div>
          <table className="data-table">
            <thead><tr><th>Risk</th><th>Severity</th><th>Owner</th></tr></thead>
            <tbody>
              {dashboard.topRisks.map((r, i) => (
                <tr key={i}>
                  <td>{r.description}</td>
                  <td><Badge status={r.severity} /></td>
                  <td>{r.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
