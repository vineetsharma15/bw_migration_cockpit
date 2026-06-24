import { useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext'
import KPICard from '../components/common/KPICard'
import PageHeader from '../components/common/PageHeader'
import Badge from '../components/common/Badge'

const statusColor = { Done: 'green', 'In Progress': 'blue', Pending: 'gray', Blocked: 'red', Converting: 'purple' }

export default function WavePlanner() {
  const { waves } = useData()
  const navigate  = useNavigate()
  const w1 = waves[0]
  if (!w1) return null

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Home', to: '/command-center' }, { label: 'Step 2 · Lift to BW PCE' }]}
        title="Migration Wave Planner"
        sub="Step 2 Lift-Shift — Group BW objects into waves, assign owners, set dates and validate quality gates with AI assurance"
        actions={<>
          <button className="btn btn-ghost btn-sm">+ New Wave</button>
          <button className="btn btn-primary btn-sm">▶ Start Wave 1</button>
        </>}
      />

      <div className="grid-4 mb-12">
        <KPICard label="Wave 1 Status"    value={<span style={{color:'var(--blue)'}}>In Progress</span>}
          barPct={w1.progress} trend={`${w1.progress}% · Target ${w1.targetDate}`} trendType="" />
        <KPICard label="Objects in Wave 1" value={w1.totalObjects}
          sub={`${w1.doneObjects} done · ${w1.totalObjects - w1.doneObjects} pending`} />
        <KPICard label="Quality Gate"      value={<span style={{color:'var(--green)'}}>Pass</span>}
          sub="Data reconciliation ✓" />
        <KPICard label="Open Issues"       value={<span style={{color:'var(--orange)'}}>{w1.openIssues}</span>}
          sub={`${w1.blockers} blockers · ${w1.openIssues - w1.blockers} minor`} />
      </div>

      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:12}}>
        {waves.map(wave => (
          <div className="wave-col" key={wave.id}>
            <div className="wave-col-header">
              <span>{wave.name}</span>
              <Badge status={wave.status} />
            </div>
            {wave.objects.length === 0 ? (
              <div style={{textAlign:'center',padding:'40px 0',color:'var(--gray)',fontSize:12}}>
                <div style={{fontSize:24,marginBottom:8}}>📦</div>
                <div>{wave.totalObjects} objects to assign</div>
                <div className="mt-8">
                  <button className="btn btn-ghost btn-sm" onClick={() => navigate('/rationalization')}>
                    Assign from Rationalization
                  </button>
                </div>
              </div>
            ) : (
              wave.objects.map(obj => (
                <div className={`wave-card ${obj.status === 'Blocked' ? 'blocked' : ''}`} key={obj.id}>
                  <div className="flex-between">
                    <span className="mono" style={{fontSize:11}}>{obj.id}</span>
                    <Badge status={obj.status} />
                  </div>
                  <div className="text-muted mt-4">{obj.type} · {obj.owner}</div>
                  {obj.issue && <div style={{color:'var(--red)',fontSize:11,marginTop:4}}>⚠ {obj.issue}</div>}
                </div>
              ))
            )}
            {wave.objects.some(o => o.status === 'Blocked') && (
              <div style={{textAlign:'center',marginTop:8}}>
                <button className="btn btn-ghost btn-sm" onClick={() => navigate('/action-center')}>View Issue →</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  )
}
