import { useState } from 'react'
import KPICard from '../components/common/KPICard'
import PageHeader from '../components/common/PageHeader'

export default function TCOCalculator() {
  const [infraCost, setInfraCost]     = useState(2400000)
  const [fteCost, setFteCost]         = useState(8)
  const [migrationMonths, setMonths]  = useState(18)
  const [bdcLicense, setBdcLicense]   = useState(800000)

  const currentAnnual = infraCost + fteCost * 120000
  const bdcAnnual     = bdcLicense + fteCost * 0.5 * 120000
  const migrationCost = migrationMonths * 80000
  const y1bdc = bdcAnnual + migrationCost / 2
  const y2bdc = bdcAnnual * 0.9
  const y3bdc = bdcAnnual * 0.85
  const current3yr = currentAnnual * 3
  const bdc3yr     = y1bdc + y2bdc + y3bdc
  const savings    = current3yr - bdc3yr
  const payback    = Math.round((migrationCost / ((currentAnnual - bdcAnnual) / 12)))

  const fmt = (n) => `$${(n / 1000000).toFixed(1)}M`

  const bars = [
    { label: 'Y1 (Current)', val: currentAnnual, color: '#bb0000' },
    { label: 'Y2 (Current)', val: currentAnnual, color: '#e9730c' },
    { label: 'Y3 (Current)', val: currentAnnual, color: '#e9730c' },
    { label: 'Y1 (BDC)',     val: y1bdc,         color: '#0070f2' },
    { label: 'Y2 (BDC)',     val: y2bdc,         color: '#2b7a0b' },
    { label: 'Y3 (BDC)',     val: y3bdc,         color: '#2b7a0b' },
  ]
  const maxVal = Math.max(...bars.map(b => b.val))

  return (
    <>
      <PageHeader
        crumbs={[{ label: 'Home', to: '/command-center' }, { label: 'Step 1 · Assess & Plan' }]}
        title="TCO Calculator & Sizing Recommender"
        sub="Step 1 Analysis Agent — Compare current BW cost with BW PCE and BDC target scenarios · AI-powered sizing recommendation"
        actions={<>
          <button className="btn btn-ghost btn-sm">💾 Save Scenario</button>
          <button className="btn btn-primary btn-sm">📊 Export to PPT</button>
        </>}
      />

      <div className="ai-panel mb-12">
        <div className="ai-panel-header"><span className="ai-label">AI</span> Sizing Recommender</div>
        <div className="ai-rec"><span className="ai-rec-icon">📐</span><div className="ai-rec-text"><strong>BDC Tenant Size:</strong> Based on {fteCost} FTE and ${(infraCost/1000000).toFixed(1)}M infra spend, recommend <strong>Medium Enterprise</strong> BDC tenant (S/4HANA sourced, 2 Datasphere spaces).<span className="conf-pill">88%</span></div></div>
        <div className="ai-rec"><span className="ai-rec-icon">⏱</span><div className="ai-rec-text"><strong>Migration Duration:</strong> AI estimates <strong>{migrationMonths} months</strong> based on object complexity and FTE capacity — aligns with selected input.<span className="conf-pill">84%</span></div></div>
        <div className="ai-rec"><span className="ai-rec-icon">💡</span><div className="ai-rec-text"><strong>Cost Optimisation:</strong> Retiring inactive objects first (Wave 1) can reduce BDC storage cost by ~12% and accelerate ROI by 2 months.</div></div>
      </div>

      <div className="grid-split-rev mb-12">
        <div className="card">
          <div className="card-title mb-12">Input Assumptions</div>
          <div style={{display:'flex',flexDirection:'column',gap:14}}>
            {[
              { label:'Annual BW Infrastructure Cost', val:infraCost, set:setInfraCost, min:500000, max:5000000, fmt: v => `$${(v/1000000).toFixed(2)}M` },
              { label:'BW Basis / Support FTE',        val:fteCost,   set:setFteCost,   min:1,      max:20,      fmt: v => `${v} FTE · ~$${(v*120000/1000).toFixed(0)}K/yr` },
              { label:'Migration Effort (months)',     val:migrationMonths, set:setMonths, min:6,   max:36,      fmt: v => `${v} months` },
              { label:'BDC License Assumption',        val:bdcLicense, set:setBdcLicense, min:200000, max:2000000, fmt: v => `$${(v/1000).toFixed(0)}K/yr` },
            ].map(({ label, val, set, min, max, fmt: f }) => (
              <div key={label}>
                <div className="text-muted mb-4">{label}</div>
                <input type="range" min={min} max={max} step={(max-min)/100} value={val} onChange={e => set(+e.target.value)} />
                <div className="flex-between text-muted mt-4">
                  <span>{f(min)}</span><span className="font-bold" style={{color:'var(--text)'}}>{f(val)}</span><span>{f(max)}</span>
                </div>
              </div>
            ))}
            <div>
              <div className="text-muted mb-4">Target Scenario</div>
              <select style={{width:'100%'}}><option>BDC (Full Migration) — Recommended</option><option>BW PCE + BDC (Phased)</option></select>
            </div>
          </div>
        </div>

        <div style={{display:'flex',flexDirection:'column',gap:12}}>
          <div className="grid-2" style={{gap:12}}>
            <KPICard label="3-Year TCO — Current BW" value={<span style={{color:'var(--red)'}}>{fmt(current3yr)}</span>} sub="Infra + Support + License" />
            <KPICard label="3-Year TCO — BDC Target"  value={<span style={{color:'var(--green)'}}>{fmt(bdc3yr)}</span>}   sub="BDC + Migration + Support" />
            <KPICard label="Net Savings (3yr)"         value={<span style={{color:'var(--blue)'}}>{fmt(savings)}</span>}   sub={`${Math.round(savings/current3yr*100)}% reduction`} />
            <KPICard label="Payback Period"            value={<>{payback}<span style={{fontSize:14}}>mo</span></>}          sub="ROI positive from next month" />
          </div>
          <div className="card">
            <div className="card-title mb-12">3-Year Cost Comparison</div>
            <div style={{display:'flex',alignItems:'flex-end',gap:10,height:140,padding:'0 4px'}}>
              {bars.map(b => (
                <div key={b.label} style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
                  <div style={{width:'100%',background:b.color,height:`${(b.val/maxVal)*120}px`,borderRadius:'4px 4px 0 0',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,fontSize:10}}>
                    {fmt(b.val)}
                  </div>
                  <div className="text-muted" style={{fontSize:9,textAlign:'center'}}>{b.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
