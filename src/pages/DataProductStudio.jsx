import { useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext'
import PageHeader from '../components/common/PageHeader'
import Badge from '../components/common/Badge'

export default function DataProductStudio() {
  const { dataProducts } = useData()
  const navigate = useNavigate()
  const dp = dataProducts[0]
  if (!dp) return null

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Home', to: '/command-center' }, { label: 'Step 3 · Shift to BDC Data Products' }, { label: 'InfoProvider Mapper', to: '/infoprovider-mapper' }, { label: 'Data Product Studio' }]}
        title="BDC Data Product Studio"
        sub={`Step 3 · Define semantic layer, KPIs, data catalogue, business glossary and governance certification for ${dp.name}`}
        actions={<>
          <button className="btn btn-ghost btn-sm" onClick={() => navigate('/data-quality')}>Test Quality →</button>
          <button className="btn btn-primary btn-sm">📤 Publish to Governance</button>
        </>}
      />

      <div className="grid-2 mb-12">
        <div className="card">
          <div className="card-title mb-12">Product Profile</div>
          <div style={{display:'grid',gridTemplateColumns:'120px 1fr',gap:8,fontSize:12.5}}>
            {[
              ['Product Name', dp.name],
              ['Product ID',   dp.id],
              ['Domain',       dp.domain],
              ['BDC Space',    dp.bdcSpace],
              ['Owner',        dp.owner],
              ['Steward',      dp.steward],
              ['Version',      dp.version],
            ].map(([k,v]) => (
              <><div key={k+'-k'} className="text-muted">{k}</div><div key={k+'-v'} className={k === 'Product ID' ? 'mono' : ''}>{v}</div></>
            ))}
            <div className="text-muted">Certification</div><div><Badge status={dp.certificationStatus} /></div>
            <div className="text-muted">Tags</div><div>{dp.tags.map(t => <span key={t} className="tag">{t}</span>)}</div>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><span className="card-title">KPI Definitions</span><button className="btn btn-ghost btn-sm">+ Add KPI</button></div>
          <table className="data-table">
            <thead><tr><th>KPI Name</th><th>Formula</th><th>Certified</th></tr></thead>
            <tbody>
              {dp.kpis.map((kpi,i) => (
                <tr key={i}>
                  <td>{kpi.name}</td>
                  <td className="mono" style={{fontSize:10}}>{kpi.formula}</td>
                  <td><Badge status={kpi.certified ? 'Done' : 'In Progress'} label={kpi.certified ? '✓' : 'Draft'} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid-3">
        <div className="card">
          <div className="card-title mb-12">Business Glossary Terms</div>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {dp.glossaryTerms.map((t,i) => (
              <div key={i} style={{padding:8,background: t.approved ? 'var(--bg)' : 'var(--blue-lite)',borderRadius:6,border: t.approved ? 'none' : '1px solid #c3d9ff'}}>
                <div className="font-bold text-sm" style={{color: t.approved ? 'var(--text)' : 'var(--blue-dark)'}}>
                  {!t.approved && '⚠ '}{t.term}
                </div>
                <div className="text-muted mt-4">{t.definition}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-title mb-12">Quality Rules</div>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {dp.qualityRules.map((r,i) => (
              <div key={i} className="flex-between" style={{padding:8,background: r.result === 'Warn' ? 'var(--orange-lite)' : 'var(--bg)',borderRadius:6}}>
                <div>
                  <div className="font-bold text-sm">{r.name}</div>
                  <div className="text-muted">{r.description}</div>
                </div>
                <Badge status={r.result} label={r.result === 'Pass' ? `Pass ${r.score}%` : r.result} />
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card-title mb-12">Certification Workflow</div>
          <div style={{display:'flex',flexDirection:'column',gap:10}}>
            {dp.certificationSteps.map((step, i) => {
              const dotClass = step.status === 'Approved' ? 'dot-green' : step.status === 'In Progress' ? 'dot-orange' : 'dot-gray'
              return (
                <div key={i}>
                  <div className="flex-center gap-8">
                    <div className={`dot ${dotClass}`} />
                    <div>
                      <div className="font-bold text-sm">{step.step}</div>
                      <div className="text-muted">{step.assignee} — {step.status}{step.date ? ` · ${step.date}` : ''}</div>
                    </div>
                  </div>
                  {i < dp.certificationSteps.length - 1 && (
                    <div style={{width:2,height:16,background: step.status === 'Approved' ? 'var(--green)' : '#d9d9d9',marginLeft:4,borderRadius:1}} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
