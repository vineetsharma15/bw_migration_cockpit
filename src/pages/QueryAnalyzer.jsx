import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext'
import PageHeader from '../components/common/PageHeader'
import Badge from '../components/common/Badge'

export default function QueryAnalyzer() {
  const { queries } = useData()
  const navigate = useNavigate()
  const [selectedId, setSelectedId] = useState('0SD_C03')
  const q = queries.find(x => x.id === selectedId) ?? queries[0]
  if (!q) return null

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Home', to: '/command-center' }, { label: 'Migration Factory' }]}
        title="BW Query Analyzer & FSD Generator"
        sub="Analyze BEx queries and generate Functional Spec, Technical Spec, and test cases"
        actions={<>
          <button className="btn btn-ghost btn-sm">📄 Export Word/PDF</button>
          <button className="btn btn-ghost btn-sm">📋 Push to Jira</button>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/infoprovider-mapper')}>Send Mapping → Data Product</button>
        </>}
      />

      <div className="grid-split-rev">
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          <div className="card">
            <div className="card-title mb-12">Query Selector</div>
            <select style={{width:'100%',marginBottom:8}} value={selectedId} onChange={e => setSelectedId(e.target.value)}>
              {queries.map(qr => <option key={qr.id} value={qr.id}>{qr.id} — {qr.name}</option>)}
            </select>
            <div className="ai-panel">
              <div className="ai-panel-header"><span className="ai-label">AI</span> Query Breakdown</div>
              <div className="ai-rec"><span className="ai-rec-icon">📊</span><div className="ai-rec-text"><strong>InfoProvider:</strong> {q.infoProvider}</div></div>
              <div className="ai-rec"><span className="ai-rec-icon">🔧</span><div className="ai-rec-text"><strong>Variables:</strong> {q.variables.filter(v=>v.mandatory).length} mandatory · {q.variables.filter(v=>!v.mandatory).length} optional</div></div>
              <div className="ai-rec"><span className="ai-rec-icon">🧮</span><div className="ai-rec-text"><strong>Calc KFs:</strong> {q.calculatedKFs.map(k=>k.name).join(' · ')}</div></div>
              {q.risks.map((r,i) => (
                <div className="ai-rec" key={i}><span className="ai-rec-icon">🚨</span><div className="ai-rec-text">{r}</div></div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-title mb-8">Calculated Key Figures</div>
            <table className="data-table">
              <thead><tr><th>KF Name</th><th>Formula</th><th>BDC Equivalent</th></tr></thead>
              <tbody>
                {q.calculatedKFs.map((kf,i) => (
                  <tr key={i}>
                    <td>{kf.name}</td>
                    <td className="mono" style={{fontSize:10}}>{kf.formula}</td>
                    <td><Badge status={kf.bdcEquivalent === 'Auto-mapped' ? 'Done' : 'Manual'} label={kf.bdcEquivalent} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {q.fsdDraft && (
          <div className="card">
            <div className="card-header">
              <span className="card-title">FSD Preview — Auto-Generated</span>
              <Badge status="In Progress" label="Draft v1.0" />
            </div>
            <div style={{background:'#f8f9fb',border:'1px solid var(--border)',borderRadius:6,padding:16,fontSize:12,lineHeight:1.7,maxHeight:480,overflowY:'auto'}}>
              <div style={{fontSize:16,fontWeight:700,marginBottom:12,color:'var(--text)'}}>Functional Specification Document</div>
              <div style={{fontSize:13,fontWeight:700,color:'var(--blue-dark)',marginBottom:4}}>1. Report Overview</div>
              <div style={{marginBottom:12}}>
                <strong>Report Name:</strong> {q.fsdDraft.title}<br/>
                <strong>Business Purpose:</strong> {q.fsdDraft.businessPurpose}<br/>
                <strong>Primary Users:</strong> {q.fsdDraft.primaryUsers}<br/>
                <strong>Avg. Monthly Executions:</strong> {q.fsdDraft.avgMonthlyExecutions?.toLocaleString()} (High criticality)
              </div>
              <div style={{fontSize:13,fontWeight:700,color:'var(--blue-dark)',marginBottom:4}}>2. Input Variables</div>
              <table style={{width:'100%',borderCollapse:'collapse',marginBottom:12,fontSize:11.5}}>
                <thead><tr style={{background:'var(--blue-lite)'}}>
                  {['Variable','Type','Mandatory'].map(h => <th key={h} style={{padding:6,textAlign:'left',border:'1px solid #d4e4ff'}}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {q.variables.map((v,i) => (
                    <tr key={i}>
                      {[v.name, v.type, v.mandatory ? 'Yes' : 'No'].map((c,j) => (
                        <td key={j} style={{padding:6,border:'1px solid var(--border)'}}>{c}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{fontSize:13,fontWeight:700,color:'var(--blue-dark)',marginBottom:4}}>3. Key Figures</div>
              <div style={{marginBottom:12}}>{q.keyFigures.join(', ')}</div>
              <div style={{fontSize:13,fontWeight:700,color:'var(--blue-dark)',marginBottom:4}}>4. BDC Target Recommendation</div>
              <div>{q.fsdDraft.bdcRecommendation}</div>
            </div>
            <div className="mt-12 btn-group">
              <button className="btn btn-ghost btn-sm">Edit FSD</button>
              <button className="btn btn-primary btn-sm">Export Word</button>
              <button className="btn btn-ghost btn-sm">Create Jira Story</button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
