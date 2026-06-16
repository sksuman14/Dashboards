function Architecture() {
  return (
    <section className="section architecture" id="architecture">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">System Design</span>
          <h2 className="section-title">Technical <span className="gradient-text">Architecture</span></h2>
          <p className="section-desc">Built on a robust stack combining WhatsApp Business API, n8n workflow automation, and PostgreSQL.</p>
        </div>
        <div className="arch-grid">
          <div className="arch-card">
            <div className="arch-icon whatsapp">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><path d="M18 3C9.716 3 3 9.716 3 18C3 21.268 4.056 24.296 5.84 26.74L3.75 32.25L9.536 30.276C11.846 31.86 14.652 32.82 18 32.82C26.284 32.82 33 26.104 33 17.82" stroke="#25D366" strokeWidth="2.5" strokeLinecap="round"/><path d="M13 15H23M13 19H20" stroke="#25D366" strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
            <h3>WhatsApp Business API</h3>
            <p>Meta's official API for sending interactive messages with buttons, list menus, and text formatting.</p>
            <ul className="arch-details">
              <li>Interactive Buttons (max 3)</li>
              <li>List Menus (max 10 items)</li>
              <li>Webhook Integration</li>
              <li>Rate Limit Handling</li>
            </ul>
          </div>
          <div className="arch-card">
            <div className="arch-icon n8n">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><rect x="4" y="8" width="12" height="8" rx="2" stroke="#FF6D5A" strokeWidth="2"/><rect x="20" y="8" width="12" height="8" rx="2" stroke="#FF6D5A" strokeWidth="2"/><rect x="12" y="20" width="12" height="8" rx="2" stroke="#FF6D5A" strokeWidth="2"/><path d="M16 12H20M10 16L18 20M26 16L18 20" stroke="#FF6D5A" strokeWidth="2" strokeLinecap="round"/></svg>
            </div>
            <h3>n8n Workflow Engine</h3>
            <p>30+ interconnected nodes handling the entire conversation flow, state management, and error recovery.</p>
            <ul className="arch-details">
              <li>Conversation State Machine</li>
              <li>Dynamic Query Execution</li>
              <li>Exponential Backoff Retry</li>
              <li>Session Management</li>
            </ul>
          </div>
          <div className="arch-card">
            <div className="arch-icon postgres">
              <svg width="36" height="36" viewBox="0 0 36 36" fill="none"><ellipse cx="18" cy="10" rx="12" ry="4" stroke="#336791" strokeWidth="2"/><path d="M6 10V26C6 28.209 11.373 30 18 30C24.627 30 30 28.209 30 26V10" stroke="#336791" strokeWidth="2"/><path d="M6 18C6 20.209 11.373 22 18 22C24.627 22 30 20.209 30 18" stroke="#336791" strokeWidth="2"/></svg>
            </div>
            <h3>PostgreSQL Database</h3>
            <p>Relational database storing all territory data, product hierarchies, daily liquidation records, and conversation states.</p>
            <ul className="arch-details">
              <li>Territory Assistants</li>
              <li>Products & SKUs</li>
              <li>Daily Liquidation Records</li>
              <li>Conversation State</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Architecture
