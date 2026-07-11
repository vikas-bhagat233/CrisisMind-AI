import React from "react";
import { Marker, Popup } from "react-leaflet";

export interface Shelter {
  name: string;
  lat: number;
  lng: number;
}

export default function ShelterMarkers({ shelters }: { shelters: Shelter[] }) {
  return (
    <>
      {shelters.map((s) => (
        <Marker key={s.name} position={[s.lat, s.lng]}>
          <Popup>{s.name}</Popup>
        </Marker>
      ))}
    </>
  );
}
