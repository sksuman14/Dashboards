const steps = [
  { num: '01', title: 'Registration & Authentication', desc: 'Territory assistant sends a message. System verifies the phone number against the database, checks authorization, and loads or creates their profile.', tags: ['Phone Verification', 'Profile Setup', 'Zone & Area'] },
  { num: '02', title: 'Date Selection', desc: 'User selects the recording date - Today, Yesterday, or a custom date up to 7 days back. Manual date entry in YYYY-MM-DD format is also supported.', tags: ['Today / Yesterday', 'Custom Date', 'Date Validation'] },
  { num: '03', title: 'Product Selection', desc: 'Browse product families, select specific products, and view all SKUs with their calculated opening stock and safe available quantities.', tags: ['Product Families', 'SKU Browser', 'Stock Display'] },
  { num: '04', title: 'Data Entry', desc: 'Enter inward stock and liquidation quantities for each SKU. The system validates entries against available stock and future balance constraints in real-time.', tags: ['Bulk Entry', 'Inward & Liquidation', 'Validation'] },
  { num: '05', title: 'Review & Submit', desc: 'Review all entered products, edit individual fields if needed, then submit. The system saves to the database and sends a detailed summary confirmation.', tags: ['Product Review', 'Edit Support', 'Final Summary'] },
]

function HowItWorks() {
  return (
    <section className="section how-it-works" id="how-it-works">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">User Journey</span>
          <h2 className="section-title">How <span className="gradient-text">It Works</span></h2>
          <p className="section-desc">A streamlined conversational flow guides territory assistants through the entire reporting process.</p>
        </div>
        <div className="steps-timeline">
          <div className="timeline-line"></div>
          {steps.map((step, i) => (
            <div className="step-item" key={i}>
              <div className="step-number">{step.num}</div>
              <div className="step-content">
                <h3>{step.title}</h3>
                <p>{step.desc}</p>
                <div className="step-tags">
                  {step.tags.map((tag, j) => <span key={j}>{tag}</span>)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
