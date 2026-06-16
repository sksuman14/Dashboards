import React from 'react'

function Contact() {
  return (
    <section className="section contact" id="contact">
      <div className="container">
        <div className="cta-card">
          <div className="cta-content">
            <h2>Ready to <span className="gradient-text">Try the Demo?</span></h2>
            <p>Launch the Liquidation Tracker directly on WhatsApp to try out the system and see a live demo in action!</p>
            <div className="cta-buttons">
              <a
                href="https://wa.me/917087032853"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-whatsapp"
                id="ctaWhatsapp"
              >
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                  <path d="M11 1C5.477 1 1 5.477 1 11C1 13.015 1.611 14.89 2.665 16.455L1.25 20.75L5.718 19.437C7.194 20.362 8.987 20.9 11 20.9C16.523 20.9 21 16.423 21 10.9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <path d="M8 9C8 9 8.5 7 11 7C13.5 7 14 9 14 9C14 9 14 11 11 13C8 11 8 9 8 9Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Try the Demo on WhatsApp
              </a>
              <a href="mailto:awadhropar@gmail.com" className="btn btn-secondary">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M2 6L10 12L18 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Contact Support
              </a>
            </div>
          </div>
          <div className="cta-decoration">
            <div className="cta-circle c1"></div>
            <div className="cta-circle c2"></div>
            <div className="cta-circle c3"></div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
