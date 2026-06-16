import React from 'react'

function Specs() {
  const tables = [
    { name: 'territory_assistants', purpose: 'Employee profiles & phone mapping' },
    { name: 'zones', purpose: 'Geographic zone definitions' },
    { name: 'areas', purpose: 'Areas linked to zones' },
    { name: 'product_families', purpose: 'Product family categories' },
    { name: 'products', purpose: 'Products under families' },
    { name: 'skus', purpose: 'SKU variants (size + unit)' },
    { name: 'ta_daily_liquidation', purpose: 'Daily stock records' },
    { name: 'whatsapp_conversations', purpose: 'Conversation state tracking' },
    { name: 'whatsapp_processed_entries', purpose: 'Processed entry audit log' },
  ]

  const registrationSteps = ['askEmployee', 'askHQ', 'askZone', 'askArea', 'askProfileConfirmation']
  const mainFlowSteps = ['askDateSelection', 'askProductFamily', 'askProductName', 'askSKU', 'askOverwrite', 'askAnotherInFamily', 'askAnotherFamily']
  const reviewSteps = ['askReviewProducts', 'askSelectProductToEdit', 'askEditFieldSelection']
  const editSteps = ['askNewInwardStock', 'askNewLiquidationQty', 'askNewReturnQty']

  const techDetails = [
    { label: 'Workflow Engine', value: 'n8n (self-hosted)' },
    { label: 'API Version', value: 'Facebook Graph API v22.0' },
    { label: 'Database', value: 'PostgreSQL' },
    { label: 'Session Timeout', value: 'Configurable (auto-expire)' },
    { label: 'Retry Strategy', value: 'Exponential Backoff (5 retries)' },
    { label: 'Max List Items', value: '10 per WhatsApp list' },
    { label: 'Max Buttons', value: '3 per message' },
    { label: 'Daily Reminder', value: '7:00 PM IST' },
    { label: 'Error Handling', value: 'Rate limit #131056 aware' },
    { label: 'Stock Validation', value: 'Future balance protection' },
  ]

  return (
    <section className="section specs" id="specs">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Technical Specifications</span>
          <h2 className="section-title">Database <span className="gradient-text">Schema & Specs</span></h2>
          <p className="section-desc">Core database tables and technical specifications powering the Liquidation Tracker.</p>
        </div>
        <div className="specs-grid">
          {/* Database Tables Card */}
          <div className="spec-card">
            <div className="spec-header">
              <div className="spec-icon">🗄️</div>
              <h3>Database Tables</h3>
            </div>
            <div className="spec-table">
              <div className="table-row header">
                <span>Table Name</span>
                <span>Purpose</span>
              </div>
              {tables.map((table) => (
                <div className="table-row" key={table.name}>
                  <span className="table-code">{table.name}</span>
                  <span>{table.purpose}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Conversation Steps Card */}
          <div className="spec-card">
            <div className="spec-header">
              <div className="spec-icon">⚙️</div>
              <h3>Conversation Steps</h3>
            </div>
            <div className="steps-list">
              {registrationSteps.map((step) => (
                <div className="step-chip registration" key={step}>{step}</div>
              ))}
              {mainFlowSteps.map((step) => (
                <div className="step-chip main" key={step}>{step}</div>
              ))}
              {reviewSteps.map((step) => (
                <div className="step-chip review" key={step}>{step}</div>
              ))}
              {editSteps.map((step) => (
                <div className="step-chip edit" key={step}>{step}</div>
              ))}
            </div>
            <div className="step-legend">
              <span className="step-legend-item">
                <span className="dot registration"></span> Registration
              </span>
              <span className="step-legend-item">
                <span className="dot main"></span> Main Flow
              </span>
              <span className="step-legend-item">
                <span className="dot review"></span> Review
              </span>
              <span className="step-legend-item">
                <span className="dot edit"></span> Edit
              </span>
            </div>
          </div>

          {/* Key Technical Details Card */}
          <div className="spec-card wide">
            <div className="spec-header">
              <div className="spec-icon">🔧</div>
              <h3>Key Technical Details</h3>
            </div>
            <div className="tech-details-grid">
              {techDetails.map((detail, idx) => (
                <div className="tech-detail" key={idx}>
                  <span className="td-label">{detail.label}</span>
                  <span className="td-value">{detail.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Specs
