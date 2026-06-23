export default function KPICard({ label, value, sub, trend, trendType, barPct, barColor }) {
  return (
    <div className="kpi">
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value}</div>
      {sub && <div className="kpi-sub">{sub}</div>}
      {barPct !== undefined && (
        <div className="kpi-bar mt-8">
          <div className={`kpi-bar-fill ${barColor || ''}`} style={{ width: `${barPct}%` }} />
        </div>
      )}
      {trend && <div className={`kpi-trend ${trendType || ''} mt-4`}>{trend}</div>}
    </div>
  )
}
