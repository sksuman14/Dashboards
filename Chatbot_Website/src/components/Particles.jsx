import { useEffect, useRef } from 'react'

function Particles() {
  const containerRef = useRef(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const colors = ['#25D366', '#128C7E', '#6C63FF', '#4ECDC4', '#FFB347']
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement('div')
      particle.classList.add('particle')
      const size = Math.random() * 4 + 2
      particle.style.width = `${size}px`
      particle.style.height = `${size}px`
      particle.style.left = `${Math.random() * 100}%`
      particle.style.top = `${Math.random() * 100}%`
      particle.style.background = colors[Math.floor(Math.random() * colors.length)]
      particle.style.animationDuration = `${15 + Math.random() * 20}s`
      particle.style.animationDelay = `${Math.random() * 10}s`
      container.appendChild(particle)
    }
  }, [])

  return <div className="bg-particles" ref={containerRef}></div>
}

export default Particles
