import { useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { useState } from 'react'
import KPICard from '../components/common/KPICard'
import PageHeader from '../components/common/PageHeader'
import Badge from '../components/common/Badge'

export default function BWDiscovery() {
  const { bwObjects, dashboard } = useData()
  const navigate = useNavigate()
  const [typeFilter, setTypeFilter] = useState('All Types')
  const [decisionFilter, setDecisionFilter] = useState('All Decisions')

  const types = ['All Types', ...new Set(bwObjects.map(o => o.type))]
  const decisions = ['All Decisions', 'Migrate', 'Retire', 'Redesign', 'Convert', 'Defer', 'Pending']

  const filtered = bwObjects.filter(o =>
    (typeFilter === 'All Types' || o.type === typeFilter) &&
    (decisionFilter === 'All Decisions' || o.decision === decisionFilter)
  )

  const actionFor = (obj) => {
    if (obj.type === 'Extractor') return <button className="btn btn-ghost btn-sm" onClick={() => navigate('/extractor-cds')}>Convert</button>
    if (obj.type === 'BEx Query') return <button className="btn btn-ghost btn-sm" onClick={() => navigate('/query-analyzer')}>Analyze</button>
    return <button className="btn btn-ghost btn-sm" onClick={() => navigate('/dependency-explorer')}>Lineage</button>
  }

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Home', to: '/command-center' }, { label: 'Step 1 · Assess & Plan' }]}
        title="BW Landscape Discovery"
        sub="Agentic DW System Analysis — scan BW system to inventory objects, data volumes, usage patterns and lineage"
        actions={<>
          <button className="btn btn-ghost btn-sm">📤 Export Inventory</button>
          <button className="btn btn-primary btn-sm">🔄 Rescan System</button>
        </>}
      />

      {/* System Connection */}
      <div className="card mb-12">
        <div className="card-header">
          <span className="card-title">System Connection</span>
          <Badge status="Running" label="● Connected" />
        </div>
        <div className="grid-4" style={{gap:12,alignItems:'end'}}>
          <div><div className="text-muted mb-4">System ID</div>
            <select><option>{dashboard?.system.label}</option></select>
          </div>
          <div><div className="text-muted mb-4">Host</div><div className="font-bold text-sm">{dashboard?.system.host}</div></div>
          <div><div className="text-muted mb-4">BW Release</div><div className="font-bold text-sm">{dashboard?.system.release}</div></div>
          <div><div className="text-muted mb-4">DB Size</div><div className="font-bold text-sm">{dashboard?.system.dbSize}</div></div>
        </div>
        <div className="mt-12">
          <div className="text-muted mb-4" style={{fontSize:11}}>Last Full Scan</div>
          <div className="progress-bar"><div className="progress-fill green" style={{width:'100%'}} /></div>
          <div className="text-muted mt-4">Completed · {dashboard?.totalObjects.toLocaleString()} objects discovered</div>
        </div>
      </div>

      <div className="grid-4 mb-12">
        <KPICard label="Total Objects"    value={dashboard?.totalObjects.toLocaleString()} barPct={100} />
        <KPICard label="Active Objects"   value={<span style={{color:'var(--green)'}}>{dashboard?.activeObjects.toLocaleString()}</span>} sub="used in last 12 months" />
        <KPICard label="Inactive Objects" value={<span style={{color:'var(--red)'}}>{dashboard?.inactiveObjects}</span>} sub="retirement candidates" />
        <KPICard label="Custom Code %"    value={<>{dashboard?.customCodePct}<span style={{fontSize:16}}>%</span></>} sub="objects with custom ABAP" />
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Object Inventory</span>
          <div className="flex gap-8">
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
              {types.map(t => <option key={t}>{t}</option>)}
            </select>
            <select value={decisionFilter} onChange={e => setDecisionFilter(e.target.value)}>
              {decisions.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>
        <table className="data-table">
          <thead><tr><th>Object Name</th><th>Type</th><th>Package</th><th>Owner</th><th>Last Used</th><th>Usage/mo</th><th>Complexity</th><th>Decision</th><th>Action</th></tr></thead>
          <tbody>
            {filtered.map(obj => (
              <tr key={obj.id}>
                <td className="mono">{obj.id}</td>
                <td><span className="tag">{obj.type}</span></td>
                <td>{obj.package}</td>
                <td>{obj.owner}</td>
                <td>{obj.lastUsed}</td>
                <td>{obj.usagePerMonth?.toLocaleString() ?? 'N/A'}</td>
                <td><Badge status={obj.complexity} /></td>
                <td><Badge status={obj.decision} /></td>
                <td>{actionFor(obj)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
