const features = [
  {
    icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M14 2C7.373 2 2 7.373 2 14C2 16.628 2.874 19.058 4.347 21.012L2.5 25.5L7.242 23.82C9.088 25.112 11.382 25.88 14 25.88C20.627 25.88 26 20.507 26 13.88" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M10 12H18M10 16H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
    accent: '#25D366', title: 'WhatsApp Native',
    desc: 'Seamless conversational interface through WhatsApp - no app downloads needed. Territory assistants use what they already know.',
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="3" y="5" width="22" height="18" rx="3" stroke="currentColor" strokeWidth="2"/><path d="M3 11H25M9 5V23M9 14H20M9 18H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
    accent: '#6C63FF', title: 'Real-time Stock Tracking',
    desc: 'Track opening stock, daily liquidation quantities, and returns in real-time with automatic balance calculations.',
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><circle cx="14" cy="14" r="11" stroke="currentColor" strokeWidth="2"/><path d="M14 8V14L18 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>,
    accent: '#FF6B6B', title: 'Daily Automated Reminders',
    desc: "Scheduled reminders at 7 PM daily for territory assistants who haven't submitted their liquidation data.",
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M14 3L17 10H24L18 15L20 22L14 18L8 22L10 15L4 10H11L14 3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg>,
    accent: '#FFB347', title: 'Smart Validation',
    desc: 'Intelligent stock validation prevents over-liquidation and negative future balances with real-time checks.',
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><path d="M4 14C4 8.477 8.477 4 14 4C19.523 4 24 8.477 24 14C24 19.523 19.523 24 14 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/><path d="M14 10V14L17 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M4 20L8 24L12 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    accent: '#4ECDC4', title: 'Sales Return Mode',
    desc: 'Dedicated return flow for processing product returns with proper stock adjustment and future balance protection.',
  },
  {
    icon: <svg width="28" height="28" viewBox="0 0 28 28" fill="none"><rect x="4" y="4" width="20" height="20" rx="3" stroke="currentColor" strokeWidth="2"/><path d="M4 10H24" stroke="currentColor" strokeWidth="2"/><path d="M10 10V24" stroke="currentColor" strokeWidth="2"/><circle cx="17" cy="17" r="2" fill="currentColor"/></svg>,
    accent: '#A855F7', title: 'Product Hierarchy',
    desc: 'Organized product catalog with families, products, and SKUs - easily navigable through interactive list menus.',
  },
]

function Features() {
  return (
    <section className="section features" id="features">
      <div className="container">
        <div className="section-header">
          <span className="section-tag">Core Capabilities</span>
          <h2 className="section-title">Powerful Features for <span className="gradient-text">Inventory Management</span></h2>
          <p className="section-desc">A comprehensive system built to streamline daily stock reporting and liquidation tracking across all territories.</p>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <div className="feature-card" key={i}>
              <div className="feature-icon" style={{ '--accent': f.accent }}>{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
