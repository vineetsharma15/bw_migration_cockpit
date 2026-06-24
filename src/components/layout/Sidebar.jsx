import { NavLink } from 'react-router-dom'

const navConfig = [
  {
    items: [
      { to: '/command-center', icon: '🏠', label: 'Command Center' },
    ]
  },
  {
    section: 'Step 1 · Assess & Plan',
    items: [
      { to: '/bw-discovery',        icon: '🔍', label: 'BW Discovery'         },
      { to: '/dependency-explorer', icon: '🕸',  label: 'Dependency Explorer'  },
      { to: '/rationalization',     icon: '⚖',  label: 'Rationalization', badge: '12' },
      { to: '/tco-calculator',      icon: '💰', label: 'TCO Calculator'        },
    ]
  },
  {
    section: 'Step 2 · Lift to BW PCE',
    items: [
      { to: '/pce-planner',   icon: '☁',  label: 'BW to BW PCE'   },
      { to: '/wave-planner',  icon: '📅', label: 'Wave Planner'    },
      { to: '/query-analyzer',icon: '📋', label: 'BEX Query / FSD' },
    ]
  },
  {
    section: 'Step 3 · Shift to BDC Data Products',
    items: [
      { to: '/extractor-cds',       icon: '🔄', label: 'Extractor → CDS'    },
      { to: '/infoprovider-mapper',  icon: '🗺', label: 'InfoProvider Mapper' },
      { to: '/data-product-studio',  icon: '🏭', label: 'Data Product Studio' },
      { to: '/data-quality',         icon: '🧪', label: 'Data Quality'        },
    ]
  },
  {
    section: 'Step 4A · AI Driven Consumption',
    items: [
      { to: '/ai-copilot',        icon: '💬', label: 'AI Co-pilot'        },
      { to: '/persona-workspace', icon: '👤', label: 'Persona Workspace'  },
    ]
  },
  {
    section: 'Step 4B · Autonomous Insights to Action',
    items: [
      { to: '/action-center', icon: '⚡', label: 'Autonomous Actions', badge: '5' },
      { to: '/agent-console', icon: '🤖', label: 'Agent Console'                  },
    ]
  },
  {
    section: 'Administration',
    items: [
      { to: '/user-management', icon: '👥', label: 'User Management' },
      { to: '/connections',     icon: '🔌', label: 'Connections'     },
    ]
  },
]

export default function Sidebar() {
  return (
    <nav className="sidebar">
      {navConfig.map((group, gi) => (
        <div className="nav-section" key={gi}>
          {group.section && <div className="nav-section-label">{group.section}</div>}
          {group.items.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => 'nav-item' + (isActive ? ' active' : '')}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
              {item.badge && <span className="nav-badge">{item.badge}</span>}
            </NavLink>
          ))}
        </div>
      ))}
    </nav>
  )
}
