import { useData } from '../context/DataContext'
import KPICard from '../components/common/KPICard'
import PageHeader from '../components/common/PageHeader'
import Badge from '../components/common/Badge'

export default function AgentConsole() {
  const { agents } = useData()
  if (!agents) return null

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Home', to: '/command-center' }, { label: 'Control' }]}
        title="Agent Orchestration Console"
        sub="Monitor agents, tool calls, memory, prompt versions and error logs · Powered by Anthropic + Infosys Topaz Fabric"
        actions={<>
          <button className="btn btn-ghost btn-sm">📋 View All Logs</button>
          <button className="btn btn-primary btn-sm">+ Register Agent</button>
        </>}
      />

      <div className="grid-4 mb-12">
        <KPICard label="Active Agents"     value={<span style={{color:'var(--green)'}}>{agents.summary.activeAgents}</span>} />
        <KPICard label="Tool Calls (24h)"  value={agents.summary.toolCalls24h.toLocaleString()} />
        <KPICard label="Errors (24h)"      value={<span style={{color:'var(--red)'}}>{agents.summary.errors24h}</span>} />
        <KPICard label="Avg Response Time" value={<>{agents.summary.avgResponseTimeSec}<span style={{fontSize:14}}>s</span></>} />
      </div>

      <div className="grid-split-rev mb-12">
        <div className="card">
          <div className="card-title mb-12">Agent Registry</div>
          {agents.registry.map(agent => (
            <div className="agent-row" key={agent.id}>
              <div className={`agent-dot ${agent.status.toLowerCase()}`} />
              <div style={{flex:1}}>
                <div className="font-bold text-sm">{agent.name}</div>
                <div className="text-muted">{agent.description}</div>
              </div>
              <div style={{textAlign:'right'}}>
                <Badge status={agent.status} />
                <div className="text-muted mt-4">{agent.callsToday} calls today</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          <div className="card">
            <div className="card-title mb-12">Recent Tool Calls</div>
            <table className="data-table">
              <thead><tr><th>Time</th><th>Agent</th><th>Tool</th><th>Status</th></tr></thead>
              <tbody>
                {agents.recentToolCalls.map((tc, i) => (
                  <tr key={i}>
                    <td className="mono" style={{fontSize:10}}>{tc.time}</td>
                    <td style={{fontSize:11.5}}>{tc.agent}</td>
                    <td className="mono" style={{fontSize:10}}>{tc.tool}</td>
                    <td><Badge status={tc.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="card">
            <div className="card-title mb-8">Error Logs</div>
            <div className="code-block" style={{fontSize:11,maxHeight:160,overflowY:'auto'}}>
              {agents.errorLog}
            </div>
          </div>
          <div className="card">
            <div className="card-title mb-8">Prompt Versions</div>
            <table className="data-table">
              <thead><tr><th>Agent</th><th>Version</th><th>Last Updated</th></tr></thead>
              <tbody>
                {agents.registry.map(a => (
                  <tr key={a.id}>
                    <td style={{fontSize:11.5}}>{a.name.replace(' Agent','')}</td>
                    <td className="mono">{a.promptVersion}</td>
                    <td>{a.lastUpdated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}
