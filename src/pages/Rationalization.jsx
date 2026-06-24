import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext'
import KPICard from '../components/common/KPICard'
import PageHeader from '../components/common/PageHeader'
import Badge from '../components/common/Badge'

const DECISIONS = ['Migrate', 'Retire', 'Consolidate', 'Redesign', 'Defer']

export default function Rationalization() {
  const { rationalization, updateDecision } = useData()
  const navigate = useNavigate()
  const [filter, setFilter] = useState('All')
  if (!rationalization) return null

  const { summary, objects } = rationalization
  const filtered = filter === 'All' ? objects : objects.filter(o => o.decision === filter)

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Home', to: '/command-center' }, { label: 'Step 1 · Assess & Plan' }]}
        title="AI-Driven Report Rationalization"
        sub="Step 1 Analysis Agent — Classify each BW object as Migrate, Retire, Consolidate, Redesign, or Defer with AI confidence scoring"
        actions={<>
          <button className="btn btn-ghost btn-sm">📤 Export Decisions</button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/wave-planner')}>Push to Wave Planner →</button>
        </>}
      />

      <div className="approval-banner">
        🤖 <strong>AI-Driven Report Rationalization Agent</strong> has pre-classified 89% of inventory. <strong>{summary.pending.count} objects</strong> await your final decision.
        <button className="btn btn-primary btn-sm" style={{marginLeft:'auto'}}>Review AI Decisions</button>
      </div>

      <div className="grid-4 mb-12">
        <KPICard label="Migrate"                value={<span style={{color:'var(--green)'}}>{summary.migrate.count.toLocaleString()}</span>}
          barPct={summary.migrate.pct} barColor="green" sub={`${summary.migrate.pct}% of inventory`} />
        <KPICard label="Retire"                 value={<span style={{color:'var(--red)'}}>{summary.retire.count}</span>}
          barPct={summary.retire.pct} barColor="red" sub={`${summary.retire.pct}% of inventory`} />
        <KPICard label="Consolidate / Redesign" value={<span style={{color:'var(--orange)'}}>{summary.consolidate.count}</span>}
          barPct={summary.consolidate.pct} barColor="orange" sub={`${summary.consolidate.pct}% of inventory`} />
        <KPICard label="Pending Decision"       value={<span style={{color:'#5a6d85'}}>{summary.pending.count}</span>}
          barPct={summary.pending.pct} barColor="" sub={`${summary.pending.pct}% — needs review`} />
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Object Classification</span>
          <div className="flex gap-8">
            <select value={filter} onChange={e => setFilter(e.target.value)}>
              <option value="All">All Decisions</option>
              {DECISIONS.map(d => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>
        <table className="data-table">
          <thead>
            <tr><th><input type="checkbox" /></th><th>Object</th><th>Type</th><th>Usage/mo</th><th>Complexity</th>
              <th>AI Recommendation</th><th>Confidence</th><th>Decision</th><th></th></tr>
          </thead>
          <tbody>
            {filtered.map(obj => (
              <tr key={obj.id}>
                <td><input type="checkbox" defaultChecked={obj.approved} /></td>
                <td className="mono">{obj.id}</td>
                <td><span className="tag">{obj.type}</span></td>
                <td>{obj.usagePerMonth?.toLocaleString() ?? 'N/A'}</td>
                <td><Badge status={obj.complexity} /></td>
                <td><Badge status={obj.aiDecision} /></td>
                <td>{obj.aiConfidence}%</td>
                <td>
                  <select
                    value={obj.decision}
                    onChange={e => updateDecision(obj.id, e.target.value)}
                  >
                    {DECISIONS.map(d => <option key={d}>{d}</option>)}
                  </select>
                </td>
                <td>
                  {obj.decision === 'Migrate' && (
                    <button className="btn btn-ghost btn-sm" onClick={() => navigate('/wave-planner')}>→ Wave</button>
                  )}
                  {obj.decision === 'Retire' && (
                    <button className="btn btn-danger btn-sm">Confirm</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
