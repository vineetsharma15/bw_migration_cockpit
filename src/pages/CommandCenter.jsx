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
        sub={`Data Estate Modernization — SAP BW (${dashboard.system.id}) → SAP Business Data Cloud · Powered by Infosys Topaz Agentic Framework · Last scan: ${new Date(dashboard.system.lastScan).toLocaleString()}`}
        actions={<>
          <button className="btn btn-ghost btn-sm">📤 Export Report</button>
          <button className="btn btn-primary btn-sm">▶ Run Full Assessment</button>
        </>}
      />

      {/* Migration Journey */}
      <div className="card mb-12" style={{background:'linear-gradient(135deg,#1a2233,#162a4a)',border:'none'}}>
        <div style={{fontSize:11,fontWeight:700,color:'#5a8fc8',textTransform:'uppercase',letterSpacing:'.08em',marginBottom:12}}>The Migration Journey — Where AI Accelerates Every Step</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(5,1fr)',gap:0}}>
          {[
            { step:'Step 1', title:'Assess & Plan', ai:'System scan, lineage analysis & Documentation', icon:'📋', color:'#0070f2', to:'/bw-discovery' },
            { step:'Step 2', title:'Lift to BW PCE', ai:'Accelerate Shift and assure quality of migration', icon:'☁', color:'#2b7a0b', optional:true, to:'/pce-planner' },
            { step:'Step 3', title:'Shift to BDC Data Products', ai:'Re-architecture with confidence', icon:'📦', color:'#6200ea', to:'/extractor-cds' },
            { step:'Step 4A', title:'AI Driven Consumption', ai:'NL queries & auto-insights', icon:'📈', color:'#0070f2', to:'/ai-copilot' },
            { step:'Step 4B', title:'Autonomous Insights to Action', ai:'Autonomous actions', icon:'🤖', color:'#e9730c', to:'/action-center' },
          ].map((s, i) => (
            <div key={i} style={{display:'flex',alignItems:'flex-start',gap:0}}>
              <div
                onClick={() => navigate(s.to)}
                style={{flex:1,padding:'12px 14px',background:'rgba(255,255,255,0.05)',borderRadius:8,cursor:'pointer',transition:'background .15s',border:`1px solid rgba(255,255,255,0.08)`}}
                onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,0.1)'}
                onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,0.05)'}
              >
                <div style={{fontSize:20,marginBottom:6}}>{s.icon}</div>
                <div style={{fontSize:9,fontWeight:700,color:'#5a8fc8',textTransform:'uppercase',marginBottom:2}}>{s.step}{s.optional && ' · Optional'}</div>
                <div style={{fontSize:11.5,fontWeight:700,color:'#e0e8f5',marginBottom:6,lineHeight:1.3}}>{s.title}</div>
                <div style={{fontSize:10,padding:'3px 8px',background:s.color+'30',borderRadius:10,color:s.color,display:'inline-block',lineHeight:1.4}}>{s.ai}</div>
              </div>
              {i < 4 && <div style={{width:24,display:'flex',alignItems:'center',justifyContent:'center',paddingTop:28,flexShrink:0,color:'#3a5070',fontSize:16}}>→</div>}
            </div>
          ))}
        </div>
      </div>

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
