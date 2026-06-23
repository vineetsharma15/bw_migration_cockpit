import { useState } from 'react'
import { useData } from '../context/DataContext'
import PageHeader from '../components/common/PageHeader'
import KPICard from '../components/common/KPICard'
import Badge from '../components/common/Badge'

const ROLE_COLORS = {
  'Migration Lead':    'var(--blue)',
  'BW Architect':      'var(--purple)',
  'Data Steward':      'var(--green)',
  'Data Product Owner':'var(--orange)',
  'Executive Sponsor': 'var(--red)',
  'Business User':     'var(--gray)',
  'AI Engineer':       'var(--blue)',
}

const ALL_SCREENS = [
  'CommandCenter','BWDiscovery','DependencyExplorer','Rationalization',
  'TCOCalculator','PCEPlanner','WavePlanner','ExtractorCDS','QueryAnalyzer',
  'InfoProviderMapper','DataProductStudio','DataQuality','AICopilot',
  'PersonaWorkspace','ActionCenter','AgentConsole','UserManagement','Connections'
]

const ROLES = ['Executive Sponsor','Migration Lead','BW Architect','Data Product Owner','Data Steward','Business User','AI Engineer']

function formatDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('en-GB', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })
}

export default function UserManagement() {
  const { users } = useData()
  const userList    = users?.users ?? []
  const roles       = users?.roles ?? ROLES
  const activityLog = users?.activityLog ?? []

  const [roleFilter, setRoleFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [search, setSearch]          = useState('')
  const [selectedUser, setSelectedUser] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [newUser, setNewUser]           = useState({ name:'', email:'', role: ROLES[0], team:'' })

  const filtered = userList.filter(u => {
    const matchRole   = roleFilter   === 'All' || u.role   === roleFilter
    const matchStatus = statusFilter === 'All' || u.status === statusFilter
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    return matchRole && matchStatus && matchSearch
  })

  const activeCount   = userList.filter(u => u.status === 'Active').length
  const inactiveCount = userList.filter(u => u.status === 'Inactive').length
  const pendingCount  = userList.filter(u => u.status === 'Pending').length

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Home', to: '/command-center' }, { label: 'Administration' }]}
        title="User Management"
        sub="Manage cockpit users, roles, screen access, and activity across the migration program"
        actions={
          <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>+ Add User</button>
        }
      />

      <div className="grid-4 mb-12">
        <KPICard label="Total Users"    value={userList.length} sub={`${roles.length} roles defined`} />
        <KPICard label="Active"         value={<span style={{color:'var(--green)'}}>{activeCount}</span>} barPct={Math.round(activeCount/userList.length*100)} barColor="green" />
        <KPICard label="Inactive"       value={<span style={{color:'var(--gray)'}}>{inactiveCount}</span>} sub="Access revoked" />
        <KPICard label="Pending Invite" value={<span style={{color:'var(--orange)'}}>{pendingCount}</span>} sub="Awaiting first login" />
      </div>

      <div className="grid-2 mb-12">
        {/* User table */}
        <div className="card" style={{gridColumn:'span 2'}}>
          <div className="flex-between mb-12">
            <div className="card-title">User Directory</div>
            <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
              <input
                style={{padding:'4px 10px',border:'1px solid var(--border)',borderRadius:6,fontSize:12,width:180}}
                placeholder="Search name or email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} style={{fontSize:12,padding:'4px 8px',border:'1px solid var(--border)',borderRadius:6}}>
                <option value="All">All Roles</option>
                {roles.map(r => <option key={r}>{r}</option>)}
              </select>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{fontSize:12,padding:'4px 8px',border:'1px solid var(--border)',borderRadius:6}}>
                <option value="All">All Status</option>
                <option>Active</option>
                <option>Inactive</option>
                <option>Pending</option>
              </select>
            </div>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Team</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Screen Access</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} style={{cursor:'pointer'}} onClick={() => setSelectedUser(u)}>
                  <td>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <div style={{
                        width:32,height:32,borderRadius:'50%',
                        background: ROLE_COLORS[u.role] ?? 'var(--blue)',
                        color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',
                        fontSize:11,fontWeight:700,flexShrink:0
                      }}>{u.avatar}</div>
                      <div>
                        <div className="font-bold text-sm">{u.name}</div>
                        <div className="text-muted">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td><span style={{
                    fontSize:11,fontWeight:600,padding:'2px 8px',borderRadius:10,
                    background: ROLE_COLORS[u.role] + '20',
                    color: ROLE_COLORS[u.role]
                  }}>{u.role}</span></td>
                  <td className="text-muted">{u.team}</td>
                  <td><Badge status={u.status} /></td>
                  <td className="text-muted">{formatDate(u.lastLogin)}</td>
                  <td>{u.screens.includes('All')
                    ? <span className="badge badge-green">Full Access</span>
                    : <span className="text-muted">{u.screens.length} screens</span>}
                  </td>
                  <td>
                    <div style={{display:'flex',gap:4}} onClick={e => e.stopPropagation()}>
                      <button className="btn btn-secondary btn-sm" onClick={() => setSelectedUser(u)}>Edit</button>
                      {u.status === 'Active'
                        ? <button className="btn btn-sm" style={{background:'var(--red)',color:'#fff',border:'none',borderRadius:4,padding:'2px 8px',fontSize:11,cursor:'pointer'}}>Deactivate</button>
                        : <button className="btn btn-sm" style={{background:'var(--green)',color:'#fff',border:'none',borderRadius:4,padding:'2px 8px',fontSize:11,cursor:'pointer'}}>Activate</button>
                      }
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-muted mt-8" style={{fontSize:11}}>Showing {filtered.length} of {userList.length} users</div>
        </div>
      </div>

      {/* Role definitions */}
      <div className="grid-2 mb-12">
        <div className="card">
          <div className="card-title mb-12">Role Definitions</div>
          <div style={{display:'flex',flexDirection:'column',gap:8}}>
            {[
              { role:'Executive Sponsor', desc:'Read-only access to Command Center and TCO. Receives executive digests.', screens:2 },
              { role:'Migration Lead',    desc:'Full access to all migration screens. Can approve actions and manage waves.', screens:18 },
              { role:'BW Architect',      desc:'Access to discovery, extractors, queries, dependency explorer and rationalization.', screens:6 },
              { role:'Data Product Owner',desc:'Access to InfoProvider Mapper, Data Product Studio, Data Quality, and AI Copilot.', screens:4 },
              { role:'Data Steward',      desc:'Access to Data Quality, Data Product Studio, and governance workflows.', screens:3 },
              { role:'Business User',     desc:'Access to AI Copilot and Persona Workspace for self-service insights.', screens:2 },
              { role:'AI Engineer',       desc:'Access to Agent Console, Action Center, and system configuration.', screens:3 },
            ].map(r => (
              <div key={r.role} style={{padding:10,background:'var(--bg)',borderRadius:6,borderLeft:`3px solid ${ROLE_COLORS[r.role]}`}}>
                <div className="flex-between">
                  <span className="font-bold text-sm">{r.role}</span>
                  <span className="text-muted" style={{fontSize:11}}>{r.screens} screens</span>
                </div>
                <div className="text-muted mt-4">{r.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Activity log */}
        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          <div className="card">
            <div className="card-title mb-12">Recent Activity</div>
            <div style={{display:'flex',flexDirection:'column',gap:8}}>
              {activityLog.map((a, i) => (
                <div key={i} style={{padding:10,background:'var(--bg)',borderRadius:6}}>
                  <div className="flex-between">
                    <span className="font-bold text-sm">{a.user}</span>
                    <span className="text-muted" style={{fontSize:11}}>{formatDate(a.timestamp)}</span>
                  </div>
                  <div className="text-muted mt-4">{a.action}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <div className="card-title mb-8">Screen Access Matrix</div>
            <div className="text-muted" style={{fontSize:12,marginBottom:8}}>Users with access to each key area:</div>
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              {[
                { area:'Command Center',      count: userList.filter(u => u.screens.includes('All') || u.screens.includes('CommandCenter')).length },
                { area:'Migration Factory',   count: userList.filter(u => u.screens.includes('All') || u.screens.some(s => ['WavePlanner','ExtractorCDS','QueryAnalyzer'].includes(s))).length },
                { area:'Data Product Studio', count: userList.filter(u => u.screens.includes('All') || u.screens.includes('DataProductStudio')).length },
                { area:'AI Copilot',          count: userList.filter(u => u.screens.includes('All') || u.screens.includes('AICopilot')).length },
                { area:'Agent Console',       count: userList.filter(u => u.screens.includes('All') || u.screens.includes('AgentConsole')).length },
              ].map(item => (
                <div key={item.area} className="flex-between" style={{fontSize:12}}>
                  <span>{item.area}</span>
                  <span className="font-bold" style={{color:'var(--blue)'}}>{item.count} users</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* User detail panel */}
      {selectedUser && (
        <div style={{position:'fixed',top:0,right:0,bottom:0,width:420,background:'#fff',boxShadow:'-4px 0 24px rgba(0,0,0,0.12)',zIndex:200,overflowY:'auto',padding:24}}>
          <div className="flex-between mb-16">
            <div className="card-title">User Profile</div>
            <button onClick={() => setSelectedUser(null)} style={{background:'none',border:'none',fontSize:20,cursor:'pointer',color:'var(--gray)'}}>✕</button>
          </div>
          <div style={{display:'flex',alignItems:'center',gap:16,marginBottom:20}}>
            <div style={{
              width:56,height:56,borderRadius:'50%',
              background: ROLE_COLORS[selectedUser.role] ?? 'var(--blue)',
              color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',
              fontSize:18,fontWeight:700
            }}>{selectedUser.avatar}</div>
            <div>
              <div style={{fontWeight:700,fontSize:16}}>{selectedUser.name}</div>
              <div className="text-muted">{selectedUser.email}</div>
              <Badge status={selectedUser.status} />
            </div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:10,marginBottom:20}}>
            {[
              { label:'Role',       value: selectedUser.role },
              { label:'Team',       value: selectedUser.team },
              { label:'Last Login', value: formatDate(selectedUser.lastLogin) },
            ].map(f => (
              <div key={f.label} className="flex-between" style={{padding:8,background:'var(--bg)',borderRadius:6}}>
                <span className="text-muted" style={{fontSize:12}}>{f.label}</span>
                <span className="font-bold text-sm">{f.value}</span>
              </div>
            ))}
          </div>
          <div className="font-bold text-sm mb-8">Screen Access</div>
          <div style={{display:'flex',flexWrap:'wrap',gap:4,marginBottom:16}}>
            {selectedUser.screens.includes('All')
              ? ALL_SCREENS.map(s => <span key={s} className="badge badge-green" style={{fontSize:10}}>{s}</span>)
              : ALL_SCREENS.map(s => (
                  <span key={s} className={`badge ${selectedUser.screens.includes(s) ? 'badge-blue' : 'badge-gray'}`} style={{fontSize:10,opacity: selectedUser.screens.includes(s) ? 1 : 0.4}}>
                    {s}
                  </span>
                ))
            }
          </div>
          <div style={{display:'flex',gap:8,marginTop:16}}>
            <button className="btn btn-primary btn-sm" style={{flex:1}}>Save Changes</button>
            <button className="btn btn-secondary btn-sm" onClick={() => setSelectedUser(null)}>Cancel</button>
          </div>
        </div>
      )}

      {/* Add user modal */}
      {showAddModal && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.4)',zIndex:300,display:'flex',alignItems:'center',justifyContent:'center'}}>
          <div style={{background:'#fff',borderRadius:12,padding:28,width:440,boxShadow:'0 8px 32px rgba(0,0,0,0.18)'}}>
            <div className="flex-between mb-16">
              <div className="card-title">Add New User</div>
              <button onClick={() => setShowAddModal(false)} style={{background:'none',border:'none',fontSize:20,cursor:'pointer',color:'var(--gray)'}}>✕</button>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:12}}>
              {[
                { label:'Full Name',    key:'name',  type:'text',  placeholder:'e.g. John Smith' },
                { label:'Email',        key:'email', type:'email', placeholder:'john.smith@corp.com' },
                { label:'Team / Org',   key:'team',  type:'text',  placeholder:'e.g. Finance IT' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{display:'block',fontSize:12,fontWeight:600,marginBottom:4}}>{f.label}</label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    value={newUser[f.key]}
                    onChange={e => setNewUser(prev => ({...prev, [f.key]: e.target.value}))}
                    style={{width:'100%',boxSizing:'border-box',padding:'6px 10px',border:'1px solid var(--border)',borderRadius:6,fontSize:13}}
                  />
                </div>
              ))}
              <div>
                <label style={{display:'block',fontSize:12,fontWeight:600,marginBottom:4}}>Role</label>
                <select
                  value={newUser.role}
                  onChange={e => setNewUser(prev => ({...prev, role: e.target.value}))}
                  style={{width:'100%',padding:'6px 10px',border:'1px solid var(--border)',borderRadius:6,fontSize:13}}
                >
                  {ROLES.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div style={{marginTop:16,padding:10,background:'var(--blue-lite)',borderRadius:6,fontSize:12,color:'var(--blue-dark)'}}>
              An invitation email will be sent to the provided address. Screen access will be set based on the selected role and can be customised after account creation.
            </div>
            <div style={{display:'flex',gap:8,marginTop:16}}>
              <button className="btn btn-primary btn-sm" style={{flex:1}} onClick={() => setShowAddModal(false)}>
                Send Invitation
              </button>
              <button className="btn btn-secondary btn-sm" onClick={() => setShowAddModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
