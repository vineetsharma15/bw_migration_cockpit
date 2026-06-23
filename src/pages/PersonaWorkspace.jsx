import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext'
import KPICard from '../components/common/KPICard'
import PageHeader from '../components/common/PageHeader'

const PERSONAS = ['Migration Lead', 'Executive Sponsor', 'BW Architect', 'Data Product Owner', 'Business User']

const INSIGHTS = {
  'Migration Lead': [
    { type: 'risk', title: 'Wave 1 at Risk', color: 'var(--blue)', text: 'ZFI_CUSTOM_03 is blocked due to unresolved dependency. Current ETA miss: 3 days. AI suggests reassigning 12 objects from Priya to the unblocked track.', action: '/action-center', actionLabel: 'View Action' },
    { type: 'win',  title: 'Quick Win Opportunity', color: 'var(--green)', text: '62 ADSOs with zero usage confirmed for retirement. Approving them now removes 18% of scope from Wave 2 planning.', action: '/rationalization', actionLabel: 'Approve in Rationalization' },
    { type: 'warn', title: 'Finance DQ Alert', color: 'var(--orange)', text: 'Finance Core data product quality score dropped to 76% (threshold: 80%). Timeliness rule failing since Jun 17 04:00.', action: '/data-quality', actionLabel: 'View Quality Center' },
  ],
  'Executive Sponsor': [
    { type: 'win', title: 'TCO Savings on Track', color: 'var(--green)', text: 'Projected 3-year savings of $3.8M on track. Wave 1 completion will lock in $1.2M of Year 1 savings.', action: '/tco-calculator', actionLabel: 'View TCO' },
  ],
}

export default function PersonaWorkspace() {
  const { waves, dashboard } = useData()
  const navigate = useNavigate()
  const [persona, setPersona] = useState('Migration Lead')
  const w1 = waves?.[0]
  const insights = INSIGHTS[persona] ?? []

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Home', to: '/command-center' }, { label: 'AI Consumption Hub' }]}
        title="Persona Insight Workspace"
        sub="Role-specific view of migration insights, KPI dashboards and AI recommendations"
        actions={
          <select value={persona} onChange={e => setPersona(e.target.value)}>
            {PERSONAS.map(p => <option key={p}>{p}</option>)}
          </select>
        }
      />

      {persona === 'Migration Lead' && w1 && (
        <div className="grid-4 mb-12">
          <KPICard label="My Wave Progress"        value={<span style={{color:'var(--blue)'}}>{w1.progress}%</span>} sub={`Wave 1 · ${w1.doneObjects}/${w1.totalObjects} objects`} barPct={w1.progress} />
          <KPICard label="Objects Assigned to Me"  value={128} sub="34 pending decision" />
          <KPICard label="Blockers"                value={<span style={{color:'var(--red)'}}>{w1.blockers}</span>} sub="ZFI_CUSTOM_03 · 0SD_C03" />
          <KPICard label="Next Milestone"          value={<span style={{fontSize:16}}>Jul 15</span>} sub="Wave 1 go-live · 26 days" />
        </div>
      )}

      {persona === 'Executive Sponsor' && (
        <div className="grid-4 mb-12">
          <KPICard label="Migration Readiness"  value={<span style={{color:'var(--blue)'}}>{dashboard?.readinessScore}%</span>} barPct={dashboard?.readinessScore} />
          <KPICard label="3-Year Savings"       value="$3.8M" sub="37% TCO reduction" />
          <KPICard label="Open High Risks"      value={<span style={{color:'var(--red)'}}>{dashboard?.openRisks.high}</span>} />
          <KPICard label="Waves Completed"      value="0 / 4" sub="Wave 1 in progress" />
        </div>
      )}

      <div className="grid-2 mb-12">
        <div className="card">
          <div className="card-title mb-12">Insight Cards</div>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {insights.length === 0 && <div className="text-muted">No insights configured for this persona yet.</div>}
            {insights.map((ins, i) => (
              <div key={i} style={{padding:12,background:'var(--blue-lite)',borderRadius:8,borderLeft:`4px solid ${ins.color}`}}>
                <div className="font-bold text-sm" style={{color: ins.color === 'var(--green)' ? 'var(--green)' : ins.color === 'var(--orange)' ? 'var(--orange)' : 'var(--blue-dark)'}}>{ins.title}</div>
                <div className="text-muted mt-4">{ins.text}</div>
                <div className="mt-8"><button className="btn btn-primary btn-sm" onClick={() => navigate(ins.action)}>{ins.actionLabel}</button></div>
              </div>
            ))}
          </div>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          <div className="card">
            <div className="card-title mb-12">Recommended Questions</div>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {[
                'What is the critical path to Wave 1 completion?',
                'Which Wave 2 objects have unresolved extractors?',
                'Show me all open risks with High severity',
              ].map(q => (
                <div key={q} style={{padding:10,border:'1px solid var(--border)',borderRadius:6,cursor:'pointer'}} onClick={() => navigate('/ai-copilot')}>
                  <div className="font-bold text-sm">{q}</div>
                  <div className="text-muted mt-4">Click to ask in Copilot</div>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-title mb-8">Saved Insights</div>
            <div style={{display:'flex',flexDirection:'column',gap:6,fontSize:12}}>
              {['Finance DQ Root Cause Analysis', 'Wave 1 Progress Summary', 'TCO Comparison — BDC vs PCE'].map((item, i) => (
                <div key={i} className="flex-between">
                  <span>{item}</span>
                  <span className="text-muted">Jun {18-i}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
