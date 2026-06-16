import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useChartZoomPan } from './hooks/useChartZoomPan';
import './index.css';

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

// Custom Tooltip for Temperature and Humidity
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div style={{ backgroundColor: '#111827', padding: '10px 14px', borderRadius: '6px', border: '1px solid #374151', color: '#fff', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '6px' }}>{label}</div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#f87171', marginBottom: '2px' }}>
            Temperature: {data.CurrentTemperature}°C
          </div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#60a5fa' }}>
            Humidity: {data.CurrentHumidity}%
          </div>
        </div>
      </div>
    );
  }
  return null;
};

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  
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
  const zoomPanTemp = useChartZoomPan(historyData);
  const zoomPanHum = useChartZoomPan(historyData);

  const isAnyZoomed = zoomPanTemp.isZoomed || zoomPanHum.isZoomed;
  const handleResetZoom = () => {
    zoomPanTemp.handleResetZoom();
    zoomPanHum.handleResetZoom();
  };

  const bannerPoints = [
    "High accuracy temperature sensing",
    "Real-time humidity tracking",
    "Robust industrial casing",
  ];

  const features = [
    "Wide operating range (-40°C to +80°C)",
    "0 to 100% RH measurement range",
    "High accuracy with fast response time",
    "Low Maintenance, ensuring low cost of ownership",
    "Robust design for all weather conditions",
  ];

  const applications = [
    "Weather monitoring stations",
    "Smart agriculture and precision farming",
    "Greenhouses and indoor farming",
    "Cold chain and warehouse monitoring",
    "HVAC and building automation",
  ];

  const specifications = [
    { label: "Input Supply Voltage", value: "2V - 16V" },
    { label: "Measurement Range", value: "-40°C to +80°C, 0 to 100% RH" },
    { label: "Communication", value: "RS232 or RS485 (Modbus)" },
    { label: "Power", value: "Ultra low power sleep mode" },
    { label: "Weight", value: "0.4kg" },
    { label: "Enclosure", value: "IP67 Rated" }
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
                CurrentTemperature: item.CurrentTemperature,
                CurrentHumidity: item.CurrentHumidity
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
                CurrentTemperature: selectedDevice.CurrentTemperature,
                CurrentHumidity: selectedDevice.CurrentHumidity
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

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2 style={{ margin: 0, color: 'var(--primary)' }}>ATRH</h2>
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
            className={`nav-item ${activeTab === 'live' ? 'active' : ''}`}
            onClick={() => { setActiveTab('live'); setSidebarOpen(false); }}
          >
            📡 Live Network
          </div>
          <div 
            className={`nav-item ${activeTab === 'deployment' ? 'active' : ''}`}
            onClick={() => { setActiveTab('deployment'); setSidebarOpen(false); }}
          >
            🗺️ Deployment
          </div>
          <div 
            className={`nav-item ${activeTab === 'specs' ? 'active' : ''}`}
            onClick={() => { setActiveTab('specs'); setSidebarOpen(false); }}
          >
            ⚙️ Hardware Specs
          </div>
          
          <div style={{ margin: '2rem 0 1rem 0', padding: '0 1rem', fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Resources
          </div>
          
          <a href="/assets/pdfs/PROBE_DATASHEET.pdf" target="_blank" className="nav-item">
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
        <div className="dashboard-scroll" style={activeTab === 'live' ? { display: 'flex', flexDirection: 'column', overflow: 'hidden' } : {}}>
          
          {activeTab === 'overview' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Top Banner Image Widget */}
              <div className="widget" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem', backgroundImage: 'linear-gradient(to right, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.5))' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                  <h2 style={{ margin: 0 }}>ATRH Temperature & Humidity Probe</h2>
                </div>
                <img 
                  src="/assets/images/thprobe.png" 
                  alt="ATRH Temperature and Humidity Probe" 
                  style={{ maxHeight: '350px', width: 'auto', borderRadius: '0.5rem', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }} 
                />
              </div>

              {/* Three Column Dense Layout */}
              <div className="grid grid-cols-3-layout" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {/* Column 1: Highlights & Support */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div className="widget" style={{ flex: 1 }}>
                    <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                      Key Highlights
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      {bannerPoints.map((point, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                          <div style={{ color: 'var(--accent)', marginTop: '0.1rem', fontSize: '1.25rem' }}>✓</div>
                          <div style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>{point}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="widget" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.05))', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                    <h3 style={{ marginBottom: '0.5rem', color: 'var(--primary)' }}>Need Assistance?</h3>
                    <p style={{ fontSize: '0.875rem', marginBottom: '1.5rem' }}>Contact our hardware engineering team for support or custom integrations.</p>
                    <a href="mailto:Vikash.hardwareengineer@ihub-awadh.in" className="btn btn-primary" style={{ width: '100%' }}>Enquire</a>
                  </div>
                </div>

                {/* Column 2: Full Features */}
                <div className="widget">
                  <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                    Hardware Features
                  </h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {features.map((feature, idx) => (
                      <li key={idx} style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Column 3: Applications */}
                <div className="widget">
                  <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                    Supported Applications
                  </h3>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {applications.map((app, idx) => (
                      <li key={idx} style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        {app}
                      </li>
                    ))}
                  </ul>
                </div>

              </div>
            </div>
          )}

          {activeTab === 'live' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexShrink: 0 }}>
                <h2>Live Network</h2>
              </div>
              
              <div className="live-network-grid">
                {/* Device List */}
                <div className="widget" style={{ display: 'flex', flexDirection: 'column', padding: '1rem 0', minHeight: 0 }}>
                  <div style={{ padding: '0 1.5rem 1rem 1.5rem', borderBottom: '1px solid var(--border-color)', fontWeight: 600, flexShrink: 0 }}>
                    Devices ({devices.length})
                  </div>
                  <div style={{ overflowY: 'auto', flex: 1 }}>
                    {loading ? (
                      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading devices...</div>
                    ) : (
                      devices.map(device => (
                        <div 
                          key={device.DeviceId}
                          onClick={() => setSelectedDevice(device)}
                          style={{ 
                            padding: '1rem 1.5rem', 
                            borderBottom: '1px solid var(--glass-border)',
                            cursor: 'pointer',
                            backgroundColor: selectedDevice?.DeviceId === device.DeviceId ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                            borderLeft: selectedDevice?.DeviceId === device.DeviceId ? '4px solid var(--primary)' : '4px solid transparent',
                            transition: 'all 0.2s'
                          }}
                        >
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>ID: {device.DeviceId}</div>
                          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{device.City || 'Unknown Location'}</div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Device Details & Graph */}
                <div className="widget" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', overflowY: 'auto', minHeight: 0 }}>
                  {selectedDevice ? (
                    <>
                      <div>
                        <h3 style={{ margin: 0, color: 'var(--text-primary)' }}>Device {selectedDevice.DeviceId} Details</h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.25rem' }}>
                          Last Synced: {selectedDevice.TimeStamp_IST}
                        </p>
                      </div>

                      {/* Top Metric Cards */}
                      <div className="metric-cards-grid">
                        <div style={{ padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Temperature</div>
                          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f87171' }}>{Number(selectedDevice.CurrentTemperature).toFixed(2)} <span style={{ fontSize: '1rem', fontWeight: 400 }}>°C</span></div>
                        </div>
                        <div style={{ padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Humidity</div>
                          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#60a5fa' }}>{Number(selectedDevice.CurrentHumidity).toFixed(2)} <span style={{ fontSize: '1rem', fontWeight: 400 }}>%</span></div>
                        </div>
                        <div style={{ padding: '1rem', backgroundColor: 'var(--bg-color)', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }}>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Battery</div>
                          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{Number(selectedDevice.BatteryVoltage).toFixed(2)}V</div>
                        </div>
                      </div>

                      {/* Graphs Layout */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1, minHeight: 0 }}>
                        {/* Temperature Graph */}
                        <div style={{ flex: 1, minHeight: '250px', backgroundColor: '#151e2d', borderRadius: '0.5rem', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
                          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                            <h4 style={{ margin: 0, fontSize: '1rem', color: '#f87171' }}>Temperature History (°C)</h4>
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                              {timeRange === '1 day' && (
                                <input 
                                  type="date" 
                                  value={selectedDate}
                                  onChange={(e) => setSelectedDate(e.target.value)}
                                  style={{
                                    background: 'var(--bg-color)',
                                    border: '1px solid var(--border-color)',
                                    color: 'var(--text-primary)',
                                    padding: '3px 8px',
                                    borderRadius: '4px',
                                    fontSize: '0.75rem',
                                    outline: 'none',
                                    colorScheme: 'dark'
                                  }}
                                />
                              )}
                              {timeRange === 'Custom' && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                  <input 
                                    type="date" 
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                    style={{
                                      background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)',
                                      padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', outline: 'none', colorScheme: 'dark'
                                    }}
                                  />
                                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>to</span>
                                  <input 
                                    type="date" 
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                    style={{
                                      background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)',
                                      padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', outline: 'none', colorScheme: 'dark'
                                    }}
                                  />
                                </div>
                              )}
                              {['1 day', '7 day', 'Custom'].map(range => (
                                <button
                                  key={range}
                                  onClick={() => setTimeRange(range)}
                                  style={{
                                    background: timeRange === range ? 'var(--primary)' : 'transparent',
                                    border: `1px solid ${timeRange === range ? 'var(--primary)' : 'var(--border-color)'}`,
                                    color: timeRange === range ? '#fff' : 'var(--text-secondary)',
                                    padding: '4px 12px',
                                    borderRadius: '4px',
                                    fontSize: '0.75rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s'
                                  }}
                                >
                                  {range}
                                </button>
                              ))}
                              {isAnyZoomed && (
                                <button
                                  onClick={handleResetZoom}
                                  style={{
                                    background: '#ef4444', border: 'none', color: '#fff', padding: '4px 12px', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer'
                                  }}
                                >
                                  Reset Zoom
                                </button>
                              )}
                            </div>
                          </div>
                          <div 
                            style={{ flex: 1, padding: '1rem 1rem 1rem 0', position: 'relative', userSelect: 'none' }} 
                            onWheelCapture={zoomPanTemp.handleWheel}
                            onMouseDownCapture={zoomPanTemp.handleMouseDown}
                            onMouseMoveCapture={zoomPanTemp.handleMouseMove}
                            onMouseUpCapture={zoomPanTemp.handleMouseUp}
                            onMouseLeave={zoomPanTemp.handleMouseUp}
                            onContextMenu={zoomPanTemp.handleContextMenu}
                          >
                            {historyLoading && (
                              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(21, 30, 45, 0.7)', zIndex: 10, borderRadius: '0.5rem' }}>
                                <div style={{ width: '30px', height: '30px', border: '3px solid #1e293b', borderTopColor: '#38bdf8', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                              </div>
                            )}
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={zoomPanTemp.displayedData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis 
                                  dataKey="time" 
                                  stroke="#64748b" 
                                  fontSize={10} 
                                  tickLine={false} 
                                  axisLine={false} 
                                  angle={-60} 
                                  textAnchor="end"
                                  height={60}
                                  interval="preserveStartEnd"
                                  minTickGap={20}
                                />
                                <YAxis stroke="#f87171" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line type="monotone" dataKey="CurrentTemperature" stroke="#f87171" strokeWidth={2} dot={false} activeDot={{ r: 6, fill: '#f87171', stroke: '#fff', strokeWidth: 2 }} />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Humidity Graph */}
                        <div style={{ flex: 1, minHeight: '250px', backgroundColor: '#151e2d', borderRadius: '0.5rem', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
                          <div style={{ padding: '1rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                            <h4 style={{ margin: 0, fontSize: '1rem', color: '#60a5fa' }}>Humidity History (%)</h4>
                          </div>
                          <div 
                            style={{ flex: 1, padding: '1rem 1rem 1rem 0', position: 'relative', userSelect: 'none' }} 
                            onWheelCapture={zoomPanHum.handleWheel}
                            onMouseDownCapture={zoomPanHum.handleMouseDown}
                            onMouseMoveCapture={zoomPanHum.handleMouseMove}
                            onMouseUpCapture={zoomPanHum.handleMouseUp}
                            onMouseLeave={zoomPanHum.handleMouseUp}
                            onContextMenu={zoomPanHum.handleContextMenu}
                          >
                            {historyLoading && (
                              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(21, 30, 45, 0.7)', zIndex: 10, borderRadius: '0.5rem' }}>
                                <div style={{ width: '30px', height: '30px', border: '3px solid #1e293b', borderTopColor: '#38bdf8', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                              </div>
                            )}
                            <ResponsiveContainer width="100%" height="100%">
                              <LineChart data={zoomPanHum.displayedData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                                <XAxis 
                                  dataKey="time" 
                                  stroke="#64748b" 
                                  fontSize={10} 
                                  tickLine={false} 
                                  axisLine={false} 
                                  angle={-60} 
                                  textAnchor="end"
                                  height={60}
                                  interval="preserveStartEnd"
                                  minTickGap={20}
                                />
                                <YAxis stroke="#60a5fa" fontSize={10} tickLine={false} axisLine={false} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line type="monotone" dataKey="CurrentHumidity" stroke="#60a5fa" strokeWidth={2} dot={false} activeDot={{ r: 6, fill: '#60a5fa', stroke: '#fff', strokeWidth: 2 }} />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)' }}>
                      Select a device from the list to view its live data.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'deployment' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div className="specs-title-box">
                <h2>Deployment Map</h2>
                <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>Geospatial visualization of ATRH weather station nodes.</p>
              </div>
              
              <div className="widget" style={{ padding: '0', overflow: 'hidden', height: '600px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <MapContainer center={[31.1, 75.6]} zoom={7} style={{ height: '100%', width: '100%', backgroundColor: '#0f172a' }}>
                  <TileLayer
                    attribution='&amp;copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
                            <div style={{ marginTop: '6px', paddingTop: '6px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', flexDirection: 'column', gap: '4px' }}>
                              <span style={{ 
                                color: d.isActive ? '#10b981' : '#f43f5e', 
                                fontWeight: '600',
                                fontSize: '12px'
                              }}>
                                {d.isActive ? 'Active' : 'Inactive'}
                              </span>
                              <span style={{ fontSize: '12px', color: '#64748b' }}>
                                Temp: {Number(d.CurrentTemperature).toFixed(2)} °C
                              </span>
                              <span style={{ fontSize: '12px', color: '#64748b' }}>
                                Humidity: {Number(d.CurrentHumidity).toFixed(2)} %
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
            <div className="animate-fade-in">
              <h2 style={{ marginBottom: '2rem' }}>Hardware Specifications</h2>
              
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

        </div>
      </main>
    </div>
  );
}

export default App;
