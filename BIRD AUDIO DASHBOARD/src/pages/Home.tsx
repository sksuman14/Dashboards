import { useState } from 'react';
import { ArrowRight, Cpu, MemoryStick, ActivitySquare, BarChart3, Cloud, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import '../App.css';
import aviearDevice from '../assets/aviear_device.png';
import aviearAssembly from '../assets/aviear_assembly.png';
import deployment1 from '../assets/images/1.jpeg';
import deployment2 from '../assets/images/2.jpeg';
import deployment3 from '../assets/images/3.jpeg';
import deployment4 from '../assets/images/4.jpeg';
import deployment5 from '../assets/images/5.jpeg';
import deployment6 from '../assets/images/6.jpeg';

const deploymentImages = [
  { src: deployment1, alt: 'Deployment 1' },
  { src: deployment2, alt: 'Deployment 2' },
  { src: deployment3, alt: 'Deployment 3' },
  { src: deployment4, alt: 'Deployment 4' },
  { src: deployment5, alt: 'Deployment 5' },
  { src: deployment6, alt: 'Deployment 6' },
];

export default function Home() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = () => {
    setActiveIndex((prev) => (prev + 1) % deploymentImages.length);
  };

  const prevSlide = () => {
    setActiveIndex((prev) => (prev - 1 + deploymentImages.length) % deploymentImages.length);
  };

  return (
    <div className="home-container">
      {/* Navigation */}
      <nav className="home-nav">
        <div className="logo">
          <ActivitySquare className="text-honey-primary" size={28} />
          <span>AviEar</span>
        </div>
        <div className="nav-actions">
          <ul className="nav-links">
            <li><a href="#deployment" className="nav-link">Deployment</a></li>
          </ul>
          <button className="nav-cta" onClick={() => navigate('/dashboard')}>
            Live Data <ArrowRight size={18} />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="badge">Next Gen Acoustic Monitoring</div>
          <h1 className="hero-title">Meet <span className="highlight">AviEar</span></h1>
          <p className="hero-subtitle">
            Captures the sound of birds at a certain threshold and sends the data seamlessly to the AWS cloud for advanced analysis.
          </p>

          <div className="hero-stats">
            <div className="stat-item">
              <Cloud className="stat-icon" size={24} />
              <div>
                <span className="stat-value">AWS Sync</span>
                <span className="stat-label">Real-time Data</span>
              </div>
            </div>
            <div className="stat-item">
              <Shield className="stat-icon" size={24} />
              <div>
                <span className="stat-value">99.9%</span>
                <span className="stat-label">Uptime</span>
              </div>
            </div>
            <div className="stat-item">
              <BarChart3 className="stat-icon" size={24} />
              <div>
                <span className="stat-value">BirdNET</span>
                <span className="stat-label">Analysis</span>
              </div>
            </div>
          </div>

          <button className="primary-cta" onClick={() => navigate('/dashboard')}>
            View Live Dashboard
            <span className="cta-icon-wrapper">
              <ArrowRight size={20} />
            </span>
          </button>
        </div>
        <div className="hero-visual">
          <div className="glow-effect"></div>
          <img src={aviearDevice} alt="AviEar Device" className="device-img floating" />
        </div>
      </section>

      {/* Assembly Section */}
      <section id="assembly" className="assembly-section">
        <div className="assembly-visual">
          <img src={aviearAssembly} alt="AviEar Assembly" className="assembly-img" />
          <div className="glow-effect secondary"></div>
        </div>
        <div className="assembly-content">
          <h2 className="section-title">Hardware <span className="highlight">Assembly</span></h2>
          <p className="section-text">
            Designed for durability and long-lasting deployment. The AviEar features a high-capacity power bank paired with an efficient custom PCB for uninterrupted acoustic monitoring in remote locations.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section id="capabilities" className="features-section">
        <h2 className="section-title text-center">Core Capabilities</h2>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <ActivitySquare size={24} />
            </div>
            <h3>Microphone With GSM</h3>
            <p>Captures audio data, stores it in flash memory, and subsequently publishes the recorded audio on AWS using the integrated GSM module.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <MemoryStick size={24} />
            </div>
            <h3>Microphone With SD Card</h3>
            <p>Employed to capture audio data continuously and store it directly onto a high-capacity SD card for offline retrieval.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Cpu size={24} />
            </div>
            <h3>Audio Analysis</h3>
            <p>BirdNET processes audio recordings to extract features such as frequency, duration, and spectral patterns to predict bird calls in specific intervals.</p>
          </div>
        </div>
      </section>

      {/* Deployment Section */}
      <section id="deployment" className="deployment-section">
        <div className="section-header text-center">
          <h2 className="section-title">Deployment <span className="highlight">Scenarios</span></h2>
          <p className="section-subtitle">Visualizing real-world applications and installations.</p>
        </div>
        
        {/* Desktop & Tablet Grid */}
        <div className="deployment-grid desktop-only">
          {deploymentImages.map((img, idx) => (
            <div key={idx} className="deployment-card">
              <div className="deployment-image-wrapper">
                <img src={img.src} alt={img.alt} className="deployment-image" loading="lazy" />
              </div>
              <div className="deployment-caption">{img.alt}</div>
            </div>
          ))}
        </div>

        {/* Mobile Slide-by-Slide Carousel */}
        <div className="deployment-carousel-mobile mobile-only">
          <div className="carousel-window">
            <div className="carousel-track" style={{
              width: `${deploymentImages.length * 100}%`,
              transform: `translateX(-${(activeIndex * 100) / deploymentImages.length}%)`
            }}>
              {deploymentImages.map((img, idx) => (
                <div key={idx} className="carousel-slide" style={{
                  width: `${100 / deploymentImages.length}%`,
                  flex: `0 0 ${100 / deploymentImages.length}%`
                }}>
                  <div className="deployment-card">
                    <div className="deployment-image-wrapper">
                      <img src={img.src} alt={img.alt} className="deployment-image" loading="lazy" />
                    </div>
                    <div className="deployment-caption">{img.alt}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Controls */}
          <div className="carousel-controls">
            <button className="carousel-btn prev" onClick={prevSlide} aria-label="Previous slide">
              &larr;
            </button>
            <div className="carousel-dots">
              {deploymentImages.map((_, idx) => (
                <button
                  key={idx}
                  className={`carousel-dot ${idx === activeIndex ? 'active' : ''}`}
                  onClick={() => setActiveIndex(idx)}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
            <button className="carousel-btn next" onClick={nextSlide} aria-label="Next slide">
              &rarr;
            </button>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <p>© AviEar Acoustic Systems. All rights reserved.</p>
      </footer>
    </div>
  );
}
