import { Link } from 'react-router-dom'

export default function PageHeader({ crumbs = [], title, sub, actions }) {
  return (
    <div className="page-header">
      {crumbs.length > 0 && (
        <div className="breadcrumb">
          {crumbs.map((c, i) => (
            <span key={i}>
              {i > 0 && ' / '}
              {c.to ? <Link to={c.to}>{c.label}</Link> : c.label}
            </span>
          ))}
        </div>
      )}
      <div className="page-header-row">
        <div>
          <h1>{title}</h1>
          {sub && <div className="sub">{sub}</div>}
        </div>
        {actions && <div className="btn-group">{actions}</div>}
      </div>
    </div>
  )
}
