import { useState } from 'react';
import './index.css';
import modviewImg from './assets/Modview.png';
import img1 from './assets/images/1.jpeg';
import img2 from './assets/images/2.jpeg';
import img3 from './assets/images/3.jpeg';
import img4 from './assets/images/4.jpeg';
import img5 from './assets/images/5.jpeg';
import img6 from './assets/images/6.jpeg';
import img7 from './assets/images/7.jpeg';
import MapViewer from './MapViewer';

const deploymentImages = [
  { src: img1, alt: "Deployment Image 1", title: "Deployment 1" },
  { src: img2, alt: "Deployment Image 2", title: "Deployment 2" },
  { src: img3, alt: "Deployment Image 3", title: "Deployment 3" },
  { src: img4, alt: "Deployment Image 4", title: "Deployment 4" },
  { src: img5, alt: "Deployment Image 5", title: "Deployment 5" },
  { src: img6, alt: "Deployment Image 6", title: "Deployment 6" },
  { src: img7, alt: "Deployment Image 7", title: "Deployment 7" }
];

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const bannerPoints = [
    "Supports RS485 communication and validated with Soil 7-in-1 Modbus RS485 sensor",
    "Real-time sensor data acquisition with local 2.42-inch OLED display",
    "Portable operation using a rechargeable 18650 Li-ion battery with power switch",
  ];

  const features = [
    "RS485 communication support",
    "Real-time sensor data acquisition",
    "Local OLED display",
    "Nordic nRF52833 microcontroller",
    "Battery-powered operation",
    "External charging support",
    "Low-power embedded design",
    "Compact PCB architecture",
    "Industrial sensor compatibility"
  ];

  const applications = [
    "Soil sensor monitoring",
    "Agricultural research",
    "Laboratory testing",
    "Environmental monitoring",
    "Sensor evaluation",
    "Educational demonstrations",
    "Embedded systems prototyping"
  ];

  const specifications = [
    { label: "Microcontroller", value: "Nordic nRF52833" },
    { label: "Transceiver", value: "MAX13487 RS485" },
    { label: "Display", value: "2.42-inch OLED" },
    { label: "Battery", value: "18650 Li-ion" },
    { label: "Power & Charging", value: "Charging and power regulation circuit" },
    { label: "Controls", value: "User power switch, Reset button" },
    { label: "Indicators", value: "Status LED" },
  ];

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2 style={{ margin: 0, color: 'var(--primary)' }}>ModView</h2>
          <p style={{ fontSize: '0.875rem', marginBottom: 0 }}>Dashboard</p>
        </div>
        
        <div className="sidebar-nav">
          <div 
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => { setActiveTab('overview'); setSidebarOpen(false); }}
          >
            📊 Overview
          </div>
          <div 
            className={`nav-item ${activeTab === 'deployment' ? 'active' : ''}`}
            onClick={() => { setActiveTab('deployment'); setSidebarOpen(false); }}
          >
            📸 Deployments
          </div>
          <div 
            className={`nav-item ${activeTab === 'specs' ? 'active' : ''}`}
            onClick={() => { setActiveTab('specs'); setSidebarOpen(false); }}
          >
            ⚙️ Hardware Blocks
          </div>
          
          <div style={{ margin: '2rem 0 1rem 0', padding: '0 1rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Resources
          </div>
          
          <a href="/assets/pdfs/modview.pdf" target="_blank" className="nav-item">
            📄 Datasheet PDF
          </a>
          <a href="mailto:Vikash.hardwareengineer@ihub-awadh.in" className="nav-item">
            ✉️ Contact Support
          </a>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Top Header */}
        <header className="top-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button className="mobile-menu-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
              ☰
            </button>
          </div>
        </header>

        {/* Scrollable Dashboard Content */}
        <div className="dashboard-scroll">
          
          {activeTab === 'overview' && (
            <div className="bento-grid animate-fade-in">
              
              {/* Hero Banner (bento-large: 2 cols x 2 rows) */}
              <div className="widget bento-large" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', backgroundImage: 'linear-gradient(to right, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.5))' }}>
                <h2 style={{ margin: 0, textAlign: 'center' }}>ModView nRF52833<br/>BLE + RS485 Data Logger</h2>
                <img 
                  src={modviewImg}
                  alt="ModView Board" 
                  style={{ maxHeight: '280px', width: 'auto', borderRadius: '0.5rem', boxShadow: '0 10px 30px rgba(0,0,0,0.5)', objectFit: 'contain' }} 
                />
              </div>

              {/* About ModView (bento-wide: 2 cols x 1 row) */}
              <div className="widget bento-wide" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--primary)' }}>About ModView</h3>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)' }}>
                  ModView is a custom-designed embedded device developed for monitoring sensor data through industrial communication interfaces. The platform supports RS485 communication and is currently validated with a Soil 7-in-1 Modbus RS485 sensor. The system receives data from the sensor, processes it through the microcontroller, and displays the values on a local OLED display.
                </p>
                <p style={{ lineHeight: '1.6', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                  Designed for portable operation using a rechargeable 18650 Li-ion battery and includes a user-controlled power switch.
                </p>
              </div>

              {/* Support (bento-wide: 2 cols x 1 row) */}
              <div className="widget bento-wide" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.05))', border: '1px solid rgba(59, 130, 246, 0.3)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '-50px', right: '-50px', width: '100px', height: '100px', background: 'var(--primary)', filter: 'blur(50px)', opacity: 0.3 }}></div>
                <h3 style={{ marginBottom: '0.5rem', color: 'var(--primary)' }}>Need Assistance?</h3>
                <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem', flex: 1 }}>Contact our hardware engineering team for support or custom integrations.</p>
                <a href="mailto:Vikash.hardwareengineer@ihub-awadh.in" className="btn btn-primary" style={{ width: 'max-content' }}>Enquire Now</a>
              </div>

              {/* Key Highlights (bento-tall: 1 col x 2 rows) */}
              <div className="widget bento-tall" style={{ display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>✨</span> Highlights
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {bannerPoints.map((point, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                      <div style={{ color: 'var(--accent)', marginTop: '0.1rem', fontSize: '1.25rem' }}>✓</div>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', fontWeight: 500 }}>{point}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hardware Features (bento-large: 2 cols x 2 rows) */}
              <div className="widget bento-large" style={{ display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>⚡</span> Hardware Features
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  {features.map((feature, idx) => (
                    <div key={idx} className="feature-card">
                      <div className="feature-icon">
                        {['⚙️','📊','📟','💻','🔋','🔌','🌿','📐','🏭'][idx % 9]}
                      </div>
                      <div style={{ color: 'var(--text-primary)', fontSize: '0.9rem', fontWeight: 500 }}>
                        {feature}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Applications (bento-tall: 1 col x 2 rows) */}
              <div className="widget bento-tall" style={{ display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ marginBottom: '1.5rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.5rem' }}>🎯</span> Applications
                </h3>
                <div className="app-tags" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {applications.map((app, idx) => (
                    <div key={idx} className="app-tag" style={{ width: '100%' }}>
                      {app}
                    </div>
                  ))}
                </div>
              </div>



            </div>
          )}

          {activeTab === 'specs' && (
            <div className="animate-fade-in">
              <h2 style={{ marginBottom: '2rem' }}>Hardware Blocks</h2>
              
              <div className="widget" style={{ padding: 0, overflow: 'hidden' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Parameter</th>
                      <th>Specification Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {specifications.map((spec, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 500, color: 'var(--text-primary)', width: '25%' }}>{spec.label}</td>
                        <td style={{ color: 'var(--text-secondary)' }}>{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'deployment' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <h2 style={{ marginBottom: '0rem' }}>Deployments</h2>
              <div>
                <MapViewer />
              </div>
              
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
                  {deploymentImages.map((img, idx) => (
                    <div key={idx} className="widget" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <img 
                        src={img.src} 
                        alt={img.alt} 
                        className="deployment-img" 
                        style={{ width: '100%', height: 'auto', maxHeight: '350px', objectFit: 'contain', borderRadius: '0.5rem' }} 
                        onClick={() => setLightboxImg(img.src)}
                      />
                      <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', textAlign: 'center' }}>
                        {img.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}



        </div>
      </main>

      {/* Lightbox Modal */}
      {lightboxImg && (
        <div className="lightbox-overlay" onClick={() => setLightboxImg(null)}>
          <button className="lightbox-close" onClick={(e) => { e.stopPropagation(); setLightboxImg(null); }}>✕</button>
          <img src={lightboxImg} alt="Enlarged view" className="lightbox-content animate-fade-in" onClick={(e) => e.stopPropagation()} />
        </div>
      )}
    </div>
  );
}

export default App;
