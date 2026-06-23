import { useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext'
import KPICard from '../components/common/KPICard'
import PageHeader from '../components/common/PageHeader'
import Badge from '../components/common/Badge'

export default function DataQuality() {
  const { dataProducts } = useData()
  const navigate = useNavigate()
  const dp = dataProducts[0]
  if (!dp) return null
  const rules = dp.qualityRules
  const overall = Math.round(rules.reduce((s,r) => s + r.score, 0) / rules.length)

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Home', to: '/command-center' }, { label: 'Data Product Studio' }]}
        title="Data Quality Assurance Center"
        sub="Profile source and target data · Score quality · Remediate issues"
        actions={<>
          <button className="btn btn-ghost btn-sm">🔄 Run Profile</button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/action-center')}>Create Remediation Action →</button>
        </>}
      />

      <div className="grid-4 mb-12">
        <KPICard label="Overall Quality Score" value={<span style={{color: overall >= 80 ? 'var(--green)' : 'var(--orange)'}}>{overall}<span style={{fontSize:16}}>%</span></span>}
          barPct={overall} barColor={overall >= 80 ? 'green' : 'orange'} trend={overall < 80 ? 'Below threshold (80%)' : 'Above threshold'} trendType={overall < 80 ? 'warn' : 'up'} />
        {rules.map(r => (
          <KPICard key={r.name} label={r.name} value={<span style={{color: r.result === 'Pass' ? 'var(--green)' : r.result === 'Warn' ? 'var(--orange)' : 'var(--red)'}}>{r.score}%</span>}
            barPct={r.score} barColor={r.result === 'Pass' ? 'green' : r.result === 'Warn' ? 'orange' : 'red'} />
        ))}
      </div>

      <div className="grid-split mb-12">
        <div className="card">
          <div className="card-title mb-12">Quality Rule Results</div>
          <table className="data-table">
            <thead><tr><th>Rule</th><th>Dimension</th><th>Records Checked</th><th>Failures</th><th>Score</th></tr></thead>
            <tbody>
              {[
                { rule:'NETWR not null',         dim:'Completeness', checked:'348,291', fail:'6,842', score:98,  result:'Pass' },
                { rule:'No duplicate doc+item',  dim:'Uniqueness',   checked:'348,291', fail:'0',     score:100, result:'Pass' },
                { rule:'Recon: Total vs GL',      dim:'Accuracy',     checked:'1',       fail:'0',     score:100, result:'Pass' },
                { rule:'Data lag < 4 hours',      dim:'Timeliness',   checked:'1',       fail:'1',     score:0,   result:'Fail' },
                { rule:'KUNNR referential integrity',dim:'Consistency',checked:'348,291',fail:'1,240', score:99,  result:'Warn' },
              ].map((r,i) => (
                <tr key={i}>
                  <td>{r.rule}</td><td>{r.dim}</td><td>{r.checked}</td><td>{r.fail}</td>
                  <td><Badge status={r.result} label={r.result === 'Pass' ? `${r.score}%` : r.result} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          <div className="ai-panel">
            <div className="ai-panel-header"><span className="ai-label">AI</span> Root Cause Analysis</div>
            <div className="ai-rec"><span className="ai-rec-icon">🔍</span><div className="ai-rec-text"><strong>Timeliness issue:</strong> Process chain PC_FI_DELTA runs every 4h but has a 2h post-processing step pushing effective lag to 6h. Recommend splitting delta and aggregation steps.<span className="conf-pill">89%</span></div></div>
            <div className="ai-rec"><span className="ai-rec-icon">🔍</span><div className="ai-rec-text"><strong>NETWR nulls:</strong> 6,842 records from legacy migration batch 2019-Q1 have null NETWR. These are historical records with zero invoice value — can be excluded from quality scope.<span className="conf-pill">95%</span></div></div>
            <div className="ai-rec"><span className="ai-rec-icon">⚡</span><div className="ai-rec-text"><strong>Fix Suggestion:</strong> Restructure PC_FI_DELTA to run delta load every 2h and aggregation nightly. Estimated lag reduction to &lt; 2h.</div></div>
          </div>
          <div className="btn-group">
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/action-center')}>Create Action: Fix PC_FI_DELTA</button>
            <button className="btn btn-ghost btn-sm">Mark as Accepted Risk</button>
          </div>
        </div>
      </div>
    </>
  )
}
