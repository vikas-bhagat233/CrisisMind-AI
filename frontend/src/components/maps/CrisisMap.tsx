import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Shelter {
  name: string;
  lat: number;
  lng: number;
}

const epicenterIcon = L.divIcon({
  html: `<div class="w-6 h-6 bg-red-600 rounded-full border-2 border-white flex items-center justify-center shadow-lg text-xs relative">
           <span class="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping"></span>
           📍
         </div>`,
  className: "custom-epicenter-icon",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const shelterIcon = L.divIcon({
  html: `<div class="w-6 h-6 bg-emerald-600 rounded-full border-2 border-white flex items-center justify-center shadow-lg text-xs">
           🏠
         </div>`,
  className: "custom-shelter-icon",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

export default function CrisisMap({
  lat,
  lng,
  label,
  shelters = [],
}: {
  lat: number;
  lng: number;
  label: string;
  shelters?: Shelter[];
}) {
  return (
    <div className="h-64 rounded-lg overflow-hidden border border-base-600 relative z-0">
      <MapContainer center={[lat, lng]} zoom={12} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        <Marker position={[lat, lng]} icon={epicenterIcon}>
          <Popup>
            <div className="text-xs font-semibold">{label}</div>
          </Popup>
        </Marker>
        {shelters.map((s) => (
          <Marker key={s.name} position={[s.lat, s.lng]} icon={shelterIcon}>
            <Popup>
              <div className="text-xs">
                <p className="font-semibold text-emerald-600">🏠 Shelter</p>
                <p className="font-medium mt-0.5">{s.name}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
