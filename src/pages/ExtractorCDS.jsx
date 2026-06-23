import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext'
import PageHeader from '../components/common/PageHeader'
import Badge from '../components/common/Badge'

export default function ExtractorCDS() {
  const { extractors } = useData()
  const navigate = useNavigate()
  const [selectedId, setSelectedId] = useState('2LIS_02_ITM')
  const selected = extractors.find(e => e.id === selectedId) ?? extractors[0]
  if (!selected) return null

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Home', to: '/command-center' }, { label: 'Migration Factory' }]}
        title="Extractor → CDS Converter"
        sub="Analyze BW extractors and generate proposed S/4HANA CDS views with annotations"
        actions={<>
          <button className="btn btn-ghost btn-sm">Validate Output</button>
          <button className="btn btn-primary btn-sm">✅ Approve &amp; Push to Backlog</button>
        </>}
      />

      <div className="grid-split mb-12">
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          {/* Catalog */}
          <div className="card">
            <div className="card-title mb-12">Extractor Catalog</div>
            <table className="data-table">
              <thead><tr><th>Extractor</th><th>Type</th><th>Tables</th><th>Status</th></tr></thead>
              <tbody>
                {extractors.map(e => (
                  <tr key={e.id} style={e.id === selectedId ? {background:'var(--blue-lite)'} : {}}
                    onClick={() => setSelectedId(e.id)} style={{cursor:'pointer', background: e.id === selectedId ? 'var(--blue-lite)' : undefined}}>
                    <td className="mono font-bold">{e.id}</td>
                    <td>{e.type}</td>
                    <td className="mono" style={{fontSize:10}}>{e.sourceTables.join(', ')}</td>
                    <td><Badge status={e.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ABAP Source */}
          {selected.abapLogic && (
            <div className="card">
              <div className="card-header"><span className="card-title">Source: ABAP Extractor Logic</span></div>
              <div className="code-block">
                <span className="cmt">{`* LIS Extractor ${selected.id} — ${selected.name}`}</span>{'\n'}
                {selected.abapLogic}
              </div>
            </div>
          )}
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          {/* AI Insights */}
          {selected.aiInsights.length > 0 && (
            <div className="ai-panel">
              <div className="ai-panel-header"><span className="ai-label">AI</span> Conversion Analysis</div>
              {selected.aiInsights.map((ins, i) => (
                <div className="ai-rec" key={i}>
                  <span className="ai-rec-icon">{ins.icon}</span>
                  <div className="ai-rec-text">{ins.text}<span className="conf-pill">{ins.confidence}%</span></div>
                </div>
              ))}
            </div>
          )}

          {/* Generated CDS */}
          {selected.generatedCDS && (
            <div className="card">
              <div className="card-header">
                <span className="card-title">Generated CDS View</span>
                <Badge status="Done" label="Auto-Generated" />
              </div>
              <div className="code-block">{selected.generatedCDS}</div>
            </div>
          )}

          {/* Field Mapping */}
          {selected.fieldMapping.length > 0 && (
            <div className="card">
              <div className="card-title mb-8">Field Mapping Review</div>
              {selected.fieldMapping.map((fm, i) => (
                <div className="field-row" key={i}>
                  <span style={{fontFamily:'monospace',fontSize:12,flex:1}}>{fm.source}</span>
                  <span className="field-arrow">→</span>
                  <span style={{fontFamily:'monospace',fontSize:12,flex:1,color:fm.target ? 'var(--blue-dark)' : 'var(--red)'}}>
                    {fm.target ?? '⚠ No mapping'}
                  </span>
                  <Badge status={fm.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
