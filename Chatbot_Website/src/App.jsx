import { useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import HowItWorks from './components/HowItWorks'
import Architecture from './components/Architecture'
import Workflow from './components/Workflow'
import Specs from './components/Specs'
import BRD from './components/BRD'
import Contact from './components/Contact'
import Footer from './components/Footer'
import WhatsAppFloat from './components/WhatsAppFloat'
import Particles from './components/Particles'

function App() {
  useEffect(() => {
    // Scroll reveal observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
    )

    const elements = document.querySelectorAll('.reveal, .feature-card, .step-item, .arch-card, .brd-card, .spec-card')
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <>
      <Particles />
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Architecture />
      <Workflow />
      <Specs />
      <BRD />
      <Contact />
      <Footer />
      <WhatsAppFloat />
    </>
  )
}

export default App
