import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in Leaflet + Webpack/React
// See: https://github.com/PaulLeCam/react-leaflet/issues/453
// @ts-ignore
import icon from 'leaflet/dist/images/marker-icon.png';
// @ts-ignore
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface LocationPickerMapProps {
  onLocationSelect: (address: string) => void;
  initialCenter?: [number, number];
}

function MapEvents({ onLocationClick }: { onLocationClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function LocationPickerMap({ onLocationSelect, initialCenter = [13.7367, 100.5231] }: LocationPickerMapProps) {
  const [position, setPosition] = useState<[number, number]>(initialCenter);
  const [loading, setLoading] = useState(false);

  const fetchAddress = async (lat: number, lng: number) => {
    setLoading(true);
    try {
      // Use zoomed in reverse geocoding for more precise local address
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
      const data = await response.json();
      
      if (data && data.address) {
        const addr = data.address;
        // Build a more concise address: [road/name], [suburb/city_district], [city/town/village]
        const main = addr.road || addr.pedestrian || addr.suburb || addr.neighbourhood || addr.city_district || '';
        const secondary = addr.city || addr.town || addr.village || addr.county || '';
        
        let conciseAddress = '';
        if (main && secondary) {
          conciseAddress = `${main}, ${secondary}`;
        } else if (main || secondary) {
          conciseAddress = main || secondary;
        } else {
          conciseAddress = data.display_name.split(',').slice(0, 2).join(',').trim();
        }
        
        onLocationSelect(conciseAddress);
      } else if (data && data.display_name) {
        // Fallback to first two parts of display_name
        const shortName = data.display_name.split(',').slice(0, 2).join(',').trim();
        onLocationSelect(shortName);
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMapClick = (lat: number, lng: number) => {
    setPosition([lat, lng]);
    fetchAddress(lat, lng);
  };

  return (
    <div className="relative w-full aspect-video rounded-[32px] overflow-hidden shadow-xl border border-blue-50">
      <MapContainer 
        center={position} 
        zoom={13} 
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <ChangeView center={position} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} />
        <MapEvents onLocationClick={handleMapClick} />
      </MapContainer>
      
      {loading && (
        <div className="absolute inset-0 bg-white/20 backdrop-blur-sm z-[1000] flex items-center justify-center">
          <div className="bg-white px-4 py-2 rounded-full shadow-lg text-blue-600 font-bold text-sm">
            Fetching Address...
          </div>
        </div>
      )}
      
      <div className="absolute bottom-4 left-4 right-4 z-[1000] pointer-events-none">
        <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-2xl shadow-lg border border-white/20 text-gray-700 text-xs font-medium">
          Tap on the map to pin a location
        </div>
      </div>
    </div>
  );
}
