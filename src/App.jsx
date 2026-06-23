import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { DataProvider } from './context/DataContext'
import Layout from './components/layout/Layout'

import CommandCenter     from './pages/CommandCenter'
import BWDiscovery       from './pages/BWDiscovery'
import DependencyExplorer from './pages/DependencyExplorer'
import Rationalization   from './pages/Rationalization'
import TCOCalculator     from './pages/TCOCalculator'
import PCEPlanner        from './pages/PCEPlanner'
import WavePlanner       from './pages/WavePlanner'
import ExtractorCDS      from './pages/ExtractorCDS'
import QueryAnalyzer     from './pages/QueryAnalyzer'
import InfoProviderMapper from './pages/InfoProviderMapper'
import DataProductStudio from './pages/DataProductStudio'
import DataQuality       from './pages/DataQuality'
import AICopilot         from './pages/AICopilot'
import PersonaWorkspace  from './pages/PersonaWorkspace'
import ActionCenter      from './pages/ActionCenter'
import AgentConsole      from './pages/AgentConsole'
import UserManagement    from './pages/UserManagement'
import Connections       from './pages/Connections'

export default function App() {
  return (
    <DataProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="/command-center" replace />} />
            <Route path="command-center"      element={<CommandCenter />} />
            <Route path="bw-discovery"        element={<BWDiscovery />} />
            <Route path="dependency-explorer" element={<DependencyExplorer />} />
            <Route path="rationalization"     element={<Rationalization />} />
            <Route path="tco-calculator"      element={<TCOCalculator />} />
            <Route path="pce-planner"         element={<PCEPlanner />} />
            <Route path="wave-planner"        element={<WavePlanner />} />
            <Route path="extractor-cds"       element={<ExtractorCDS />} />
            <Route path="query-analyzer"      element={<QueryAnalyzer />} />
            <Route path="infoprovider-mapper" element={<InfoProviderMapper />} />
            <Route path="data-product-studio" element={<DataProductStudio />} />
            <Route path="data-quality"        element={<DataQuality />} />
            <Route path="ai-copilot"          element={<AICopilot />} />
            <Route path="persona-workspace"   element={<PersonaWorkspace />} />
            <Route path="action-center"       element={<ActionCenter />} />
            <Route path="agent-console"       element={<AgentConsole />} />
            <Route path="user-management"     element={<UserManagement />} />
            <Route path="connections"         element={<Connections />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </DataProvider>
  )
}
