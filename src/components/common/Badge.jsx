const variantMap = {
  'On Track':   'badge-green',
  'Done':       'badge-green',
  'Pass':       'badge-green',
  'Running':    'badge-green',
  'Executed':   'badge-green',
  'Auto':       'badge-green',
  'Approved':   'badge-green',
  'Migrate':    'badge-green',
  'In Progress':'badge-blue',
  'Selected':   'badge-blue',
  'Analyzing':  'badge-blue',
  'Processing': 'badge-blue',
  'Converted':  'badge-blue',
  'Converting': 'badge-purple',
  'Partial':    'badge-orange',
  'In Review':  'badge-orange',
  'Planned':    'badge-orange',
  'Warn':       'badge-orange',
  'Pending':    'badge-gray',
  'Not Started':'badge-gray',
  'Idle':       'badge-gray',
  'Draft':      'badge-gray',
  'Defer':      'badge-gray',
  'Blocked':    'badge-red',
  'Error':      'badge-red',
  'Failed':     'badge-red',
  'Retire':     'badge-red',
  'Manual':     'badge-red',
  'Redesign':   'badge-purple',
}

export default function Badge({ status, label }) {
  const text = label ?? status
  const cls  = variantMap[status] ?? 'badge-gray'
  return <span className={`badge ${cls}`}>{text}</span>
}
