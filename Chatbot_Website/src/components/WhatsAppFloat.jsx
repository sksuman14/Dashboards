import { useState, useEffect } from 'react'

function WhatsAppFloat() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <a
      href="https://wa.me/917087032853"
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="Chat on WhatsApp"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.5)',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
        <path d="M16 2.667C8.636 2.667 2.667 8.636 2.667 16C2.667 18.867 3.533 21.533 5.04 23.733L3.2 28.8L8.467 27.04C10.533 28.4 13.133 29.2 16 29.2C23.364 29.2 29.333 23.231 29.333 15.867" fill="white"/>
        <path d="M22.133 19.067C21.8 18.9 20.133 18.067 19.833 17.967C19.533 17.867 19.3 17.8 19.067 18.133C18.833 18.467 18.167 19.233 17.967 19.467C17.767 19.7 17.567 19.733 17.233 19.567C16.9 19.4 15.8 19.067 14.5 17.9C13.467 16.967 12.767 15.833 12.567 15.5C12.367 15.167 12.567 14.967 12.7 14.833C12.833 14.7 12.967 14.533 13.133 14.333C13.3 14.133 13.367 14 13.467 13.767C13.567 13.533 13.5 13.333 13.433 13.167C13.367 13 12.767 11.333 12.5 10.667C12.233 10.033 11.967 10.1 11.767 10.1C11.567 10.1 11.333 10.067 11.1 10.067C10.867 10.067 10.5 10.167 10.167 10.5C9.833 10.833 9 11.633 9 13.3C9 14.967 10.2 16.567 10.367 16.8C10.533 17.033 12.767 20.5 16.267 21.933C17.1 22.3 17.733 22.5 18.233 22.667C19.067 22.933 19.833 22.9 20.433 22.8C21.1 22.7 22.433 22 22.7 21.2C22.967 20.4 22.967 19.733 22.9 19.6C22.833 19.467 22.6 19.4 22.267 19.233" fill="#25D366"/>
      </svg>
      <span className="whatsapp-tooltip">Chat with us!</span>
    </a>
  )
}

export default WhatsAppFloat
