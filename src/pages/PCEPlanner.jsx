import { useNavigate } from 'react-router-dom'
import KPICard from '../components/common/KPICard'
import PageHeader from '../components/common/PageHeader'
import Badge from '../components/common/Badge'

const COMPAT = [
  { category:'Custom ABAP Code',      total:312, compat:268, fix:44, status:'Review'    },
  { category:'Process Chains',        total:156, compat:152, fix:4,  status:'Ready'     },
  { category:'BAdI Implementations',  total:28,  compat:24,  fix:4,  status:'Review'    },
  { category:'Legacy DSO (Classic)',   total:62,  compat:45,  fix:17, status:'Action Req'},
  { category:'Open Hub Destinations', total:14,  compat:14,  fix:0,  status:'Ready'     },
]

const TIMELINE = [
  { date:'Jul 2026', title:'Remediation Sprint',  desc:'Fix 48 compatibility items · Custom code adaptation',     done:false },
  { date:'Aug 2026', title:'System Copy & Upgrade',desc:'HANA DB migration · BW 7.5 → BW PCE on Azure',          done:false },
  { date:'Sep 2026', title:'Validation & UAT',    desc:'Process chain validation · Data reconciliation',          done:false },
  { date:'Oct 2026', title:'Go-Live PCE',          desc:'Cutover · BDC migration continues in parallel',         done:false },
]

export default function PCEPlanner() {
  const navigate = useNavigate()
  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Home', to: '/command-center' }, { label: 'Migration Factory' }]}
        title="BW to BW PCE Planner"
        sub="Optional lift-and-shift to BW Private Cloud Edition as an interim migration step"
        actions={<button className="btn btn-primary btn-sm" onClick={() => navigate('/wave-planner')}>Send to Wave Planner →</button>}
      />

      <div className="grid-4 mb-12">
        <KPICard label="PCE Compatibility"   value={<span style={{color:'var(--green)'}}>87<span style={{fontSize:16}}>%</span></span>} barPct={87} barColor="green" />
        <KPICard label="Remediation Items"   value={<span style={{color:'var(--orange)'}}>48</span>} sub="Custom code / deprecated APIs" />
        <KPICard label="Estimated Effort"    value={<>6<span style={{fontSize:14}}>mo</span></>} sub="4 consultants, 2 basis admins" />
        <KPICard label="Risk Level"          value={<span style={{color:'var(--orange)'}}>Medium</span>} sub="15 high-complexity objects" />
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card-title mb-12">Compatibility Assessment</div>
          <table className="data-table">
            <thead><tr><th>Category</th><th>Total</th><th>Compatible</th><th>Needs Fix</th><th>Status</th></tr></thead>
            <tbody>
              {COMPAT.map((r,i) => (
                <tr key={i}>
                  <td>{r.category}</td><td>{r.total}</td>
                  <td style={{color:'var(--green)',fontWeight:700}}>{r.compat}</td>
                  <td style={{color: r.fix > 0 ? 'var(--red)' : 'var(--green)'}}>{r.fix}</td>
                  <td><Badge status={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="card">
          <div className="card-title mb-12">Migration Timeline</div>
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            {TIMELINE.map((t,i) => (
              <div key={i} style={{display:'flex',gap:12,alignItems:'flex-start'}}>
                <div style={{width:80,textAlign:'right',fontSize:11,color:'var(--gray)',paddingTop:2}}>{t.date}</div>
                <div style={{width:2,background:'var(--blue)',flexShrink:0,minHeight:40,marginTop:4,borderRadius:1}} />
                <div>
                  <div className="font-bold text-sm">{t.title}</div>
                  <div className="text-muted">{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
