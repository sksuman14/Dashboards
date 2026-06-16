import React from 'react'

function Footer() {
  const handleLinkClick = (e, href) => {
    if (href.startsWith('#')) {
      e.preventDefault()
      const target = document.querySelector(href)
      if (target) {
        const top = target.getBoundingClientRect().top + window.scrollY - 80
        window.scrollTo({ top, behavior: 'smooth' })
      }
    }
  }

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="logo-icon">
                <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                  <rect x="2" y="2" width="24" height="24" rx="6" stroke="url(#logoGrad2)" strokeWidth="2.5"/>
                  <path d="M8 14L12 18L20 10" stroke="url(#logoGrad2)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <defs>
                    <linearGradient id="logoGrad2" x1="2" y1="2" x2="26" y2="26">
                      <stop stopColor="#25D366"/>
                      <stop offset="1" stopColor="#128C7E"/>
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <span>Liquidation Tracker</span>
            </div>
            <p>A Syngenta Pilot Project for automated inventory liquidation tracking via WhatsApp.</p>
          </div>
          <div className="footer-links-group">
            <h4>Quick Links</h4>
            <a href="#features" onClick={(e) => handleLinkClick(e, '#features')}>Features</a>
            <a href="#how-it-works" onClick={(e) => handleLinkClick(e, '#how-it-works')}>How It Works</a>
            <a href="#architecture" onClick={(e) => handleLinkClick(e, '#architecture')}>Architecture</a>
            <a href="#workflow" onClick={(e) => handleLinkClick(e, '#workflow')}>Workflow</a>
          </div>
          <div className="footer-links-group">
            <h4>Technical</h4>
            <a href="#specs" onClick={(e) => handleLinkClick(e, '#specs')}>Specifications</a>
            <a href="#brd" onClick={(e) => handleLinkClick(e, '#brd')}>Business Requirements</a>
            <a href="#architecture" onClick={(e) => handleLinkClick(e, '#architecture')}>System Design</a>
          </div>
          <div className="footer-links-group">
            <h4>Contact</h4>
            <a href="https://wa.me/917087032853" target="_blank" rel="noopener noreferrer">WhatsApp</a>
            <a href="mailto:awadhropar@gmail.com">Email</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2026 Syngenta. Liquidation Tracker - Pilot Project. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
