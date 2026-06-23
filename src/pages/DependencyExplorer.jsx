import { useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext'
import PageHeader from '../components/common/PageHeader'
import Badge from '../components/common/Badge'

export default function DependencyExplorer() {
  const navigate = useNavigate()
  const { bwObjects } = useData()
  const obj = bwObjects.find(o => o.id === '0FI_GL_4')

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Home', to: '/command-center' }, { label: 'Discovery', to: '/bw-discovery' }, { label: 'Dependency Explorer' }]}
        title="Dependency & Lineage Explorer"
        sub="Visualize upstream/downstream dependencies across extractors, ADSOs, queries and reports"
        actions={<>
          <select><option>0FI_GL_4 (ADSO)</option><option>ZSD_BILLING_A</option><option>0SD_C03</option><option>2LIS_02_ITM</option></select>
          <button className="btn btn-ghost btn-sm">🔍 Filter</button>
          <button className="btn btn-primary btn-sm">📤 Export Graph</button>
        </>}
      />

      <div className="grid-split-rev mb-12">
        <div className="card">
          <div className="card-header">
            <span className="card-title">Lineage Graph — 0FI_GL_4</span>
            <div className="flex gap-8"><Badge status="Selected" label="6 nodes" /><Badge status="Warn" label="2 risks" /></div>
          </div>
          <div style={{background:'#f9fafb',border:'1px dashed #c8d0db',borderRadius:8,overflow:'hidden'}}>
            <svg viewBox="0 0 700 300" width="100%">
              <defs>
                <marker id="arr" markerWidth="8" markerHeight="8" refX="8" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L8,3 z" fill="#0070f2"/>
                </marker>
              </defs>
              <line x1="130" y1="80"  x2="250" y2="120" stroke="#c3d9ff" strokeWidth="2" markerEnd="url(#arr)"/>
              <line x1="130" y1="220" x2="250" y2="150" stroke="#c3d9ff" strokeWidth="2" markerEnd="url(#arr)"/>
              <line x1="340" y1="130" x2="440" y2="90"  stroke="#c3d9ff" strokeWidth="2" markerEnd="url(#arr)"/>
              <line x1="340" y1="150" x2="440" y2="150" stroke="#c3d9ff" strokeWidth="2" markerEnd="url(#arr)"/>
              <line x1="530" y1="90"  x2="610" y2="80"  stroke="#c3d9ff" strokeWidth="2" markerEnd="url(#arr)"/>
              <line x1="530" y1="150" x2="610" y2="150" stroke="#f5cc00" strokeWidth="2" strokeDasharray="4" markerEnd="url(#arr)"/>
              {/* Extractors */}
              <rect x="20"  y="62"  width="110" height="36" rx="6" fill="#e8f2ff" stroke="#0070f2" strokeWidth="1.5"/>
              <text x="75"  y="76"  textAnchor="middle" fontSize="10" fontWeight="700" fill="#0057a8">2LIS_02_SCL</text>
              <text x="75"  y="89"  textAnchor="middle" fontSize="9"  fill="#89919a">Extractor</text>
              <rect x="20"  y="202" width="110" height="36" rx="6" fill="#e8f2ff" stroke="#0070f2" strokeWidth="1.5"/>
              <text x="75"  y="216" textAnchor="middle" fontSize="10" fontWeight="700" fill="#0057a8">2LIS_04_P_ARBPL</text>
              <text x="75"  y="229" textAnchor="middle" fontSize="9"  fill="#89919a">Extractor</text>
              {/* Selected ADSO */}
              <rect x="250" y="112" width="90" height="60" rx="6" fill="#0070f2" stroke="#0057a8" strokeWidth="2"/>
              <text x="295" y="136" textAnchor="middle" fontSize="10" fontWeight="700" fill="#fff">0FI_GL_4</text>
              <text x="295" y="150" textAnchor="middle" fontSize="9"  fill="#c3d9ff">ADSO (Selected)</text>
              <text x="295" y="164" textAnchor="middle" fontSize="9"  fill="#c3d9ff">348K rows</text>
              {/* CompProv */}
              <rect x="440" y="62"  width="90" height="36" rx="6" fill="#f3eeff" stroke="#6200ea" strokeWidth="1.5"/>
              <text x="485" y="76"  textAnchor="middle" fontSize="9"  fontWeight="700" fill="#5a00c8">0PROFIT_CTR_01A</text>
              <text x="485" y="89"  textAnchor="middle" fontSize="9"  fill="#89919a">CompositeProvider</text>
              <rect x="440" y="133" width="90" height="36" rx="6" fill="#fff8e0" stroke="#e9730c" strokeWidth="1.5"/>
              <text x="485" y="147" textAnchor="middle" fontSize="9"  fontWeight="700" fill="#b85c00">ZFI_PROFIT_COMP</text>
              <text x="485" y="160" textAnchor="middle" fontSize="9"  fill="#89919a">CompProv ⚠</text>
              {/* Queries */}
              <rect x="610" y="64"  width="80" height="32" rx="6" fill="#e8f5e2" stroke="#2b7a0b" strokeWidth="1.5"/>
              <text x="650" y="77"  textAnchor="middle" fontSize="10" fontWeight="700" fill="#1a6100">0FI_C04</text>
              <text x="650" y="89"  textAnchor="middle" fontSize="9"  fill="#89919a">BEx Query</text>
              <rect x="610" y="134" width="80" height="32" rx="6" fill="#ffeeee" stroke="#bb0000" strokeWidth="2"/>
              <text x="650" y="147" textAnchor="middle" fontSize="10" fontWeight="700" fill="#aa0000">ZFI_RISK_01</text>
              <text x="650" y="159" textAnchor="middle" fontSize="9"  fill="#89919a">BEx Query ⚠</text>
            </svg>
          </div>
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          <div className="card">
            <div className="card-title mb-12">Object Profile</div>
            <table className="data-table">
              <tbody>
                <tr><td className="text-muted">Name</td><td className="mono font-bold">0FI_GL_4</td></tr>
                <tr><td className="text-muted">Type</td><td><span className="tag">Advanced DSO</span></td></tr>
                <tr><td className="text-muted">Package</td><td>FI_GENERAL</td></tr>
                <tr><td className="text-muted">Rows</td><td>348,291</td></tr>
                <tr><td className="text-muted">Size</td><td>2.1 GB</td></tr>
                <tr><td className="text-muted">Upstream</td><td>2 extractors</td></tr>
                <tr><td className="text-muted">Downstream</td><td>4 objects</td></tr>
              </tbody>
            </table>
          </div>
          <div className="ai-panel">
            <div className="ai-panel-header"><span className="ai-label">AI</span> Migration Impact</div>
            <div className="ai-rec"><span className="ai-rec-icon">⚠</span><div className="ai-rec-text">ZFI_RISK_01 query depends on deprecated field ZFLD_LEGACY. Must be remapped before migration.<span className="conf-pill">95%</span></div></div>
            <div className="ai-rec"><span className="ai-rec-icon">✅</span><div className="ai-rec-text">0FI_C04 query is fully compatible with BDC semantic layer.</div></div>
            <div className="mt-8 btn-group">
              <button className="btn btn-ghost btn-sm" onClick={() => navigate('/rationalization')}>Rationalize</button>
              <button className="btn btn-primary btn-sm" onClick={() => navigate('/infoprovider-mapper')}>Map to BDC</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
