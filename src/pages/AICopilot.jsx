import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { sendCopilotMessage, getCopilotConfig } from '../services/dataService'
import { useData } from '../context/DataContext'
import PageHeader from '../components/common/PageHeader'
import Badge from '../components/common/Badge'

const INITIAL_MESSAGES = [
  { role: 'agent', text: "Hello! I'm your AI Co-pilot for Business — powered by the Infosys Topaz Agentic Framework (Step 4A · AI Driven Consumption). I can answer NL queries about your BW migration status, surface auto-insights from certified BDC data products, and help business users get contextual answers without writing code. What would you like to explore?" }
]

export default function AICopilot() {
  const { dataProducts } = useData()
  const navigate = useNavigate()
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)

  const send = async (text) => {
    const msg = text || input
    if (!msg.trim()) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', text: msg }])
    setLoading(true)
    const resp = await sendCopilotMessage(msg)
    setMessages(prev => [...prev, { role: 'agent', text: resp.text, confidence: resp.confidence, sources: resp.sources }])
    setLoading(false)
  }

  const renderText = (text) => text.split('\n').map((line, i) => (
    <span key={i}>{line.replace(/\*\*(.*?)\*\*/g, '$1')}<br/></span>
  ))

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Home', to: '/command-center' }, { label: 'Step 4A · AI Driven Consumption' }]}
        title="AI Co-pilot for Business"
        sub="Step 4A · NL queries &amp; auto-insights — ask questions about migration status, certified BDC data products, and business KPIs"
        actions={<Badge status="Running" label="● 3 data products available" />}
      />

      <div className="grid-split">
        <div>
          <div className="chat-container">
            <div className="chat-messages">
              {messages.map((m, i) => (
                <div key={i}>
                  {m.role === 'agent' && (
                    <div className="agent-meta">
                      <span className="ai-label">AI</span> Migration Copilot · Anthropic Claude
                      {m.confidence && <span className="conf-pill">confidence: {m.confidence}%</span>}
                    </div>
                  )}
                  <div className={`chat-bubble ${m.role}`}>{renderText(m.text)}</div>
                </div>
              ))}
              {loading && (
                <div>
                  <div className="agent-meta"><span className="ai-label">AI</span> Thinking…</div>
                  <div className="chat-bubble agent">⏳</div>
                </div>
              )}
            </div>
            <div className="chat-input-row">
              <input
                value={input} onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && send()}
                placeholder="Ask about migration, data products, quality, or business insights..."
              />
              <button className="btn btn-primary btn-sm" onClick={() => send()}>Send ↑</button>
            </div>
          </div>
          <div className="mt-12">
            <div className="text-muted mb-8">Suggested questions:</div>
            <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
              {[
                'Which migrated finance data products have a quality risk?',
                'What is the current migration readiness score?',
                'Show Wave 1 progress and blockers',
                'Generate auto-insights for Sales Analytics data product',
                'Which BEX queries have not been migrated yet?',
              ].map(q => (
                <span key={q} className="tag" style={{cursor:'pointer'}} onClick={() => send(q)}>{q}</span>
              ))}
            </div>
          </div>
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          <div className="card">
            <div className="card-title mb-8">Data Product Context</div>
            <div style={{display:'flex',flexDirection:'column',gap:6}}>
              {dataProducts.map(dp => (
                <div key={dp.id} className="flex-between" style={{padding:8,background: dp.qualityScore >= 80 ? 'var(--green-lite)' : dp.qualityScore ? 'var(--orange-lite)' : 'var(--bg)',borderRadius:6}}>
                  <div>
                    <span className="font-bold text-sm">{dp.name}</span>
                    <div className="text-muted">{dp.domain} · {dp.sourceInfoProviders.length} InfoProviders</div>
                  </div>
                  <Badge status={dp.qualityScore ? (dp.qualityScore >= 80 ? 'Pass' : 'Warn') : 'Draft'}
                    label={dp.qualityScore ? `${dp.qualityScore}% quality` : 'Draft'} />
                </div>
              ))}
            </div>
          </div>
          <div className="ai-panel">
            <div className="ai-panel-header"><span className="ai-label">AI</span> Autonomous Insights Generation Agent</div>
            <div className="ai-rec"><span className="ai-rec-icon">⚡</span><div className="ai-rec-text">Create a remediation action for PC_FI_DELTA timeliness fix<span className="conf-pill">Auto-suggested</span></div></div>
            <div className="ai-rec"><span className="ai-rec-icon">📊</span><div className="ai-rec-text">Weekly quality scorecard for Finance Core DP — scheduled every Monday 08:00</div></div>
            <div className="ai-rec"><span className="ai-rec-icon">🔔</span><div className="ai-rec-text">Data catalogue updated: 3 new glossary terms approved in BDC Datasphere</div></div>
            <button className="btn btn-primary btn-sm mt-8" onClick={() => navigate('/action-center')}>Review in Action Center →</button>
          </div>
        </div>
      </div>
    </>
  )
}
