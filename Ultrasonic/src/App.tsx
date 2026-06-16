import { useState, useEffect, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useChartZoomPan } from './hooks/useChartZoomPan';
import './index.css';
import { 
  Wind, 
  Compass, 
  Zap, 
  Activity, 
  Cpu, 
  Globe, 
  ChevronRight, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Battery, 
  FileText
} from 'lucide-react';

// Fix leaflet marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface CloudSenseDevice {
  DeviceId: string;
  Topic: string;
  TimeStamp_IST: string;
  City: string;
  State: string;
  WindSpeed: number;
  WindDirection: number;
  CurrentTemperature: number;
  CurrentHumidity: number;
  BatteryVoltage: number;
  SignalStrength: number;
  Latitude?: number;
  Longitude?: number;
  isActive?: boolean;
}

const formatDateToDDMMYYYY = (dateStr: string) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  return `${day}-${month}-${d.getFullYear()}`;
};

// Modern Dark Theme Custom Tooltip
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{ 
        backgroundColor: 'rgba(15, 23, 42, 0.95)', 
        backdropFilter: 'blur(8px)',
        padding: '12px 16px', 
        borderRadius: '14px', 
        border: '1px solid rgba(255, 255, 255, 0.08)', 
        color: '#f9fafb', 
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.6)' 
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ 
            width: '32px', height: '32px', 
            transform: `rotate(${data.WindDirection}deg)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: '8px',
            backgroundColor: 'rgba(56, 189, 248, 0.1)',
            borderRadius: '50%',
            border: '1px solid rgba(56, 189, 248, 0.2)'
          }}>
            <svg viewBox="0 0 24 24" fill="var(--primary)" width="16" height="16">
              <path d="M12 2L20 22L12 18L4 22L12 2Z" />
            </svg>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '4px', fontWeight: 500 }}>{label}</div>
          <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--primary)' }}>
            Speed: {Number(data.WindSpeed).toFixed(2)} m/s ({Number(data.WindDirection).toFixed(2)}°)
          </div>
        </div>
      </div>
    );
  }
  return null;
};

function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [devices, setDevices] = useState<CloudSenseDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<CloudSenseDevice | null>(null);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState('1 day');
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [historyData, setHistoryData] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Simulation states for the interactive widget
  const [simSpeed, setSimSpeed] = useState(12.5);
  const [simDirection, setSimDirection] = useState(45);

  const zoomPan = useChartZoomPan(historyData);
  const layoutRef = useRef<HTMLDivElement>(null);

  const bannerPoints = [
    "High-accuracy wind monitoring",
    "Real-time speed and direction analytics",
    "Ultra-low power compact design",
  ];

  const features = [
    "High Quality measurement up to 60m/s (216km/h)",
    "High accuracy with fast response time",
    "0°-360° wind direction coverage with 1° resolution",
    "Low Maintenance, ensuring low cost of ownership",
    "Robust design for all weather conditions",
  ];

  const applications = [
    "Weather monitoring stations",
    "Smart agriculture and precision farming",
    "Ports and harbours",
    "Runways and helipads",
    "Wind turbine performance monitoring",
  ];


  useEffect(() => {
    if (activeTab === 'live' || activeTab === 'deployment') {
      setLoading(true);
      fetch('https://d1b09mxwt0ho4j.cloudfront.net/default/WS_Device_Activity')
        .then(res => res.json())
        .then(data => {
          if (data && data.devices) {
            const filtered = data.devices.filter((d: any) => 
              d.Topic && d.Topic.includes('0126') && d.Topic.startsWith('WS')
            ).map((d: any) => {
              const timeStr = d.TimeStamp_IST || '';
              let isActive = false;
              if (timeStr) {
                try {
                  const formattedTimeStr = timeStr.replace(/-/g, '/');
                  const lastTime = new Date(formattedTimeStr);
                  const diffMs = new Date().getTime() - lastTime.getTime();
                  const diffHours = diffMs / (1000 * 60 * 60);
                  isActive = diffHours <= 1 && diffHours >= 0;
                } catch (e) {}
              }
              return {
                ...d,
                Latitude: parseFloat(d.Latitude || d.LastKnownLatitude || '0'),
                Longitude: parseFloat(d.Longitude || d.LastKnownLongitude || '0'),
                isActive
              };
            });
            setDevices(filtered);
            if (filtered.length > 0 && !selectedDevice) {
              setSelectedDevice(filtered[0]);
            }
          }
        })
        .catch(err => console.error("Error fetching CloudSense data:", err))
        .finally(() => setLoading(false));
    }
  }, [activeTab]);

  useEffect(() => {
    let isMounted = true;
    
    const fetchHistory = async () => {
      if (activeTab !== 'live' || !selectedDevice) return;
      
      let start = '';
      let end = '';
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      
      if (timeRange === '1 day') {
        start = formatDateToDDMMYYYY(selectedDate);
        end = formatDateToDDMMYYYY(selectedDate);
      } else if (timeRange === '7 day') {
        const d = new Date();
        d.setDate(d.getDate() - 7);
        start = formatDateToDDMMYYYY(d.toISOString().split('T')[0]);
        end = formatDateToDDMMYYYY(todayStr);
      } else if (timeRange === 'Custom') {
        start = formatDateToDDMMYYYY(startDate);
        end = formatDateToDDMMYYYY(endDate);
      }
      
      setHistoryLoading(true);
      try {
        const url = `https://gtk47vexob.execute-api.us-east-1.amazonaws.com/ssmet0126data?deviceid=${selectedDevice.DeviceId}&startdate=${start}&enddate=${end}`;
        const response = await fetch(url);
        const data = await response.json();
        
        if (isMounted) {
          if (data && data.items) {
            data.items.sort((a: any, b: any) => new Date(a.TimeStamp).getTime() - new Date(b.TimeStamp).getTime());
            
            const mapped = data.items.map((item: any) => {
              const parts = item.TimeStamp.split(' ');
              let timeLabel = item.TimeStamp;
              if (parts.length === 2) {
                const dateParts = parts[0].split('-');
                const timeParts = parts[1].split(':');
                if (dateParts.length >= 3 && timeParts.length >= 2) {
                  timeLabel = `${dateParts[1]}/${dateParts[2]} ${timeParts[0]}:${timeParts[1]}`;
                }
              }
              
              return {
                time: timeLabel,
                WindSpeed: item.WindSpeed,
                WindDirection: item.WindDirection
              };
            });
            
            const isViewingToday = (timeRange === '1 day' && selectedDate === todayStr) || 
                                   (timeRange === '7 day') || 
                                   (timeRange === 'Custom' && endDate >= todayStr);
            
            if (isViewingToday && selectedDevice.TimeStamp_IST) {
              let liveTime = "";
              const parts = selectedDevice.TimeStamp_IST.split(' ');
              if (parts.length === 2) {
                const dateParts = parts[0].split('-');
                const timeParts = parts[1].split(':');
                if (dateParts.length >= 3 && timeParts.length >= 2) {
                  liveTime = `${dateParts[1]}/${dateParts[2]} ${timeParts[0]}:${timeParts[1]}`;
                }
              }
              mapped.push({
                time: liveTime || "Now",
                WindSpeed: selectedDevice.WindSpeed,
                WindDirection: selectedDevice.WindDirection
              });
            }
            
            setHistoryData(mapped);
          } else {
            setHistoryData([]);
          }
          setHistoryLoading(false);
        }
      } catch (err) {
        console.error("Failed to fetch historical data:", err);
        if (isMounted) {
          setHistoryData([]);
          setHistoryLoading(false);
        }
      }
    };
    
    fetchHistory();
    return () => { isMounted = false; };
  }, [activeTab, selectedDevice, timeRange, selectedDate, startDate, endDate]);

  // Handle ambient background grid spotlight coordinates without triggering React render
  const handleGlobalMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (layoutRef.current) {
      const rect = layoutRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      layoutRef.current.style.setProperty('--mouse-x', `${x}px`);
      layoutRef.current.style.setProperty('--mouse-y', `${y}px`);
    }
  };

  // Simulated ultrasonic sensor calculation components
  const vX = simSpeed * Math.sin((simDirection * Math.PI) / 180);
  const vY = simSpeed * Math.cos((simDirection * Math.PI) / 180);
  const tofNS = (100 - vY * 0.18).toFixed(3);
  const tofSN = (100 + vY * 0.18).toFixed(3);
  const tofWE = (100 - vX * 0.18).toFixed(3);
  const tofEW = (100 + vX * 0.18).toFixed(3);

  return (
    <div 
      className="dashboard-layout" 
      ref={layoutRef}
      onMouseMove={handleGlobalMouseMove}
    >
      {/* Background Ambient Glow Spots */}
      <div className="glow-spot-1" />
      <div className="glow-spot-2" />

      {/* Sticky Premium Top Navigation Header */}
      <header className="navbar">
        <div className="navbar-brand" onClick={() => setActiveTab('overview')}>
          <div className="navbar-logo">
            <Wind size={20} strokeWidth={2.5} />
          </div>
        </div>
        
        <nav className="navbar-links">
          <a 
            className={`navbar-item ${activeTab === 'overview' ? 'active' : ''}`} 
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </a>
          <a 
            className={`navbar-item ${activeTab === 'live' ? 'active' : ''}`} 
            onClick={() => setActiveTab('live')}
          >
            Telemetry
          </a>
          <a 
            className={`navbar-item ${activeTab === 'deployment' ? 'active' : ''}`} 
            onClick={() => setActiveTab('deployment')}
          >
            Deployment
          </a>
          <a 
            className={`navbar-item ${activeTab === 'specs' ? 'active' : ''}`} 
            onClick={() => setActiveTab('specs')}
          >
            Hardware
          </a>
        </nav>

        <div className="navbar-actions">
          <a 
            href="/assets/pdfs/ULTRASONIC_DATASHEET.pdf" 
            target="_blank" 
            className="btn btn-outline" 
            rel="noreferrer"
          >
            <FileText size={16} />
            Datasheet
          </a>
        </div>

        <button 
          className="hamburger" 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
          aria-label="Toggle Menu"
        >
          {isMobileMenuOpen ? (
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </header>

      {/* Mobile Menu Overlay Drawer */}
      <div 
        className={`mobile-menu-overlay ${isMobileMenuOpen ? 'open' : ''}`} 
        onClick={() => setIsMobileMenuOpen(false)} 
      />

      {/* Mobile Menu Drawer Container */}
      <div className={`mobile-menu-drawer ${isMobileMenuOpen ? 'open' : ''}`}>
        <a 
          className={`mobile-menu-link ${activeTab === 'overview' ? 'active' : ''}`} 
          onClick={() => { setActiveTab('overview'); setIsMobileMenuOpen(false); }}
        >
          Overview
        </a>
        <a 
          className={`mobile-menu-link ${activeTab === 'live' ? 'active' : ''}`} 
          onClick={() => { setActiveTab('live'); setIsMobileMenuOpen(false); }}
        >
          Telemetry
        </a>
        <a 
          className={`mobile-menu-link ${activeTab === 'deployment' ? 'active' : ''}`} 
          onClick={() => { setActiveTab('deployment'); setIsMobileMenuOpen(false); }}
        >
          Deployment
        </a>
        <a 
          className={`mobile-menu-link ${activeTab === 'specs' ? 'active' : ''}`} 
          onClick={() => { setActiveTab('specs'); setIsMobileMenuOpen(false); }}
        >
          Hardware
        </a>
        <a 
          href="/assets/pdfs/ULTRASONIC_DATASHEET.pdf" 
          target="_blank" 
          className="btn btn-outline" 
          style={{ marginTop: '1rem' }} 
          rel="noreferrer"
        >
          <FileText size={16} />
          Datasheet
        </a>
      </div>

      {/* Main Content Area */}
      <main className="main-content">
        
        {activeTab === 'overview' && (
          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '3rem', maxWidth: '1400px', margin: '0 auto' }}>
            {/* Top SaaS Hero Section */}
            <section className="hero-section">
              <div className="hero-content">
                <div className="hero-badge">
                  <div className="hero-badge-dot" />
                  <span className="hero-badge-text">✦ FUTURE-PROOF WIND SENSING</span>
                </div>
                <h1>Ultrasonic Anemometer</h1>
                <p className="hero-subtitle">
                  Precision solid-state wind analytics designed for harsh, remote environments. Experience calibration-free accuracy with no moving parts.
                </p>
                <div className="hero-cta-group">
                  <button onClick={() => setActiveTab('live')} className="btn btn-primary">
                    <Activity size={18} />
                    Live Dashboard
                  </button>
                  <button onClick={() => setActiveTab('specs')} className="btn btn-outline">
                    <Cpu size={18} />
                    Hardware Specs
                  </button>
                </div>

                <div className="hero-stats-row">
                  <div className="hero-stat-item">
                    <span className="hero-stat-value">60 m/s</span>
                    <span className="hero-stat-label">Max Speed</span>
                  </div>
                  <div className="hero-stat-item">
                    <span className="hero-stat-value">1°</span>
                    <span className="hero-stat-label">Resolution</span>
                  </div>
                  <div className="hero-stat-item">
                    <span className="hero-stat-value">Δ ToF</span>
                    <span className="hero-stat-label">Measurement</span>
                  </div>
                </div>
              </div>
              <div className="hero-image-container">
                <div className="hero-image-frame">
                  <div className="sensor-3d-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img 
                      src="/assets/images/ultrasonic.png" 
                      alt="Ultrasonic Transducer" 
                      className="sensor-static-image"
                      style={{ 
                        width: '100%', 
                        height: '100%', 
                        objectFit: 'contain',
                        padding: '1.5rem',
                        filter: 'drop-shadow(0 15px 30px rgba(0, 0, 0, 0.75))'
                      }} 
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* Bento Grid Balanced Layout */}
            <div className="bento-grid">
              
              {/* Card 1: Live Interactive Delta ToF Simulator (Double Width) */}
              <div className="floating-card bento-span-2">
                <div className="card-title-row">
                  <div className="card-header-icon" style={{ color: 'var(--accent)', background: 'rgba(45, 212, 191, 0.05)' }}>
                    <Compass size={22} />
                  </div>
                  <h3>Δ ToF Ultrasonic Interactive Sandbox</h3>
                </div>
                
                <div className="sandbox-layout">
                  <div className="sandbox-controls">
                    <p className="sandbox-description">
                      Slide coordinates to simulate wind dynamics. Ultrasonic anemometers calculate speed and direction by comparing the delta time-of-flight (Δ ToF) of sound pulses between transducers.
                    </p>
                    <div className="sandbox-sliders">
                      <div className="slider-group">
                        <div className="slider-label-row">
                          <span>Simulated Wind Speed</span>
                          <span className="slider-value">{simSpeed.toFixed(1)} m/s</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="60" 
                          step="0.5" 
                          value={simSpeed}
                          onChange={(e) => setSimSpeed(parseFloat(e.target.value))}
                          className="slider-input"
                          style={{ '--primary': 'var(--primary)' } as React.CSSProperties}
                        />
                      </div>
                      <div className="slider-group">
                        <div className="slider-label-row">
                          <span>Simulated Wind Direction</span>
                          <span className="slider-value">{simDirection}°</span>
                        </div>
                        <input 
                          type="range" 
                          min="0" 
                          max="359" 
                          value={simDirection}
                          onChange={(e) => setSimDirection(parseInt(e.target.value))}
                          className="slider-input"
                          style={{ '--primary': 'var(--accent)' } as React.CSSProperties}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="visualizer-container">
                    <div className="compass-dial">
                      <span className="compass-marker marker-n">N</span>
                      <span className="compass-marker marker-e">E</span>
                      <span className="compass-marker marker-s">S</span>
                      <span className="compass-marker marker-w">W</span>
                      <div className="compass-ring" />
                      <div className="compass-axis-y" />
                      <div className="compass-axis-x" />
                      <div className="compass-center-dot" />
                      
                      {/* Rotating pointer representing simulated direction */}
                      <div 
                        className="compass-arrow" 
                        style={{ transform: `rotate(${simDirection}deg)` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Displaying physics calculation parameters inline */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>N ➔ S Pulse Time</span>
                    <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>{tofNS} μs</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>S ➔ N Pulse Time</span>
                    <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>{tofSN} μs</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>W ➔ E Pulse Time</span>
                    <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>{tofWE} μs</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 800, textTransform: 'uppercase' }}>E ➔ W Pulse Time</span>
                    <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>{tofEW} μs</span>
                  </div>
                </div>
              </div>

              {/* Card 2: Key Highlights */}
              <div className="floating-card interactive">
                <div className="card-title-row">
                  <div className="card-header-icon" style={{ color: 'var(--primary)', background: 'rgba(56, 189, 248, 0.05)' }}>
                    <Sparkles size={22} />
                  </div>
                  <h3>Key Highlights</h3>
                </div>
                <div className="highlights-list">
                  {bannerPoints.map((point, idx) => (
                    <div key={idx} className="highlight-item">
                      <div className="highlight-icon">✦</div>
                      <div className="highlight-text">{point}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 3: Hardware Features */}
              <div className="floating-card interactive">
                <div className="card-title-row">
                  <div className="card-header-icon" style={{ color: 'var(--accent)', background: 'rgba(45, 212, 191, 0.05)' }}>
                    <ShieldCheck size={22} />
                  </div>
                  <h3>Hardware Features</h3>
                </div>
                <div className="highlights-list">
                  {features.map((feature, idx) => (
                    <div key={idx} className="feature-item">
                      <CheckCircle2 size={16} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 4: Supported Applications */}
              <div className="floating-card interactive">
                <div className="card-title-row">
                  <div className="card-header-icon" style={{ color: 'var(--violet)', background: 'rgba(167, 139, 250, 0.05)' }}>
                    <Globe size={22} />
                  </div>
                  <h3>Supported Applications</h3>
                </div>
                <div className="highlights-list">
                  {applications.map((app, idx) => (
                    <div key={idx} className="app-item">
                      <ChevronRight size={16} />
                      <span>{app}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Card 5: Core Hardware Specs Preview */}
              <div className="floating-card interactive">
                <div className="card-title-row">
                  <div className="card-header-icon" style={{ color: 'var(--amber)', background: 'rgba(251, 191, 36, 0.05)' }}>
                    <Zap size={22} />
                  </div>
                  <h3>Electrical & Comms</h3>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.8rem' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Supply Voltage</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>2V - 16V DC</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '0.8rem' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Protocol</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>Modbus RTU</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.2rem' }}>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Interface</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>RS232 / RS485</span>
                  </div>
                </div>
              </div>

            </div>


          </div>
        )}

        {activeTab === 'live' && (
          <div className="animate-fade-in" style={{ height: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h2>Live Network Telemetry</h2>
            </div>
            
            <div className="telemetry-layout">
              {/* Device List Sidebar */}
              <div className="sidebar-panel">
                <div className="sidebar-header">
                  Active Stations ({devices.length})
                </div>
                <div className="sidebar-list">
                  {loading ? (
                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Discovering devices...</div>
                  ) : (
                    devices.map(device => (
                      <div 
                        key={device.DeviceId}
                        onClick={() => setSelectedDevice(device)}
                        className={`device-card ${selectedDevice?.DeviceId === device.DeviceId ? 'active' : ''}`}
                      >
                        <div className="device-card-content">
                          <span className="device-id">{device.DeviceId}</span>
                          <span className="device-location">{device.City || 'Field Station'} • {device.State}</span>
                        </div>
                        {selectedDevice?.DeviceId === device.DeviceId && (
                          <div className="active-dot-pulsing" />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Device Details & Graph Panel */}
              <div className="detail-panel">
                {selectedDevice ? (
                  <>
                    {/* Top Metric Cards Row */}
                    <div className="metrics-row">
                      {/* Card 1: Wind Speed */}
                      <div className="metric-card">
                        <div className="metric-icon-box">
                          <Wind size={24} />
                        </div>
                        <div className="metric-info">
                          <span className="metric-label">Wind Speed</span>
                          <span className="metric-value">
                            {Number(selectedDevice.WindSpeed).toFixed(2)} <span className="metric-unit">m/s</span>
                          </span>
                        </div>
                      </div>

                      {/* Card 2: Wind Direction */}
                      <div className="metric-card">
                        <div className="metric-icon-box">
                          <Compass size={24} />
                        </div>
                        <div className="metric-info">
                          <span className="metric-label">Direction</span>
                          <span className="metric-value">
                            {Number(selectedDevice.WindDirection).toFixed(2)}°
                          </span>
                        </div>
                      </div>

                      {/* Card 3: Battery Status */}
                      <div className="metric-card">
                        <div className="metric-icon-box">
                          <Battery size={24} />
                        </div>
                        <div className="metric-info">
                          <span className="metric-label">Battery Voltage</span>
                          <span className="metric-value">
                            {Number(selectedDevice.BatteryVoltage).toFixed(2)} <span className="metric-unit">V</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Wind Velocity Trends Graph */}
                    <div className="chart-card">
                      <div className="chart-header">
                        <span className="chart-title">Wind Velocity Trends</span>
                        
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
                          <div className="chart-filter-dock">
                            {['1 day', '7 day', 'Custom'].map(range => (
                              <button
                                key={range}
                                onClick={() => setTimeRange(range)}
                                className={`chart-filter-btn ${timeRange === range ? 'active' : ''}`}
                              >
                                {range}
                              </button>
                            ))}
                          </div>
                          
                          {timeRange === '1 day' && (
                            <div className="chart-filter-dock" style={{ padding: '2px 8px' }}>
                              <input 
                                type="date" 
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="chart-date-input"
                              />
                            </div>
                          )}
                          {timeRange === 'Custom' && (
                            <div className="chart-filter-dock" style={{ padding: '2px 10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <input 
                                type="date" 
                                value={startDate} 
                                onChange={(e) => setStartDate(e.target.value)}
                                className="chart-date-input"
                              />
                              <span className="chart-date-separator">to</span>
                              <input 
                                type="date" 
                                value={endDate} 
                                onChange={(e) => setEndDate(e.target.value)}
                                className="chart-date-input"
                              />
                            </div>
                          )}
                          
                          {zoomPan.isZoomed && (
                            <button 
                              onClick={zoomPan.handleResetZoom} 
                              className="btn btn-outline" 
                              style={{ 
                                padding: '0.4rem 1rem', 
                                borderColor: 'var(--danger)', 
                                color: 'var(--danger)',
                                borderRadius: '99px',
                                fontSize: '0.75rem'
                              }}
                            >
                              Reset Zoom
                            </button>
                          )}
                        </div>
                      </div>
                      
                      <div 
                        style={{ flex: 1, padding: '2rem 2rem 1rem 0.5rem', position: 'relative', userSelect: 'none' }} 
                        onWheelCapture={zoomPan.handleWheel}
                        onMouseDownCapture={zoomPan.handleMouseDown}
                        onMouseMoveCapture={zoomPan.handleMouseMove}
                        onMouseUpCapture={zoomPan.handleMouseUp}
                        onMouseLeave={zoomPan.handleMouseUp}
                        onContextMenu={zoomPan.handleContextMenu}
                      >
                        {historyLoading && (
                          <div style={{ position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(2, 4, 10, 0.75)', zIndex: 10 }}>
                            <div style={{ width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.05)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                          </div>
                        )}
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={zoomPan.displayedData}>
                            <defs>
                              <linearGradient id="colorSpeed" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.25}/>
                                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                            <XAxis 
                              dataKey="time" 
                              stroke="#475569" 
                              fontSize={11} 
                              tickLine={false} 
                              axisLine={false} 
                              angle={-45} 
                              textAnchor="end"
                              height={60}
                              interval="preserveStartEnd"
                              minTickGap={35}
                            />
                            <YAxis stroke="#475569" fontSize={11} tickLine={false} axisLine={false} tickMargin={8} />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.12)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                            <Area 
                              type="monotone" 
                              dataKey="WindSpeed" 
                              stroke="var(--primary)" 
                              strokeWidth={3} 
                              fillOpacity={1}
                              fill="url(#colorSpeed)"
                              activeDot={{ r: 6, fill: 'var(--primary)', stroke: '#fff', strokeWidth: 2 }} 
                              animationDuration={500} 
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="floating-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                    Select a field station from the list to view live wind telemetry.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'deployment' && (
          <div className="animate-fade-in specs-container" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div className="specs-title-box">
              <h2>Deployment Map</h2>
            </div>
            
            <div className="floating-card" style={{ padding: '0', overflow: 'hidden', height: '600px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <MapContainer center={[31.1, 75.6]} zoom={7} attributionControl={false} style={{ height: '100%', width: '100%', backgroundColor: '#0f172a' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {devices.map(d => {
                  const lat = d.Latitude || 0;
                  const lng = d.Longitude || 0;
                  if (isNaN(lat) || isNaN(lng) || (lat === 0 && lng === 0)) return null;
                  return (
                    <Marker key={d.DeviceId} position={[lat, lng]}>
                      <Popup>
                        <div style={{ padding: '4px', minWidth: '150px' }}>
                          <strong style={{ fontSize: '14px', color: '#0f172a' }}>ID: {d.DeviceId}</strong><br />
                          <span style={{ color: '#475569' }}>{d.City}, {d.State}</span><br />
                          <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ 
                              color: d.isActive ? '#10b981' : '#f43f5e', 
                              fontWeight: '600',
                              fontSize: '12px'
                            }}>
                              {d.isActive ? 'Active' : 'Inactive'}
                            </span>
                            <span style={{ fontSize: '12px', color: '#64748b' }}>
                              {Number(d.WindSpeed).toFixed(1)} m/s
                            </span>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            </div>
          </div>
        )}

        {activeTab === 'specs' && (
          <div className="animate-fade-in specs-container">
            <div className="specs-title-box">
              <h2>Technical Specifications</h2>
              <p style={{ marginTop: '0.5rem' }}>Full engineering breakdown of the CloudSense solid-state wind sensor.</p>
            </div>
            
            <div className="specs-panel-layout">
              {/* Category 1: Electrical & Protocols */}
              <div className="floating-card spec-category-card">
                <div className="card-title-row">
                  <div className="card-header-icon" style={{ color: 'var(--primary)', background: 'rgba(56, 189, 248, 0.05)' }}>
                    <Cpu size={20} />
                  </div>
                  <h3>Power & Communications</h3>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="spec-item-row">
                    <span className="spec-item-label">Supply Voltage</span>
                    <span className="spec-item-value">2V - 16V DC</span>
                  </div>
                  <div className="spec-item-row">
                    <span className="spec-item-label">Power Efficiency</span>
                    <span className="spec-item-value">Ultra-low power sleep cycle</span>
                  </div>
                  <div className="spec-item-row">
                    <span className="spec-item-label">Communication Interfaces</span>
                    <span className="spec-item-value">RS232 or RS485</span>
                  </div>
                  <div className="spec-item-row">
                    <span className="spec-item-label">Data Protocol</span>
                    <span className="spec-item-value">Modbus RTU / ASCII</span>
                  </div>
                </div>
              </div>

              {/* Category 2: Physics & Mechanical */}
              <div className="floating-card spec-category-card">
                <div className="card-title-row">
                  <div className="card-header-icon" style={{ color: 'var(--accent)', background: 'rgba(45, 212, 191, 0.05)' }}>
                    <Compass size={20} />
                  </div>
                  <h3>Sensor Physics & Mechanical</h3>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <div className="spec-item-row">
                    <span className="spec-item-label">Measurement Science</span>
                    <span className="spec-item-value">Δ Time-of-Flight (Ultrasonic)</span>
                  </div>
                  <div className="spec-item-row">
                    <span className="spec-item-label">Sensor Range</span>
                    <span className="spec-item-value">0 to 60 m/s (216 km/h)</span>
                  </div>
                  <div className="spec-item-row">
                    <span className="spec-item-label">Unit Weight</span>
                    <span className="spec-item-value">0.6 kg (Compact & Lightweight)</span>
                  </div>
                  <div className="spec-item-row">
                    <span className="spec-item-label">Temperature Range</span>
                    <span className="spec-item-value">Heating option (-40℃ to +70℃)</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="floating-card" style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.75rem 2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <FileText size={28} style={{ color: 'var(--primary)' }} />
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>Need more detailed information?</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Download the full engineering blueprint datasheet in PDF format.</p>
                </div>
              </div>
              <a 
                href="/assets/pdfs/ULTRASONIC_DATASHEET.pdf" 
                target="_blank" 
                className="btn btn-outline" 
                rel="noreferrer"
              >
                Download PDF Blueprint
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
