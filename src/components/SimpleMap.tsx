import React, { useRef, useEffect, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

const VIBES = [
  "moody", "urban", "nature", "colorful", "peaceful", "vintage", "graffiti", "trail", "abandoned", "calm", "modern"
];

const BACKEND_URL = 'http://localhost:5001'; // Change if backend is hosted elsewhere

const SimpleMap = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedVibe, setSelectedVibe] = useState<string>('');
  const [markers, setMarkers] = useState<any[]>([]);
  const [searchLocation, setSearchLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const prevLocation = useRef<{ lat: number; lng: number } | null>(null);

  // Get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(coords);
          setSearchLocation(coords);
        },
        () => {
          // Default to Toronto if denied
          setUserLocation({ lat: 43.6532, lng: -79.3832 });
          setSearchLocation({ lat: 43.6532, lng: -79.3832 });
        }
      );
    } else {
      setUserLocation({ lat: 43.6532, lng: -79.3832 });
      setSearchLocation({ lat: 43.6532, lng: -79.3832 });
    }
  }, []);

  // Initialize map
  useEffect(() => {
    if (!userLocation || !mapRef.current) return;
    const loader = new Loader({
      apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE',
      version: 'weekly',
    });
    loader.load().then((google) => {
      if (!mapRef.current) return;
      mapInstance.current = new google.maps.Map(mapRef.current, {
        center: userLocation,
        zoom: 13,
      });
      // Allow clicking to change search location
      mapInstance.current.addListener('click', (e: any) => {
        setSearchLocation({ lat: e.latLng.lat(), lng: e.latLng.lng() });
      });
    });
  }, [userLocation]);

  // Fetch Mapillary photos when searchLocation changes
  useEffect(() => {
    if (!searchLocation) return;
    // Only fetch if location actually changed
    if (
      prevLocation.current &&
      prevLocation.current.lat === searchLocation.lat &&
      prevLocation.current.lng === searchLocation.lng
    ) {
      return;
    }
    setLoading(true);
    fetch(`${BACKEND_URL}/fetch_mapillary_photos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        latitude: searchLocation.lat,
        longitude: searchLocation.lng,
        radius: 2,
      }),
    })
      .then(() => {
        setLoading(false);
        prevLocation.current = searchLocation;
      })
      .catch(() => setLoading(false));
  }, [searchLocation]);

  // Fetch and display markers when searchLocation or selectedVibe changes
  useEffect(() => {
    if (!searchLocation || !mapInstance.current) return;
    // Remove old markers
    markers.forEach((m) => m.setMap(null));
    setMarkers([]);
    // Fetch from backend
    const params = new URLSearchParams({
      latitude: searchLocation.lat.toString(),
      longitude: searchLocation.lng.toString(),
      radius: '2',
      ...(selectedVibe ? { vibe: selectedVibe } : {}),
    });
    fetch(`${BACKEND_URL}/photos_nearby?${params}`)
      .then((res) => res.json())
      .then((data) => {
        if (!data.photos) return;
        const loader = new Loader({
          apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE',
          version: 'weekly',
        });
        loader.load().then((google) => {
          const newMarkers = data.photos.map((photo: any) => {
            const marker = new google.maps.Marker({
              position: { lat: photo.latitude, lng: photo.longitude },
              map: mapInstance.current,
              title: photo.vibes.join(', '),
            });
            const infoWindow = new google.maps.InfoWindow({
              content: `<div><img src="${photo.photo_url}" alt="photo" style="width:100px;height:100px;object-fit:cover;" /><br/><b>Vibes:</b> ${photo.vibes.join(', ')}<br/><b>Distance:</b> ${photo.distance_km.toFixed(2)} km</div>`
            });
            marker.addListener('click', () => {
              infoWindow.open(mapInstance.current, marker);
            });
            return marker;
          });
          setMarkers(newMarkers);
          // Center map on search location
          mapInstance.current.setCenter(searchLocation);
        });
      });
  }, [searchLocation, selectedVibe]);

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <label>Vibe Filter: </label>
        <select value={selectedVibe} onChange={e => setSelectedVibe(e.target.value)}>
          <option value=''>All</option>
          {VIBES.map(v => <option key={v} value={v}>{v}</option>)}
        </select>
        <span style={{ marginLeft: 16 }}>
          <b>Search Location:</b> {searchLocation ? `${searchLocation.lat.toFixed(4)}, ${searchLocation.lng.toFixed(4)}` : 'Loading...'}
        </span>
        {loading && <span style={{ marginLeft: 16, color: 'orange' }}>Fetching Mapillary photos...</span>}
      </div>
      <div ref={mapRef} style={{ width: '100%', height: '500px', border: '2px solid red' }} />
    </div>
  );
};

export default SimpleMap; 