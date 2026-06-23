import { Outlet } from 'react-router-dom'
import TopBar from './TopBar'
import Sidebar from './Sidebar'
import { useData } from '../../context/DataContext'

export default function Layout() {
  const { loading } = useData()
  return (
    <div className="app-shell">
      <TopBar />
      <div className="app-body">
        <Sidebar />
        <main className="canvas">
          {loading
            ? <div className="loading-screen">⏳ Loading migration data…</div>
            : <Outlet />
          }
        </main>
      </div>
    </div>
  )
}
