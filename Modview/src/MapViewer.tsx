
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const locations = [
  { name: 'MIT-WPU, Pune', position: [18.5183, 73.8152], quantity: 5, item: 'MODView with RS485 Interface' },
  { name: 'MIET', position: [28.9743, 77.6417], quantity: 5, item: 'MOD View with RS485 Interface' },
  { name: 'HRIT', position: [28.7112, 77.4950], quantity: 5, item: 'MODView with RS485 Interface' },
  { name: 'Chandigarh University', position: [30.7688, 76.5754], quantity: 5, item: 'MODView with RS485 Interface' },
  { name: 'SVPUAT', position: [29.0760, 77.7082], quantity: 10, item: 'MODView with RS485 Interface' },
  { name: 'Shoolini', position: [30.8753, 77.1147], quantity: 5, item: 'MODView with RS485 Interface' },
  { name: 'Acropolis', position: [22.8252, 75.9328], quantity: 5, item: 'Mod View' },
  { name: 'NIT SIKKIM', position: [27.2995, 88.3582], quantity: 5, item: 'MODView with RS485 Interface' },
  { name: 'EPIC, Ambala', position: [30.3470, 76.7860], quantity: 5, item: 'Modview with RS485 Interface' },
];

export default function MapViewer() {
  return (
    <div className="widget" style={{ width: '100%', padding: '1rem', height: '600px' }}>
      <MapContainer center={[24.0, 80.0]} zoom={5} attributionControl={false} style={{ height: '100%', width: '100%', borderRadius: '0.5rem', zIndex: 0 }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {locations.map((loc, index) => (
          <Marker key={index} position={loc.position as [number, number]}>
            <Popup>
              <b>{loc.name}</b><br />
              Item: {loc.item}<br />
              Quantity: {loc.quantity}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
