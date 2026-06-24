import { useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext'
import PageHeader from '../components/common/PageHeader'
import Badge from '../components/common/Badge'

const domainColor = { 'Finance Core': 'badge-green', 'Sales Analytics': 'badge-orange', 'HR Analytics': 'badge-purple' }
const borderColor = { 'Finance Core': 'var(--green)', 'Sales Analytics': 'var(--orange)', 'HR Analytics': 'var(--purple)' }

export default function InfoProviderMapper() {
  const { bwObjects, dataProducts } = useData()
  const navigate = useNavigate()

  const clusters = {
    'Finance Core':    bwObjects.filter(o => ['0FI_GL_4','0FI_AP_4','0PROFIT_CTR_01A'].includes(o.id)),
    'Sales Analytics': bwObjects.filter(o => ['ZSD_BILLING_A'].includes(o.id)),
    'HR Analytics':    bwObjects.filter(o => ['ZHR_HEADCOUNT'].includes(o.id)),
  }

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Home', to: '/command-center' }, { label: 'Step 3 · Shift to BDC Data Products' }]}
        title="InfoProvider → Data Product Mapper"
        sub="Step 3 · Re-architecture with confidence — Map BW InfoProviders into governed BDC data products with AI clustering"
        actions={<>
          <button className="btn btn-ghost btn-sm">← Back to Discovery</button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/data-product-studio')}>Approve Mapping → Data Product Studio</button>
        </>}
      />

      <div className="approval-banner">
        🤖 <strong>AI has clustered 14 Finance InfoProviders</strong> into 3 proposed BDC data products. Please review and approve the groupings.
        <span className="conf-pill" style={{marginLeft:8}}>Avg confidence: 87%</span>
      </div>

      <div className="grid-split">
        <div className="card">
          <div className="card-header"><span className="card-title">Source InfoProviders</span><Badge status="Selected" label="6 selected" /></div>
          <table className="data-table">
            <thead><tr><th>InfoProvider</th><th>Type</th><th>Rows</th><th>AI Cluster</th></tr></thead>
            <tbody>
              {bwObjects.filter(o => ['0FI_GL_4','0FI_AP_4','0PROFIT_CTR_01A','ZSD_BILLING_A','ZHR_HEADCOUNT'].includes(o.id)).map(obj => {
                const cluster = Object.entries(clusters).find(([,v]) => v.some(x => x.id === obj.id))?.[0]
                return (
                  <tr key={obj.id} style={{background: cluster === 'Finance Core' ? 'var(--green-lite)' : cluster === 'Sales Analytics' ? 'var(--orange-lite)' : 'var(--purple-lite)'}}>
                    <td className="mono">{obj.id}</td>
                    <td>{obj.type}</td>
                    <td>{obj.rows ?? '—'}</td>
                    <td><span className={`badge ${domainColor[cluster]}`}>{cluster}</span></td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          {dataProducts.map(dp => (
            <div className="card" key={dp.id} style={{borderLeft:`4px solid ${borderColor[dp.name.replace(' Data Product','')] ?? 'var(--blue)'}` }}>
              <div className="flex-between mb-8">
                <div className="font-bold">{dp.name}</div>
                <Badge status="Selected" label={`${dp.sourceInfoProviders.length} InfoProviders`} />
              </div>
              <div className="text-muted mb-8">Domain: {dp.domain} · BDC Space: {dp.bdcSpace}</div>
              <div className="field-row" style={{padding:'6px 0'}}><span className="text-muted" style={{flex:'0 0 140px'}}>Business Domain</span><span>{dp.domain}</span></div>
              <div className="field-row" style={{padding:'6px 0'}}><span className="text-muted" style={{flex:'0 0 140px'}}>Sources</span><span className="mono" style={{fontSize:11}}>{dp.sourceInfoProviders.join(', ')}</span></div>
              <div className="field-row" style={{padding:'6px 0',border:'none'}}><span className="text-muted" style={{flex:'0 0 140px'}}>Proposed Owner</span><span>{dp.owner}</span></div>
              <button className="btn btn-ghost btn-sm mt-8" onClick={() => navigate('/data-product-studio')}>Configure in Studio →</button>
            </div>
          ))}
          <div className="ai-panel">
            <div className="ai-panel-header"><span className="ai-label">AI</span> Mapping Recommendation</div>
            <div className="ai-rec"><span className="ai-rec-icon">💡</span><div className="ai-rec-text">0FI_GL_4 and 0FI_AP_4 share 78% of dimensions. Consolidating into one Finance Core product reduces redundancy and simplifies governance.<span className="conf-pill">91%</span></div></div>
          </div>
        </div>
      </div>
    </>
  )
}
