const { useState, useEffect } = React;

const App = () => {
  return (
    <div className="app">
      <div className="bg-gradient-circle circle-1"></div>
      <div className="bg-gradient-circle circle-2"></div>
      
      <Navbar />
      <Hero />
      <AmbiTagOverview />
      <AmbiTagBlueOverview />
      <HardwareSpecs />
      <PowerOptimization />
    </div>
  );
};

const Navbar = () => (
  <nav style={{ position: 'fixed', width: '100%', padding: '20px 0', zIndex: 100, background: 'rgba(11, 15, 25, 0.8)', backdropFilter: 'blur(10px)' }}>
    <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <h2 style={{ margin: 0, color: 'var(--accent-color)', letterSpacing: '2px' }}>AMBITAG</h2>
      <div style={{ display: 'flex', gap: '20px' }}>
        <a href="#about" style={{ color: '#fff', textDecoration: 'none' }}>About</a>
        <a href="#blue" style={{ color: '#fff', textDecoration: 'none' }}>Blue Edition</a>
        <a href="#hardware" style={{ color: '#fff', textDecoration: 'none' }}>Hardware</a>
      </div>
    </div>
  </nav>
);

const Hero = () => {
  return (
    <section className="container hero">
      <div className="hero-content">
        <h1>Advanced Environmental Logging</h1>
        <p>
          Ambitag is a standalone, battery-operated electronic device designed to monitor and record environmental and motion-related parameters. Protect your temperature-sensitive assets with precision.
        </p>
        <a href="#about" className="btn">Explore Ambitag</a>
      </div>
      <div className="hero-image">
        <img 
          src="ambitag.png" 
          alt="AmbiTag USB Device" 
          style={{ width: '100%', maxWidth: '500px', borderRadius: '20px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', animation: 'float 6s ease-in-out infinite' }} 
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
        <div style={{ display: 'none', width: '100%', height: '400px', background: 'rgba(255,255,255,0.05)', borderRadius: '20px', alignItems: 'center', justifyContent: 'center', border: '1px dashed rgba(255,255,255,0.2)' }}>
          <p>Please place your image here as <b>ambitag.png</b></p>
        </div>
      </div>
    </section>
  );
};

const AmbiTagOverview = () => (
  <section id="about" className="section container">
    <h2 className="section-title">The THERMOD Architecture</h2>
    <div className="grid-2">
      <div className="glass">
        <h3 className="card-title">Continuous Tracking</h3>
        <p>
          Designed to monitor and record environmental parameters. The device measures temperature, humidity, and movement using dedicated sensors and stores the collected data in onboard flash memory.
        </p>
      </div>
      <div className="glass">
        <h3 className="card-title">Reliable Operation</h3>
        <p>
          Retrieved by connecting the device to a computer via USB, allowing users to export data in PDF and CSV formats. Designed for low power consumption, high accuracy, and reliable long-term operation.
        </p>
      </div>
    </div>
  </section>
);

const AmbiTagBlueOverview = () => (
  <section id="blue" className="section container">
    <div className="grid-2">
      <div style={{ order: 2 }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>AmbiTag Blue</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>
          Serving as an advanced wireless evolution of the original USB-bound AmbiTag architecture, AmbiTag Blue leverages Bluetooth Low Energy (BLE 5.0) to completely eliminate physical cable dependencies.
        </p>
        <ul style={{ color: 'var(--text-muted)', paddingLeft: '20px', marginBottom: '30px' }}>
          <li>Advanced Wireless Architecture built on BLE 5.0</li>
          <li>Power Minimization via specialized firmware sleep modes</li>
          <li>Over 4 years of operation on a single CR2032 coin-cell</li>
        </ul>
      </div>
      <div className="glass" style={{ order: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', padding: 0, overflow: 'hidden' }}>
         <img 
          src="ambitag-blue.png" 
          alt="AmbiTag Blue Device" 
          style={{ width: '100%', objectFit: 'cover' }} 
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'block';
          }}
        />
        <h3 style={{ color: 'rgba(255,255,255,0.3)', display: 'none', padding: '20px' }}>AmbiTag Blue Hardware Visualization</h3>
      </div>
    </div>
  </section>
);

const HardwareSpecs = () => {
  const specs = [
    { title: "Microcontroller", desc: "STM32L412KBT6 / nRF52832 BLE SoC featuring ultra-low-power Arm Cortex-M4 CPU." },
    { title: "Temp & Humidity", desc: "SHT40 ultra-low-power & high accuracy sensor (±0.2°C, ±1.8%RH)." },
    { title: "Accelerometer", desc: "LIS3DHTR three-axis linear accelerometer for motion and vibration monitoring." },
    { title: "Flash Memory", desc: "W25Q16JVSNIQ 2MB serial flash memory for extensive data logging." }
  ];

  return (
    <section id="hardware" className="section container">
      <h2 className="section-title">Hardware Components</h2>
      <div className="grid-3">
        {specs.map((spec, index) => (
          <div key={index} className="glass">
            <h3 className="card-title">{spec.title}</h3>
            <p style={{ color: 'var(--text-muted)' }}>{spec.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const PowerOptimization = () => (
  <section className="section container">
    <div className="glass" style={{ textAlign: 'center', padding: '60px 40px' }}>
      <h2 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Unprecedented Battery Life</h2>
      <p style={{ maxWidth: '800px', margin: '0 auto 40px', color: 'var(--text-muted)' }}>
        Through rigorous firmware optimizations and component selection, AmbiTag achieves an astonishing operational lifespan.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', flexWrap: 'wrap' }}>
        <div>
          <h3 style={{ fontSize: '3rem', color: 'var(--accent-color)', margin: 0 }}>4.6</h3>
          <p style={{ textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-muted)' }}>Years Lifespan</p>
        </div>
        <div>
          <h3 style={{ fontSize: '3rem', color: 'var(--accent-color)', margin: 0 }}>240k</h3>
          <p style={{ textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-muted)' }}>Total Logs</p>
        </div>
        <div>
          <h3 style={{ fontSize: '3rem', color: 'var(--accent-color)', margin: 0 }}>1µA</h3>
          <p style={{ textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-muted)' }}>Sleep Current</p>
        </div>
      </div>
    </div>
  </section>
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
