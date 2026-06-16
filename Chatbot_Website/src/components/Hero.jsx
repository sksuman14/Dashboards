import { useEffect, useRef } from 'react'

function Hero() {
  const statsRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.stat-number')
            counters.forEach((counter) => {
              if (counter.dataset.animated) return
              counter.dataset.animated = 'true'
              const target = parseInt(counter.dataset.count)
              let current = 0
              const step = target / (1500 / 16)
              const update = () => {
                current += step
                if (current >= target) {
                  counter.textContent = target
                } else {
                  counter.textContent = Math.floor(current)
                  requestAnimationFrame(update)
                }
              }
              requestAnimationFrame(update)
            })
          }
        })
      },
      { threshold: 0.3 }
    )
    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  const smoothScroll = (e, href) => {
    e.preventDefault()
    const el = document.querySelector(href)
    if (el) {
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: 'smooth' })
    }
  }

  return (
    <header className="hero" id="hero">
      <div className="hero-content">
        <div className="hero-badge">
          <span className="badge-dot"></span>
          Syngenta - Deployed for 200+ Users
        </div>
        <h1 className="hero-title">
          <span className="title-line">Smart Stock</span>
          <span className="title-line gradient-text">Liquidation Tracker</span>
          <span className="title-line">via WhatsApp</span>
        </h1>
        <p className="hero-description">
          An intelligent WhatsApp chatbot that empowers territory assistants to report daily product liquidation,
          manage stock inward, and track sales returns - all through a seamless conversational interface.
        </p>
        <div className="hero-actions">
          <a href="#how-it-works" className="btn btn-primary" onClick={(e) => smoothScroll(e, '#how-it-works')}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 3L10 17M10 17L16 11M10 17L4 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Explore the System
          </a>
          <a href="#specs" className="btn btn-secondary" onClick={(e) => smoothScroll(e, '#specs')}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 4H16V16H4V4Z" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M7 8H13M7 11H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            View Specs
          </a>
        </div>
        <div className="hero-stats" ref={statsRef}>
          <div className="stat-item">
            <span className="stat-number" data-count="200">0</span><span className="stat-suffix">+</span>
            <span className="stat-label">Active Users</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number" data-count="30">0</span><span className="stat-suffix">+</span>
            <span className="stat-label">n8n Nodes</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number" data-count="7">0</span>
            <span className="stat-label">Database Tables</span>
          </div>
          <div className="stat-divider"></div>
          <div className="stat-item">
            <span className="stat-number" data-count="100">0</span><span className="stat-suffix">%</span>
            <span className="stat-label">Daily Reporting</span>
          </div>
        </div>
      </div>
      <div className="hero-visual">
        <div className="phone-mockup">
          <div className="phone-notch"></div>
          <div className="phone-screen">
            <video className="phone-video" autoPlay loop muted playsInline src="/demo.mp4"></video>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Hero
