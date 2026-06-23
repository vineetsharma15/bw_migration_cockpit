import { useState } from 'react'
import { useData } from '../context/DataContext'
import PageHeader from '../components/common/PageHeader'
import KPICard from '../components/common/KPICard'
import Badge from '../components/common/Badge'

function StatusDot({ status }) {
  const color = status === 'Connected' ? 'var(--green)' : status === 'Error' ? 'var(--red)' : 'var(--orange)'
  return <span style={{display:'inline-block',width:8,height:8,borderRadius:'50%',background:color,marginRight:6,verticalAlign:'middle'}} />
}

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-GB', { day:'2-digit', month:'short', hour:'2-digit', minute:'2-digit' })
}

const CONN_TYPES = { 'SAP BW Source': 'var(--blue)', 'SAP BDC Target': 'var(--green)', 'External Integration': 'var(--purple)' }

export default function Connections() {
  const { connections } = useData()
  const bwSystems    = connections?.bwSystems    ?? []
  const bdcTargets   = connections?.bdcTargets   ?? []
  const integrations = connections?.externalIntegrations ?? []

  const [activeTab, setActiveTab]       = useState('bw')
  const [testingId, setTestingId]       = useState(null)
  const [testResults, setTestResults]   = useState({})
  const [showAddModal, setShowAddModal] = useState(false)
  const [addType, setAddType]           = useState('bw')
  const [newConn, setNewConn]           = useState({ label:'', host:'', port:'3200', client:'100', rfcUser:'MIGRATION_RFC' })

  const allConnected = [...bwSystems, ...bdcTargets, ...integrations].filter(c => c.status === 'Connected').length
  const allTotal     = bwSystems.length + bdcTargets.length + integrations.length
  const errors       = [...bwSystems, ...bdcTargets, ...integrations].filter(c => c.status === 'Error').length

  const simulateTest = (id) => {
    setTestingId(id)
    setTimeout(() => {
      setTestResults(prev => ({ ...prev, [id]: Math.random() > 0.2 ? 'Connected' : 'Error' }))
      setTestingId(null)
    }, 1800)
  }

  const tabs = [
    { key:'bw',  label:'BW Source Systems', count: bwSystems.length },
    { key:'bdc', label:'BDC Target Tenants', count: bdcTargets.length },
    { key:'ext', label:'External Integrations', count: integrations.length },
  ]

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Home', to: '/command-center' }, { label: 'Administration' }]}
        title="Connections"
        sub="Manage source BW system connections, BDC target tenant configurations, and external integrations"
        actions={
          <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>+ Add Connection</button>
        }
      />

      <div className="grid-4 mb-12">
        <KPICard label="Total Connections" value={allTotal} sub="Across all types" />
        <KPICard label="Connected" value={<span style={{color:'var(--green)'}}>{allConnected}</span>} barPct={Math.round(allConnected/allTotal*100)} barColor="green" />
        <KPICard label="Errors" value={<span style={{color:'var(--red)'}}>{errors}</span>} sub="Action required" />
        <KPICard label="BW Objects Scanned" value="2,847" sub="PRD-BW-01 · Jun 18" />
      </div>

      {/* Tab bar */}
      <div style={{display:'flex',gap:0,marginBottom:16,borderBottom:'2px solid var(--border)'}}>
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              padding:'8px 20px',border:'none',cursor:'pointer',fontSize:13,fontWeight:600,
              background:'none',
              borderBottom: activeTab === t.key ? '2px solid var(--blue)' : '2px solid transparent',
              marginBottom:-2,
              color: activeTab === t.key ? 'var(--blue)' : 'var(--gray)'
            }}
          >
            {t.label} <span style={{
              marginLeft:6,fontSize:11,padding:'1px 6px',borderRadius:10,
              background: activeTab === t.key ? 'var(--blue)' : 'var(--border)',
              color: activeTab === t.key ? '#fff' : 'var(--gray)'
            }}>{t.count}</span>
          </button>
        ))}
      </div>

      {/* BW Systems */}
      {activeTab === 'bw' && (
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          {bwSystems.map(sys => {
            const status = testResults[sys.id] ?? sys.status
            return (
              <div key={sys.id} className="card" style={{borderLeft:`4px solid ${status === 'Connected' ? 'var(--green)' : 'var(--red)'}`}}>
                <div className="flex-between mb-12">
                  <div style={{display:'flex',alignItems:'center',gap:12}}>
                    <div style={{width:44,height:44,borderRadius:10,background:'var(--blue-lite)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20}}>🏭</div>
                    <div>
                      <div style={{fontWeight:700,fontSize:15}}>{sys.label}</div>
                      <div className="text-muted">{sys.description}</div>
                    </div>
                  </div>
                  <div style={{display:'flex',gap:8,alignItems:'center'}}>
                    <StatusDot status={status} />
                    <Badge status={status} />
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => simulateTest(sys.id)}
                      disabled={testingId === sys.id}
                    >
                      {testingId === sys.id ? '⏳ Testing…' : '↻ Test Connection'}
                    </button>
                  </div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:12}}>
                  {[
                    { label:'Host',           value: sys.host },
                    { label:'Port / Client',  value: `${sys.port} / ${sys.client}` },
                    { label:'Release',        value: sys.release },
                    { label:'System Type',    value: sys.systemType },
                    { label:'Database',       value: sys.dbType },
                    { label:'DB Size',        value: sys.dbSize },
                    { label:'Auth Method',    value: sys.authMethod },
                    { label:'RFC User',       value: sys.rfcUser },
                  ].map(f => (
                    <div key={f.label} style={{padding:10,background:'var(--bg)',borderRadius:6}}>
                      <div className="text-muted" style={{fontSize:11}}>{f.label}</div>
                      <div className="font-bold text-sm mt-4">{f.value}</div>
                    </div>
                  ))}
                </div>
                <div className="flex-between" style={{fontSize:12}}>
                  <div style={{display:'flex',gap:16}}>
                    <span>Last tested: <strong>{formatDate(sys.lastTested)}</strong></span>
                    {sys.objectCount && <span>Objects scanned: <strong style={{color:'var(--blue)'}}>{sys.objectCount.toLocaleString()}</strong></span>}
                    <span>Scan enabled: <strong>{sys.scanEnabled ? '✓ Yes' : '✗ No'}</strong></span>
                  </div>
                  <div style={{display:'flex',gap:8}}>
                    <button className="btn btn-secondary btn-sm">Edit</button>
                    <button className="btn btn-primary btn-sm" disabled={!sys.scanEnabled}>▶ Run Scan</button>
                  </div>
                </div>
                {sys.notes && (
                  <div style={{marginTop:10,padding:8,background: status === 'Error' ? 'rgba(187,0,0,0.06)' : 'var(--bg)',borderRadius:6,fontSize:12,color: status === 'Error' ? 'var(--red)' : 'var(--gray)'}}>
                    ℹ {sys.notes}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* BDC Targets */}
      {activeTab === 'bdc' && (
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          {bdcTargets.map(tgt => {
            const status = testResults[tgt.id] ?? tgt.status
            return (
              <div key={tgt.id} className="card" style={{borderLeft:`4px solid ${status === 'Connected' ? 'var(--green)' : 'var(--red)'}`}}>
                <div className="flex-between mb-12">
                  <div style={{display:'flex',alignItems:'center',gap:12}}>
                    <div style={{width:44,height:44,borderRadius:10,background:'rgba(43,122,11,0.1)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:20}}>☁️</div>
                    <div>
                      <div style={{fontWeight:700,fontSize:15}}>{tgt.label}</div>
                      <div className="text-muted">{tgt.description}</div>
                    </div>
                  </div>
                  <div style={{display:'flex',gap:8,alignItems:'center'}}>
                    <StatusDot status={status} />
                    <Badge status={status} />
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => simulateTest(tgt.id)}
                      disabled={testingId === tgt.id}
                    >
                      {testingId === tgt.id ? '⏳ Testing…' : '↻ Test Connection'}
                    </button>
                  </div>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12,marginBottom:12}}>
                  {[
                    { label:'Host',                 value: tgt.host },
                    { label:'Tenant ID',            value: tgt.tenantId },
                    { label:'Region',               value: tgt.region },
                    { label:'Auth Method',          value: tgt.authMethod },
                    { label:'Client ID',            value: tgt.clientId },
                    { label:'Datasphere Spaces',    value: tgt.datasphereSpace },
                    { label:'Published Products',   value: tgt.publishedProducts },
                    { label:'Draft Products',       value: tgt.draftProducts },
                  ].map(f => (
                    <div key={f.label} style={{padding:10,background:'var(--bg)',borderRadius:6}}>
                      <div className="text-muted" style={{fontSize:11}}>{f.label}</div>
                      <div className="font-bold text-sm mt-4">{f.value}</div>
                    </div>
                  ))}
                </div>
                <div className="flex-between" style={{fontSize:12}}>
                  <span>Last tested: <strong>{formatDate(tgt.lastTested)}</strong></span>
                  <div style={{display:'flex',gap:8}}>
                    <button className="btn btn-secondary btn-sm">Edit</button>
                    <button className="btn btn-primary btn-sm">Open in BDC Console ↗</button>
                  </div>
                </div>
                {tgt.notes && (
                  <div style={{marginTop:10,padding:8,background:'var(--bg)',borderRadius:6,fontSize:12,color:'var(--gray)'}}>
                    ℹ {tgt.notes}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* External Integrations */}
      {activeTab === 'ext' && (
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          <div className="card">
            <div className="card-title mb-12">External Integrations</div>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Endpoint</th>
                  <th>Status</th>
                  <th>Last Tested</th>
                  <th>Notes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {integrations.map(intg => {
                  const status = testResults[intg.id] ?? intg.status
                  return (
                    <tr key={intg.id}>
                      <td className="font-bold">{intg.name}</td>
                      <td>
                        <span style={{
                          fontSize:10,fontWeight:600,padding:'2px 8px',borderRadius:10,
                          background:'var(--purple)20',color:'var(--purple)'
                        }}>{intg.type}</span>
                      </td>
                      <td className="text-muted" style={{fontSize:11}}>{intg.url}</td>
                      <td>
                        <StatusDot status={status} />
                        <Badge status={status} />
                      </td>
                      <td className="text-muted">{formatDate(intg.lastTested)}</td>
                      <td className="text-muted" style={{fontSize:11,maxWidth:200}}>{intg.notes}</td>
                      <td>
                        <div style={{display:'flex',gap:4}}>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => simulateTest(intg.id)}
                            disabled={testingId === intg.id}
                          >
                            {testingId === intg.id ? '⏳' : '↻ Test'}
                          </button>
                          <button className="btn btn-secondary btn-sm">Edit</button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Connection health overview */}
      <div className="card mt-12">
        <div className="card-title mb-12">Connection Health Overview</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
          {[
            { title:'BW Source', items: bwSystems },
            { title:'BDC Target', items: bdcTargets },
            { title:'Integrations', items: integrations },
          ].map(section => (
            <div key={section.title} style={{padding:16,background:'var(--bg)',borderRadius:8}}>
              <div className="font-bold text-sm mb-8">{section.title}</div>
              {section.items.map(c => (
                <div key={c.id || c.name} className="flex-between" style={{padding:'6px 0',borderBottom:'1px solid var(--border)',fontSize:12}}>
                  <span><StatusDot status={testResults[c.id] ?? c.status} />{c.label || c.name}</span>
                  <Badge status={testResults[c.id] ?? c.status} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Add connection modal */}
      {showAddModal && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.4)',zIndex:300,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#fff',borderRadius:12,padding:28,width:460,boxShadow:'0 8px 32px rgba(0,0,0,0.18)'}}>
            <div className="flex-between mb-16">
              <div className="card-title">Add New Connection</div>
              <button onClick={() => setShowAddModal(false)} style={{background:'none',border:'none',fontSize:20,cursor:'pointer',color:'var(--gray)'}}>✕</button>
            </div>
            <div style={{display:'flex',gap:0,marginBottom:16,borderBottom:'2px solid var(--border)'}}>
              {[
                { key:'bw',  label:'SAP BW System' },
                { key:'bdc', label:'BDC Tenant' },
                { key:'ext', label:'Integration' },
              ].map(t => (
                <button key={t.key} onClick={() => setAddType(t.key)} style={{
                  padding:'6px 16px',border:'none',cursor:'pointer',fontSize:12,fontWeight:600,background:'none',
                  borderBottom: addType === t.key ? '2px solid var(--blue)' : '2px solid transparent',
                  marginBottom:-2,color: addType === t.key ? 'var(--blue)' : 'var(--gray)'
                }}>{t.label}</button>
              ))}
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              {addType === 'bw' && <>
                {[
                  { label:'System Label', key:'label', placeholder:'e.g. DEV-BW-02' },
                  { label:'Application Server Host', key:'host', placeholder:'bw-dev2.corp.example.com' },
                  { label:'System Number / Port', key:'port', placeholder:'3200' },
                  { label:'Client', key:'client', placeholder:'100' },
                  { label:'RFC Service User', key:'rfcUser', placeholder:'MIGRATION_RFC' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{display:'block',fontSize:12,fontWeight:600,marginBottom:4}}>{f.label}</label>
                    <input
                      placeholder={f.placeholder}
                      value={newConn[f.key] ?? ''}
                      onChange={e => setNewConn(prev => ({...prev, [f.key]: e.target.value}))}
                      style={{width:'100%',boxSizing:'border-box',padding:'6px 10px',border:'1px solid var(--border)',borderRadius:6,fontSize:13}}
                    />
                  </div>
                ))}
              </>}
              {addType === 'bdc' && <>
                {[
                  { label:'Tenant Label', key:'label', placeholder:'e.g. BDC UAT' },
                  { label:'BTP Host', key:'host', placeholder:'corp-bdc-uat.eu10.hcs.cloud.sap' },
                  { label:'Tenant ID', key:'tenantId', placeholder:'CORP-BDC-UAT' },
                  { label:'OAuth Client ID', key:'clientId', placeholder:'bdc-migration-uat-client' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{display:'block',fontSize:12,fontWeight:600,marginBottom:4}}>{f.label}</label>
                    <input placeholder={f.placeholder} style={{width:'100%',boxSizing:'border-box',padding:'6px 10px',border:'1px solid var(--border)',borderRadius:6,fontSize:13}} />
                  </div>
                ))}
              </>}
              {addType === 'ext' && <>
                {[
                  { label:'Integration Name', key:'name', placeholder:'e.g. Confluence' },
                  { label:'Type', key:'type', placeholder:'e.g. Documentation' },
                  { label:'Endpoint URL', key:'url', placeholder:'https://corp.atlassian.net' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={{display:'block',fontSize:12,fontWeight:600,marginBottom:4}}>{f.label}</label>
                    <input placeholder={f.placeholder} style={{width:'100%',boxSizing:'border-box',padding:'6px 10px',border:'1px solid var(--border)',borderRadius:6,fontSize:13}} />
                  </div>
                ))}
              </>}
            </div>
            <div style={{display:'flex',gap:8,marginTop:20}}>
              <button className="btn btn-secondary btn-sm" style={{flex:1}} onClick={() => setShowAddModal(false)}>
                ↻ Test & Save
              </button>
              <button className="btn btn-primary btn-sm" style={{flex:1}} onClick={() => setShowAddModal(false)}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
