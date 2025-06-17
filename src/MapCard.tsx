import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Polygon, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function ResizeMap() {
  const map = useMap();

  useEffect(() => {
    // Defer until after render
    setTimeout(() => {
      map.invalidateSize();
    }, 0);
  }, [map]);

  return null;
}

export default function MapCard({ title, center, footprint, selected, onClick }) {
  const cardClass = `card ${selected ? "selected" : "dimmed"}`;

  return (
      <div className={cardClass} onClick={onClick}>
        <MapContainer
            center={center}
            zoom={18}
            zoomControl={false}
            dragging={false}
            scrollWheelZoom={false}
            doubleClickZoom={false}
            attributionControl={false}
        >
          <ResizeMap />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Polygon positions={footprint} pathOptions={{ color: "black", weight: 2 }} />
        </MapContainer>
        <div className="card-title">{title}</div>
      </div>
  );
}
