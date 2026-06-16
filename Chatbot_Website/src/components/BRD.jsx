import React from 'react'

function BRD() {
  const requirements = [
    {
      num: '01',
      title: 'Objective',
      desc: 'Digitize daily liquidation reporting for 200+ Active Territory Assistants across Syngenta territories, replacing manual processes with an automated WhatsApp-based system.',
    },
    {
      num: '02',
      title: 'Data Capture',
      desc: 'Capture daily Stock Inward (opening stock received), Liquidation Quantity (stock sold/distributed), and Sales Returns per product SKU per territory assistant.',
    },
    {
      num: '03',
      title: 'Validation Rules',
      desc: 'Enforce business rules - liquidation cannot exceed available stock, returns cannot exceed stock on hand, and future dated entries maintain positive balances.',
    },
    {
      num: '04',
      title: 'Compliance',
      desc: 'Automated daily reminders ensure complete data submission. Chat logs and processed entries maintain full audit trails for compliance requirements.',
    },
  ]

  return (
    <section className="section brd-section" id="brd">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Business Requirements</span>
          <h2 className="section-title">Project <span className="gradient-text">Overview & BRD</span></h2>
          <p className="section-desc">Key business requirements and objectives for the Liquidation Tracker pilot project.</p>
        </div>
        <div className="brd-grid">
          {requirements.map((req) => (
            <div className="brd-card" key={req.num}>
              <div className="brd-number">{req.num}</div>
              <h3>{req.title}</h3>
              <p>{req.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default BRD
