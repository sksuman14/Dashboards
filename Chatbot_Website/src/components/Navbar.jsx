import { useState, useEffect } from 'react'

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)

      // Active section tracking logic
      const sections = ['features', 'how-it-works', 'architecture', 'workflow', 'specs', 'contact']
      const scrollPosition = window.scrollY + 200

      for (const section of sections) {
        const el = document.getElementById(section)
        if (el) {
          const top = el.offsetTop
          const height = el.offsetHeight
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const links = [
    { href: '#features', label: 'Features' },
    { href: '#how-it-works', label: 'How It Works' },
    { href: '#architecture', label: 'Architecture' },
    { href: '#workflow', label: 'Workflow' },
    { href: '#specs', label: 'Specifications' },
    { href: '#contact', label: 'Contact' },
  ]

  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add('nav-open')
    } else {
      document.body.classList.remove('nav-open')
    }
    return () => {
      document.body.classList.remove('nav-open')
    }
  }, [menuOpen])

  const handleLinkClick = (e, href) => {
    e.preventDefault()
    setMenuOpen(false)
    const target = document.querySelector(href)
    if (target) {
      const top = target.getBoundingClientRect().top + window.scrollY - 80
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  return (
    <>
      <div className={`nav-backdrop ${menuOpen ? 'active' : ''}`} onClick={toggleMenu}></div>
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <a href="#" className="nav-logo">
            <div className="logo-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect x="2" y="2" width="24" height="24" rx="6" stroke="url(#logoGrad)" strokeWidth="2.5"/>
                <path d="M8 14L12 18L20 10" stroke="url(#logoGrad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <defs>
                  <linearGradient id="logoGrad" x1="2" y1="2" x2="26" y2="26">
                    <stop stopColor="#25D366"/>
                    <stop offset="1" stopColor="#128C7E"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span>Liquidation Tracker</span>
          </a>
          <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
            <div className="mobile-menu-header">
              <div className="mobile-logo">
                <div className="logo-icon">
                  <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
                    <rect x="2" y="2" width="24" height="24" rx="6" stroke="url(#logoGradMobile)" strokeWidth="2.5"/>
                    <path d="M8 14L12 18L20 10" stroke="url(#logoGradMobile)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <defs>
                      <linearGradient id="logoGradMobile" x1="2" y1="2" x2="26" y2="26">
                        <stop stopColor="#25D366"/>
                        <stop offset="1" stopColor="#128C7E"/>
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
                <span>Liquidation Tracker</span>
              </div>
              <button className="mobile-menu-close" onClick={toggleMenu} aria-label="Close menu">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            {links.map((link) => (
              <a 
                key={link.href} 
                href={link.href} 
                className={`nav-link ${activeSection === link.href.substring(1) ? 'active' : ''}`} 
                onClick={(e) => handleLinkClick(e, link.href)}
              >
                {link.label}
              </a>
            ))}
          </div>
          <button className={`nav-toggle ${menuOpen ? 'active' : ''}`} onClick={toggleMenu} aria-label="Toggle navigation">
            <span></span><span></span><span></span>
          </button>
        </div>
      </nav>
    </>
  )
}

export default Navbar
