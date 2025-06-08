'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px',
  borderRadius: '0.75rem',
  overflow: 'hidden'
};

interface MapWithCurrentLocationProps {
  setLongitude: (value: number) => void
  setLatitude: (value: number) => void
}

export default function MapSelectorCard({setLongitude, setLatitude} : MapWithCurrentLocationProps) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY!,
  });

  const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [markerPosition, setMarkerPosition] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };
        setCurrentPosition(coords);
        setMarkerPosition(coords);
        setLatitude(coords.lat);
        setLongitude(coords.lng);
      },
      (err) => {
        console.error('Geolocation error:', err);
        const fallback = { lat: 19.0760, lng: 72.8777 }; // Mumbai
        setCurrentPosition(fallback);
        setMarkerPosition(fallback);
      }
    );
  }, []);

  const onMarkerDragEnd = useCallback((event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const newPos = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
      };

      setLatitude(newPos.lat);
      setLongitude(newPos.lng);
      
      console.log('Draggable marker moved to:', newPos);
      setMarkerPosition(newPos);
    }
  }, []);

  if (!isLoaded || !currentPosition || !markerPosition) return <div>Loading map...</div>;

  return (
    <GoogleMap mapContainerStyle={containerStyle} center={currentPosition} zoom={15}>
      <Marker
        position={markerPosition}
        draggable={true}
        onDragEnd={onMarkerDragEnd}
        icon={{
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="256" height="256" viewBox="0 0 256 256">
        <g transform="translate(1.4066 1.4066) scale(2.81 2.81)">
          <line x1="0" y1="-23.9635" x2="0" y2="23.9635" style="fill:black;" />
          <path d="M 45 90 c -0.558 0 -1.011 -0.452 -1.011 -1.011 V 41.062 c 0 -0.558 0.453 -1.011 1.011 -1.011 s 1.011 0.453 1.011 1.011 v 47.927 C 46.011 89.548 45.558 90 45 90 z" style="fill:white;" />
          <circle cx="45.001" cy="20.531" r="20.531" style="fill:#F23F38;" />
          <circle cx="52.076" cy="13.456" r="5.056" style="fill:#FF9E9A;" />
        </g>
      </svg>
    `),
          scaledSize: new window.google.maps.Size(30, 30), 
        }}
      />

      <Marker
        position={currentPosition}
        icon={{
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="256" height="256" viewBox="0 0 256 256">
<g transform="translate(1.4066 1.4066) scale(2.81 2.81)">
  <circle cx="45" cy="45" r="45" style="fill: rgba(59,130,246,0.2);" />
  <circle cx="45" cy="45" r="15" style="fill: rgb(59,130,246);" />
  <circle cx="45" cy="45" r="8" style="fill: rgb(255,255,255);" />
</g>
</svg>
          `),
          scaledSize: new google.maps.Size(32, 32),
          anchor: new google.maps.Point(16, 16),
        }}
        title="Your Location"
      />
    </GoogleMap>
  );
}
