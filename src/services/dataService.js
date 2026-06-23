/**
 * Data Service — single access point for all data.
 * Currently reads local JSON. To connect a backend, replace each
 * function body with a fetch() / axios call to the relevant API endpoint.
 */

import dashboard     from '../data/dashboard.json'
import bwObjects     from '../data/bwObjects.json'
import waves         from '../data/waves.json'
import rationalization from '../data/rationalization.json'
import extractors    from '../data/extractors.json'
import queries       from '../data/queries.json'
import dataProducts  from '../data/dataProducts.json'
import actions       from '../data/actions.json'
import agents        from '../data/agents.json'
import copilot       from '../data/copilot.json'
import users         from '../data/users.json'
import connections   from '../data/connections.json'

// — Dashboard / Command Center ——————————————————————————————
export const getDashboard     = () => Promise.resolve(dashboard)

// — BW Objects / Discovery —————————————————————————————————
export const getBWObjects     = () => Promise.resolve(bwObjects)
export const getBWObjectById  = (id) => Promise.resolve(bwObjects.find(o => o.id === id) ?? null)

// — Migration Waves ————————————————————————————————————————
export const getWaves         = () => Promise.resolve(waves)
export const getWaveById      = (id) => Promise.resolve(waves.find(w => w.id === id) ?? null)

// — Rationalization ————————————————————————————————————————
export const getRationalization = () => Promise.resolve(rationalization)
export const updateDecision   = (id, decision) => {
  // TODO: replace with PATCH /api/rationalization/:id
  const obj = rationalization.objects.find(o => o.id === id)
  if (obj) obj.decision = decision
  return Promise.resolve(obj)
}

// — Extractors / CDS ——————————————————————————————————————
export const getExtractors    = () => Promise.resolve(extractors)
export const getExtractorById = (id) => Promise.resolve(extractors.find(e => e.id === id) ?? null)

// — BEx Queries / FSD ————————————————————————————————————
export const getQueries       = () => Promise.resolve(queries)
export const getQueryById     = (id) => Promise.resolve(queries.find(q => q.id === id) ?? null)

// — Data Products ————————————————————————————————————————
export const getDataProducts  = () => Promise.resolve(dataProducts)
export const getDataProductById = (id) => Promise.resolve(dataProducts.find(d => d.id === id) ?? null)

// — Autonomous Actions ————————————————————————————————————
export const getActions       = () => Promise.resolve(actions)
export const approveAction    = (id) => {
  // TODO: replace with POST /api/actions/:id/approve
  const action = actions.queue.find(a => a.id === id)
  if (action) action.status = 'Approved'
  return Promise.resolve(action)
}

// — Agents ————————————————————————————————————————————————
export const getAgents        = () => Promise.resolve(agents)

// — Users ——————————————————————————————————————————————————
export const getUsers         = () => Promise.resolve(users)

// — Connections ———————————————————————————————————————————
export const getConnections   = () => Promise.resolve(connections)

// — Copilot ——————————————————————————————————————————————
export const getCopilotConfig = () => Promise.resolve(copilot)
export const sendCopilotMessage = (message) => {
  // TODO: replace with POST /api/copilot/chat
  const canned = copilot.cannedResponses[message]
  if (canned) return Promise.resolve(canned)
  return Promise.resolve({
    text: `I don't have a specific answer for "${message}" in mock mode. Connect the backend to enable full AI responses.`,
    confidence: null,
    sources: []
  })
}
