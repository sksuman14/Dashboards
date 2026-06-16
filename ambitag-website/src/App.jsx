import React, { useState, useEffect } from 'react';
import ambitagImg from '../images/ambitag.png';

const App = () => {
  return (
    <div className="app">
      <div className="bg-gradient-circle circle-1"></div>
      <div className="bg-gradient-circle circle-2"></div>

      <Navbar />
      <Hero />
      <AmbiTagBlue />
      <KeyBenefits />
      <Applications />
      <Technology />
      <HardwareComponents />
      <FirmwareIntelligence />
      <BatteryPerformance />
      <Footer />
    </div>
  );
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <h2 className="logo">AMBITAG</h2>
        
        <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          <a href="#blue" onClick={() => setIsMenuOpen(false)}>AmbiTag Blue</a>
          <a href="#benefits" onClick={() => setIsMenuOpen(false)}>Benefits</a>
          <a href="#applications" onClick={() => setIsMenuOpen(false)}>Applications</a>
          <a href="#hardware" onClick={() => setIsMenuOpen(false)}>Hardware</a>
        </div>

        <div className={`hamburger ${isMenuOpen ? 'open' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="container hero">
      <div className="hero-content">
        <h1>Advanced Environmental Logging</h1>
        <p>
          Ambitag is a standalone, battery-operated electronic device designed to monitor and record environmental and motion-related parameters. Protect your temperature-sensitive assets with precision.
        </p>
        <a href="#blue" className="btn">Explore Ambitag</a>
      </div>
      <div className="hero-image">
        <img
          src={ambitagImg}
          alt="AmbiTag USB Device"
          style={{ width: '100%', maxWidth: '500px', borderRadius: '20px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', animation: 'float 6s ease-in-out infinite' }}
        />
      </div>
    </section>
  );
};

const AmbiTagBlue = () => (
  <section id="blue" className="section container">
    <h2 className="section-title">AmbiTag Blue: Wireless Evolution</h2>
    <div className="glass" style={{ textAlign: 'center' }}>
      <p style={{ color: 'var(--text-muted)', marginBottom: '20px', fontSize: '1.2rem' }}>
        AmbiTag Blue represents the next generation of environmental data logging. By leveraging Bluetooth Low Energy (BLE 5.0) technology, it eliminates the need for physical USB connections.
      </p>
      <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>
        The system automatically captures environmental data and enables seamless wireless retrieval through a mobile application.
      </p>
    </div>
  </section>
);

const KeyBenefits = () => {
  const benefits = [
    { title: "Wireless Connectivity", desc: "BLE-based communication removes cable dependencies." },
    { title: "Real-Time Monitoring", desc: "Environmental data can be accessed quickly and efficiently." },
    { title: "Ultra-Low Power Operation", desc: "Advanced firmware sleep modes minimize energy consumption." },
    { title: "Long Battery Life", desc: "Operates on a single CR2032 coin-cell battery for over four years." },
    { title: "Scalable Deployment", desc: "Suitable for large-scale agricultural and pharmaceutical applications." }
  ];

  return (
    <section id="benefits" className="section container">
      <h2 className="section-title">Key Benefits</h2>
      <div className="grid-3">
        {benefits.map((item, index) => (
          <div key={index} className="glass">
            <h3 className="card-title">{item.title}</h3>
            <p style={{ color: 'var(--text-muted)' }}>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const Applications = () => {
  const apps = [
    { title: "Agriculture", items: ["Precision farming", "Produce transportation", "Storage condition monitoring"] },
    { title: "Healthcare", items: ["Vaccine transportation", "Pharmaceutical storage", "Blood bank monitoring"] },
    { title: "Logistics", items: ["Cold-chain transportation", "Warehouse environmental tracking", "Transit condition verification"] }
  ];

  return (
    <section id="applications" className="section container">
      <h2 className="section-title">Applications</h2>
      <div className="grid-3">
        {apps.map((app, index) => (
          <div key={index} className="glass">
            <h3 className="card-title">{app.title}</h3>
            <ul style={{ color: 'var(--text-muted)', paddingLeft: '20px' }}>
              {app.items.map((item, i) => <li key={i}>{item}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
};

const Technology = () => (
  <section className="section container">
    <h2 className="section-title">Technology & Architecture</h2>
    <div className="grid-2">
      <div className="glass">
        <h3 className="card-title">Sensors & Communication</h3>
        <ul style={{ color: 'var(--text-muted)', paddingLeft: '20px' }}>
          <li>Temperature & Humidity sensor</li>
          <li>Three-axis accelerometer</li>
          <li>I²C communication for sensors</li>
          <li>SPI communication for memory</li>
        </ul>
      </div>
      <div className="glass">
        <h3 className="card-title">Storage & Power</h3>
        <ul style={{ color: 'var(--text-muted)', paddingLeft: '20px' }}>
          <li>Internal flash memory stores environmental and movement data</li>
          <li>Dual power architecture: USB power or CR2032 coin-cell battery</li>
        </ul>
      </div>
    </div>
  </section>
);

const HardwareComponents = () => (
  <section id="hardware" className="section container">
    <h2 className="section-title">Hardware Components</h2>
    <div className="grid-2">
      <div className="glass">
        <h3 className="card-title">Microcontroller</h3>
        <div style={{ marginBottom: '15px' }}>
          <h4 style={{ color: '#fff', marginBottom: '5px' }}>AmbiTag (STM32L412KBT6)</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Ultra-low-power ARM Cortex-M4 microcontroller featuring low standby current, USB interface support, and extended battery life.</p>
        </div>
        <div>
          <h4 style={{ color: '#fff', marginBottom: '5px' }}>AmbiTag Blue (Nordic nRF52832)</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>64 MHz Arm Cortex-M4 CPU, Bluetooth 5.2 support, integrated wireless transceiver, and ultra-low-power operation.</p>
        </div>
      </div>
      <div className="glass">
        <h3 className="card-title">Sensors</h3>
        <div style={{ marginBottom: '15px' }}>
          <h4 style={{ color: '#fff', marginBottom: '5px' }}>Sensirion SHT40 (Temp & Humidity)</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Accuracy: ±0.2°C, ±1.8% RH. Resolution: 0.01. Operating voltage down to 1.08V.</p>
        </div>
        <div>
          <h4 style={{ color: '#fff', marginBottom: '5px' }}>LIS3DHTR Accelerometer (Motion)</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Orientation detection, free-fall detection, vibration monitoring, and movement tracking.</p>
        </div>
      </div>
      <div className="glass" style={{ gridColumn: '1 / -1' }}>
        <h3 className="card-title">Memory</h3>
        <p style={{ color: 'var(--text-muted)' }}>Winbond W25Q16JV - 2 MB storage capacity, serial flash memory with low operating current.</p>
      </div>
    </div>
  </section>
);

const FirmwareIntelligence = () => (
  <section className="section container">
    <h2 className="section-title">Firmware Intelligence</h2>
    <div className="grid-3">
      <div className="glass">
        <h3 className="card-title">Data Logging Process</h3>
        <ol style={{ color: 'var(--text-muted)', paddingLeft: '20px' }}>
          <li>User activates the device.</li>
          <li>Sensors begin monitoring.</li>
          <li>Temp, humidity, and motion recorded.</li>
          <li>Stored in internal flash memory.</li>
          <li>Retrieved through USB or wireless interfaces.</li>
        </ol>
      </div>
      <div className="glass">
        <h3 className="card-title">Alert Mechanism</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '10px' }}>Alerts users when conditions exceed limits. Configurable settings:</p>
        <ul style={{ color: 'var(--text-muted)', paddingLeft: '20px' }}>
          <li>Temperature & Humidity thresholds</li>
          <li>Logging intervals</li>
          <li>Date, time, and time zones</li>
        </ul>
      </div>
      <div className="glass">
        <h3 className="card-title">Power Optimization</h3>
        <p style={{ color: 'var(--text-muted)', marginBottom: '10px' }}>Strategies used for power efficiency:</p>
        <ul style={{ color: 'var(--text-muted)', paddingLeft: '20px' }}>
          <li>Standby and shutdown modes</li>
          <li>Sensor power switching</li>
          <li>Internal pull-up resistors</li>
          <li>Reduced clock frequencies</li>
          <li>BLE low-energy protocols</li>
        </ul>
      </div>
    </div>
  </section>
);

const BatteryPerformance = () => (
  <section className="section container">
    <div className="glass battery-glass">
      <h2 className="battery-title">Battery Performance</h2>
      <p className="battery-desc">
        Experimental validation demonstrated exceptional battery life: 1 µA sleep mode current, 6 mA active logging current, and 15.3 mA peak current.
      </p>
      <div className="battery-stats">
        <div className="battery-stat">
          <h3>4.6</h3>
          <p>Years Lifespan</p>
        </div>
        <div className="battery-stat">
          <h3>240,000</h3>
          <p>Total Logs</p>
        </div>
        <div className="battery-stat">
          <h3>1µA</h3>
          <p>Sleep Current</p>
        </div>
      </div>
      <p style={{ marginTop: '30px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        *Based on a single 220 mAh CR2032 coin-cell battery with a 10-minute logging interval.
      </p>
    </div>
  </section>
);

const Footer = () => (
  <footer className="footer">
    <h3>AmbiTag – Smart Environmental Monitoring for a Safer Cold Chain</h3>
    <p>
      Advancing cold-chain technology through innovative sensing, intelligent firmware, and ultra-low-power wireless design.
    </p>
  </footer>
);

export default App;
