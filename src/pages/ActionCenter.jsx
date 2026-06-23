import { useData } from '../context/DataContext'
import KPICard from '../components/common/KPICard'
import PageHeader from '../components/common/PageHeader'
import Badge from '../components/common/Badge'

const riskBadge = { High: 'badge-red', Medium: 'badge-orange', Low: 'badge-green' }
const typeBadge = {
  'Config Change': 'badge-blue', 'Destructive': 'badge-red', 'Ticket Creation': 'badge-purple',
  'Notification': 'badge-blue', 'Rule Update': 'badge-blue',
}

export default function ActionCenter() {
  const { actions, approveAction } = useData()
  if (!actions) return null
  const { summary, queue, auditLog } = actions

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Home', to: '/command-center' }, { label: 'Control' }]}
        title="Autonomous Action Center"
        sub="Review, approve and monitor AI-suggested remediation and workflow actions"
        actions={<Badge status="Pending" label={`${summary.pendingApproval} actions pending`} />}
      />

      <div className="grid-4 mb-12">
        <KPICard label="Pending Approval"   value={<span style={{color:'var(--orange)'}}>{summary.pendingApproval}</span>} />
        <KPICard label="Approved Today"     value={<span style={{color:'var(--green)'}}>{summary.approvedToday}</span>} />
        <KPICard label="Executed This Week" value={summary.executedThisWeek} />
        <KPICard label="Success Rate"       value={<span style={{color:'var(--green)'}}>{summary.successRate}%</span>} />
      </div>

      <div className="card mb-12">
        <div className="card-title mb-12">Action Queue — Pending Approval</div>
        <table className="data-table">
          <thead><tr><th>Action</th><th>Triggered By</th><th>Type</th><th>Risk</th><th>Details</th><th colSpan={2}>Decision</th></tr></thead>
          <tbody>
            {queue.filter(a => a.status === 'Pending').map(action => (
              <tr key={action.id}>
                <td className="font-bold">{action.title}</td>
                <td>{action.triggeredBy}</td>
                <td><span className={`badge ${typeBadge[action.type] ?? 'badge-gray'}`}>{action.type}</span></td>
                <td><span className={`badge ${riskBadge[action.risk]}`}>{action.risk}</span></td>
                <td style={{maxWidth:280,fontSize:11.5}}>{action.details}</td>
                <td><button className="btn btn-success btn-sm" onClick={() => approveAction(action.id)}>✓ Approve</button></td>
                <td><button className="btn btn-ghost btn-sm">✗ Reject</button></td>
              </tr>
            ))}
            {queue.filter(a => a.status === 'Approved').map(action => (
              <tr key={action.id} style={{opacity:.6}}>
                <td className="font-bold">{action.title}</td>
                <td>{action.triggeredBy}</td>
                <td><span className={`badge ${typeBadge[action.type] ?? 'badge-gray'}`}>{action.type}</span></td>
                <td><span className={`badge ${riskBadge[action.risk]}`}>{action.risk}</span></td>
                <td style={{maxWidth:280,fontSize:11.5}}>{action.details}</td>
                <td colSpan={2}><Badge status="Done" label="Approved" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <div className="card-title mb-12">Execution Audit Log</div>
        <table className="data-table">
          <thead><tr><th>Timestamp</th><th>Action</th><th>Approved By</th><th>Status</th><th>Result</th></tr></thead>
          <tbody>
            {auditLog.map((log, i) => (
              <tr key={i}>
                <td className="mono" style={{fontSize:10}}>{new Date(log.timestamp).toLocaleString()}</td>
                <td>{log.action}</td>
                <td>{log.approvedBy}</td>
                <td><Badge status={log.status} /></td>
                <td style={{fontSize:11.5}}>{log.result}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
