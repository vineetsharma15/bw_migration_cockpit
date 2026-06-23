import { createContext, useContext, useState, useEffect } from 'react'
import * as svc from '../services/dataService'

const DataContext = createContext(null)

export function DataProvider({ children }) {
  const [dashboard, setDashboard]           = useState(null)
  const [bwObjects, setBwObjects]           = useState([])
  const [waves, setWaves]                   = useState([])
  const [rationalization, setRationalization] = useState(null)
  const [extractors, setExtractors]         = useState([])
  const [queries, setQueries]               = useState([])
  const [dataProducts, setDataProducts]     = useState([])
  const [actions, setActions]               = useState(null)
  const [agents, setAgents]                 = useState(null)
  const [users, setUsers]                   = useState(null)
  const [connections, setConnections]       = useState(null)
  const [loading, setLoading]               = useState(true)

  useEffect(() => {
    Promise.all([
      svc.getDashboard(),
      svc.getBWObjects(),
      svc.getWaves(),
      svc.getRationalization(),
      svc.getExtractors(),
      svc.getQueries(),
      svc.getDataProducts(),
      svc.getActions(),
      svc.getAgents(),
      svc.getUsers(),
      svc.getConnections(),
    ]).then(([dash, objs, wvs, rat, extr, qrs, dps, acts, agts, usrs, conns]) => {
      setDashboard(dash)
      setBwObjects(objs)
      setWaves(wvs)
      setRationalization(rat)
      setExtractors(extr)
      setQueries(qrs)
      setDataProducts(dps)
      setActions(acts)
      setAgents(agts)
      setUsers(usrs)
      setConnections(conns)
      setLoading(false)
    })
  }, [])

  const approveAction = (id) =>
    svc.approveAction(id).then(() =>
      setActions(prev => ({
        ...prev,
        queue: prev.queue.map(a => a.id === id ? { ...a, status: 'Approved' } : a)
      }))
    )

  const updateDecision = (id, decision) =>
    svc.updateDecision(id, decision).then(() =>
      setRationalization(prev => ({
        ...prev,
        objects: prev.objects.map(o => o.id === id ? { ...o, decision } : o)
      }))
    )

  return (
    <DataContext.Provider value={{
      loading,
      dashboard, bwObjects, waves, rationalization,
      extractors, queries, dataProducts, actions, agents,
      users, connections,
      approveAction, updateDecision,
    }}>
      {children}
    </DataContext.Provider>
  )
}

export const useData = () => useContext(DataContext)
