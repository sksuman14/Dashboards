import React from 'react'

const rows = [
  [
    { icon: '⚡', label: 'Meta Webhook Trigger', type: 'trigger' },
    { icon: '🔍', label: 'Message Validator', type: 'process' },
    { icon: '📋', label: 'Extract Webhook Data', type: 'process' },
    { icon: '🔐', label: 'Authorization Check', type: 'decision' },
  ],
  [
    { icon: '💾', label: 'Load Conversation', type: 'database' },
    { icon: '⏱️', label: 'Session Check', type: 'decision' },
    { icon: '🧠', label: 'State Manager', type: 'process' },
    { icon: '❓', label: 'Query Needed?', type: 'decision' },
  ],
  [
    { icon: '🗄️', label: 'Execute Query', type: 'database' },
    { icon: '⚙️', label: 'Process Result', type: 'process' },
    { icon: '✅', label: 'Complete?', type: 'decision' },
    { icon: '📱', label: 'Send WhatsApp', type: 'output' },
  ],
  [
    { icon: '💾', label: 'Save Chat Logs', type: 'database' },
    { icon: '📊', label: 'Insert Liquidation', type: 'database' },
    { icon: '📝', label: 'Prepare Summary', type: 'process' },
    { icon: '✉️', label: 'Send Summary', type: 'output' },
  ],
]

const legend = [
  { label: 'Trigger', type: 'trigger' },
  { label: 'Processing', type: 'process' },
  { label: 'Decision', type: 'decision' },
  { label: 'Database', type: 'database' },
  { label: 'Output', type: 'output' },
]

function Workflow() {
  return (
    <section className="section workflow-section" id="workflow">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">n8n Workflow</span>
          <h2 className="section-title">Automated <span className="gradient-text">Workflow Pipeline</span></h2>
          <p className="section-desc">The complete n8n workflow with 30+ nodes orchestrating the entire chatbot lifecycle.</p>
        </div>
        <div className="workflow-diagram">
          {rows.map((row, i) => (
            <div className="workflow-row" key={i}>
              {row.map((node, j) => (
                <React.Fragment key={`${i}-${j}`}>
                  {j > 0 && <div className="wf-arrow"></div>}
                  <div className={`wf-node ${node.type}`}>
                    <div className="wf-node-icon">{node.icon}</div>
                    <span>{node.label}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          ))}
        </div>
        <div className="workflow-legend">
          {legend.map((l, i) => (
            <div className="legend-item" key={i}>
              <span className={`legend-dot ${l.type}`}></span>
              {l.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Workflow
