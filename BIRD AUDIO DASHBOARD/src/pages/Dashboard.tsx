import { useState } from 'react';
import { Hexagon, Activity, Waves, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import devicesData from '../data/devices.json';
import '../index.css';

interface Segment {
  filename: string;
  url: string;
}

interface Device {
  id: string;
  name: string;
  segments: Segment[];
}

export default function App() {
  const devices = devicesData as Device[];
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const handlePlay = (e: React.SyntheticEvent<HTMLAudioElement>) => {
    const audios = document.getElementsByTagName('audio');
    for (let i = 0; i < audios.length; i++) {
      if (audios[i] !== e.currentTarget) {
        audios[i].pause();
      }
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <Hexagon className="text-honey-primary" size={28} color="#f59e0b" />
          <h1>Bird Audio Data</h1>
        </div>
        <div style={{ padding: '0 16px 16px 16px', borderBottom: '1px solid rgba(245, 158, 11, 0.1)' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-muted)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 500 }}>
            <ArrowLeft size={16} /> Back to AviEar Home
          </Link>
        </div>
        <div className="device-list">
          {devices.map((device) => (
            <button
              key={device.id}
              className={`device-item ${selectedDevice?.id === device.id ? 'active' : ''}`}
              onClick={() => setSelectedDevice(device)}
            >
              <Activity size={18} />
              <span>{device.name}</span>
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        {selectedDevice ? (
          <>
            <header className="content-header">
              <h2>{selectedDevice.name} Audio Segments</h2>
              <p>Explore the recorded acoustic data for {selectedDevice.id}. Select a segment below to listen.</p>
            </header>
            
            <div className="audio-grid-container">
              <div className="audio-grid">
                {selectedDevice.segments.map((segment, idx) => (
                  <div key={idx} className="audio-card">
                    <div className="card-header">
                      <span className="card-title">{segment.filename}</span>
                      <div className="card-icon">
                        <Waves size={20} />
                      </div>
                    </div>
                    
                    <div className="player-wrapper">
                      <audio 
                        controls 
                        src={segment.url} 
                        onPlay={handlePlay}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <Hexagon size={64} />
            <h3>Select a device to view audio data</h3>
            <p>Choose one of the devices from the sidebar to explore the recorded bee sounds.</p>
          </div>
        )}
      </main>
    </div>
  );
}
