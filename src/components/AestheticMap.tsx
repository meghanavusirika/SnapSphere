import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { Camera, X, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { classifyImageVibe, getPlaceDetails } from '../services/photoSpotService';

interface PhotoSpot {
  id: string;
  name: string;
  description: string;
  location: { lat: number; lng: number };
  vibe: string[];
  bestTime: string;
  samplePhotos: string[];
  safetyNotes: string;
  crowdLevel: 'low' | 'medium' | 'high';
  submittedBy: string;
  rating: number;
  source: 'community' | 'mapillary';
}

// Add interface for enriched image data
interface EnrichedImage {
  photo_url: string;
  latitude: number;
  longitude: number;
  vibes: string[];
  place_name: string;
  description: string;
  best_time: string;
  crowd_level: string;
  safety_notes: string;
  rating: number;
  submitted_by: string;
  full_address: string;
}

// Add a type for user location
interface UserLocation {
  lat: number;
  lng: number;
}

// Remove samplePhotoSpots and useMapillary toggle
// Remove all references to samplePhotoSpots, useMapillary, and related UI
// Only keep logic for fetching and displaying real Mapillary/AI-tagged data

const vibeOptions = [
  { id: 'moody', label: 'Moody', icon: '🌫️', color: 'bg-gray-600' },
  { id: 'urban', label: 'Urban', icon: '🏙️', color: 'bg-blue-500' },
  { id: 'nature', label: 'Nature', icon: '🌿', color: 'bg-green-500' },
  { id: 'colorful', label: 'Colorful', icon: '🌈', color: 'bg-pink-400' },
  { id: 'peaceful', label: 'Peaceful', icon: '🧘', color: 'bg-blue-400' },
  { id: 'vintage', label: 'Vintage', icon: '🏛️', color: 'bg-yellow-600' },
  { id: 'graffiti', label: 'Graffiti', icon: '🎨', color: 'bg-purple-500' },
  { id: 'trail', label: 'Trail', icon: '🥾', color: 'bg-orange-500' },
  { id: 'abandoned', label: 'Abandoned', icon: '🏚️', color: 'bg-gray-700' },
  { id: 'calm', label: 'Calm', icon: '🌊', color: 'bg-teal-500' },
  { id: 'modern', label: 'Modern', icon: '✨', color: 'bg-indigo-500' }
];

const BACKEND_URL = 'http://localhost:5001';

const AestheticMap: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [selectedSpot, setSelectedSpot] = useState<PhotoSpot | null>(null);
  const [apiStatus, setApiStatus] = useState<string>('📡 Loading...');
  const [apiStatusType, setApiStatusType] = useState<'loading' | 'success' | 'error'>('success');
  const [spots, setSpots] = useState<PhotoSpot[]>([]);
  // Add user location state
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  // Store map instance
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);
  // Store user marker instance
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  // Remove travelMode state and Route Mode selector
  // Remove all logic related to travelMode and directionsRendererRef
  // Add radius for nearby filtering (in meters) - increased for better visibility
  const NEARBY_RADIUS_METERS = 50000; // 50km radius
  // Add ref for search input
  const searchInputRef = useRef<HTMLInputElement>(null);
  // Add ref for autocomplete instance
  const autocompleteRef = useRef<any>(null);
  // Store loaded google object
  const [googleObj, setGoogleObj] = useState<any>(null);
  // Store Mapillary images with enriched details
  const [enrichedImages, setEnrichedImages] = useState<EnrichedImage[]>([]);
  const [mapillaryTagsLoading, setMapillaryTagsLoading] = useState(false);
  const [selectedPlaceIdx, setSelectedPlaceIdx] = useState<number | null>(null);
  const [showModal, setShowModal] = useState(false);
  const infoWindowRef = useRef<any>(null);
  // Remove old placeNames and geocoding logic


    

  // Refresh handler (fetch Mapillary images for current location)
  const handleRefresh = useCallback(async () => {
    if (!userLocation) return;
    setApiStatus('📡 Fetching Mapillary images...');
    setApiStatusType('loading');
    setMapillaryTagsLoading(true);
    try {
      // Fetch new Mapillary images for this location
      await fetch('http://localhost:5001/fetch_mapillary_photos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: userLocation.lat,
          longitude: userLocation.lng,
          radius: 2
        })
      });
      // After fetching, get all nearby images from the backend
      const params = new URLSearchParams({
        latitude: userLocation.lat.toString(),
        longitude: userLocation.lng.toString(),
        radius: '2',
      });
      const res = await fetch(`http://localhost:5001/photos_nearby?${params}`);
      const data = await res.json();
      const photos = data.photos || [];
      // For each photo, fetch enriched details from backend
      const enriched = await Promise.all(
        photos.map(async (img: any) => {
          const details = await getPlaceDetails(img.latitude, img.longitude, img.photo_url);
          return {
            ...img,
            place_name: details.place_name,
            description: details.description,
            vibes: details.vibes,
            best_time: details.best_time,
            crowd_level: details.crowd_level,
            safety_notes: details.safety_notes,
            rating: details.rating,
            submitted_by: details.submitted_by,
            full_address: details.full_address
          } as EnrichedImage;
        })
      );
      setEnrichedImages(enriched);
      setApiStatus((enriched.length) ? '✅ Showing Mapillary images' : '⚠️ No images found');
      setApiStatusType((enriched.length) ? 'success' : 'error');
    } catch (err) {
      setApiStatus('❌ Error fetching images');
      setApiStatusType('error');
    } finally {
      setMapillaryTagsLoading(false);
    }
  }, [userLocation]);

  // Geolocation handler
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        // Center map if available
        if (mapInstance) {
          mapInstance.setCenter({ lat: latitude, lng: longitude });
          mapInstance.setZoom(15);
        }
      },
      (error) => {
        alert('Unable to retrieve your location.');
      }
    );
  };

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'YOUR_API_KEY_HERE',
      version: 'weekly',
      libraries: ['places']
    });
    loader.load().then((google) => {
      setGoogleObj(google);
      if (mapRef.current) {
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: 43.6532, lng: -79.3832 },
          zoom: 13,
        });
        setMapInstance(map);
      }
    });
  }, []);

  // Add/Update user marker (orange)
  useEffect(() => {
    if (userLocation && mapInstance && googleObj) {
      const google = googleObj;
      if (userMarkerRef.current) {
        userMarkerRef.current.setMap(null);
      }
      userMarkerRef.current = new google.maps.Marker({
        position: userLocation,
        map: mapInstance,
        title: 'Your Location',
        icon: {
          url: 'https://maps.google.com/mapfiles/ms/icons/orange-dot.png',
          scaledSize: new google.maps.Size(40, 40),
        },
      });
      mapInstance.setCenter(userLocation);
      mapInstance.setZoom(15);
    }
  }, [userLocation, mapInstance, googleObj]);

  // Filter images based on selected vibes
  const filteredImages = enrichedImages.filter(img => {
    if (selectedVibes.length === 0) return true; // Show all if no vibes selected
    // Check if image has ALL selected vibes
    return selectedVibes.every(vibe => 
      img.vibes && img.vibes.some(imgVibe => imgVibe.toLowerCase() === vibe.toLowerCase())
    );
  });

  // De-duplicate by place_name, keeping the highest-rated image for each
  const dedupedImages = Object.values(
    filteredImages.reduce((acc, img) => {
      const key = img.place_name.toLowerCase();
      if (!acc[key] || (img.rating > acc[key].rating)) {
        acc[key] = img;
      }
      return acc;
    }, {} as Record<string, EnrichedImage>)
  ).slice(0, 50); // Limit to maximum 50 places

  // Add/Update photo markers (green), and handle highlighting
  const photoMarkersRef = useRef<any[]>([]);
  useEffect(() => {
    if (!mapInstance || !googleObj) return;
    // Remove old photo markers
    photoMarkersRef.current.forEach(marker => marker.setMap(null));
    photoMarkersRef.current = [];
    // Add new markers for each deduped image
    dedupedImages.forEach((img: any, idx: number) => {
      const marker = new googleObj.maps.Marker({
        position: { lat: img.latitude, lng: img.longitude },
        map: mapInstance,
        title: img.vibes ? img.vibes.join(', ') : '',
        icon: {
          url: selectedPlaceIdx === idx
            ? 'https://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
            : 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
          scaledSize: new googleObj.maps.Size(40, 40),
        },
      });
      // Add click listener
      marker.addListener('click', () => {
        // Find the index in the original enrichedImages array
        const originalIdx = enrichedImages.findIndex(originalImg => 
          originalImg.photo_url === img.photo_url
        );
        setSelectedPlaceIdx(originalIdx);
        setShowModal(true);
        // Bounce animation for selected marker
        if (infoWindowRef.current) infoWindowRef.current.close();
        infoWindowRef.current = new googleObj.maps.InfoWindow({
          content: `<div style='max-width:200px'><div style='margin-top:8px;font-weight:bold'>${img.place_name || 'Loading...'} </div><div>${img.vibes ? img.vibes.join(', ') : ''}</div></div>`
        });
        infoWindowRef.current.open(mapInstance, marker);
      });
      photoMarkersRef.current.push(marker);
    });
  }, [dedupedImages, mapInstance, googleObj, selectedPlaceIdx, enrichedImages]);

  // Effect to fetch and display route when userLocation and selectedSpot are set
  useEffect(() => {
    if (userLocation && selectedSpot && mapInstance && window.google) {
      const directionsService = new window.google.maps.DirectionsService();
      // Remove previous route if exists
      // Remove all logic and code blocks related to directionsRendererRef, travelMode, and setRouteInfo
    } else {
      // Remove route if deselected
    }
  }, [userLocation, selectedSpot, mapInstance]);

  // Add geolocation logic with improved status
  useEffect(() => {
    setApiStatus('📡 Locating user...');
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setApiStatus('📡 Fetching Mapillary images...');
        },
        (err) => {
          setApiStatus('⚠️ Location access denied or timed out');
          setApiStatusType('error');
          setUserLocation({ lat: 43.6532, lng: -79.3832 });
        },
        { timeout: 15000 } // 15 seconds timeout (increased from 8 seconds)
      );
    } else {
      setApiStatus('⚠️ Geolocation not supported');
      setApiStatusType('error');
      setUserLocation({ lat: 43.6532, lng: -79.3832 });
    }
  }, []);

  // Initialize Places Autocomplete after google, map, and input are ready
  useEffect(() => {
    if (googleObj && mapInstance && searchInputRef.current) {
      autocompleteRef.current = new googleObj.maps.places.Autocomplete(
        searchInputRef.current as HTMLInputElement,
        {
          types: ['geocode'],
        }
      );
      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current.getPlace();
        if (place && place.geometry && place.geometry.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          setUserLocation({ lat, lng });
          if (mapInstance) {
            mapInstance.setCenter({ lat, lng });
            mapInstance.setZoom(15);
          }
        }
      });
    }
  }, [googleObj, mapInstance]);

  // Fetch images from backend when userLocation changes
  useEffect(() => {
    if (!userLocation) return;
    setMapillaryTagsLoading(true);
    // First, fetch new Mapillary images for this location
    fetch('http://localhost:5001/fetch_mapillary_photos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        latitude: userLocation.lat,
        longitude: userLocation.lng,
        radius: 2
      })
    })
      .then(() => {
        // After fetching, get all nearby images from the backend
        const params = new URLSearchParams({
          latitude: userLocation.lat.toString(),
          longitude: userLocation.lng.toString(),
          radius: '2',
        });
        return fetch(`http://localhost:5001/photos_nearby?${params}`);
      })
      .then(res => res.json())
      .then(async data => {
        const photos = data.photos || [];
        // For each photo, fetch enriched details from backend
        const enriched = await Promise.all(
          photos.map(async (img: any) => {
            const details = await getPlaceDetails(img.latitude, img.longitude, img.photo_url);
            return {
              ...img,
              place_name: details.place_name,
              description: details.description,
              vibes: details.vibes,
              best_time: details.best_time,
              crowd_level: details.crowd_level,
              safety_notes: details.safety_notes,
              rating: details.rating,
              submitted_by: details.submitted_by,
              full_address: details.full_address
            } as EnrichedImage;
          })
        );
        setEnrichedImages(enriched);
        setApiStatus((enriched.length) ? '✅ Showing Mapillary images' : '⚠️ No images found');
        setApiStatusType((enriched.length) ? 'success' : 'error');
        setMapillaryTagsLoading(false);
      })
      .catch(() => {
        setApiStatus('❌ Error fetching images');
        setApiStatusType('error');
        setMapillaryTagsLoading(false);
      });
  }, [userLocation]);

  // Remove old placeNames and geocoding logic

  // Helper: Calculate distance between two lat/lng points (Haversine formula)
  function getDistanceMeters(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371000; // meters
    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
    const aVal =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLng / 2) * Math.sin(dLng / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(aVal), Math.sqrt(1 - aVal));
    return R * c;
  }

  // Filter spots by selected vibes AND proximity to user
  const filteredSpots = userLocation
    ? spots.filter(
        spot => {
          const distance = getDistanceMeters(userLocation, spot.location);
          const withinRadius = distance <= NEARBY_RADIUS_METERS;
          const matchesVibe = selectedVibes.length === 0 || spot.vibe.some(vibe => selectedVibes.includes(vibe));
          console.log(`Spot ${spot.name}: distance=${Math.round(distance/1000)}km, withinRadius=${withinRadius}, matchesVibe=${matchesVibe}`);
          return withinRadius && matchesVibe;
        }
      )
    : spots.filter(spot => {
        const matchesVibe = selectedVibes.length === 0 || spot.vibe.some(vibe => selectedVibes.includes(vibe));
        console.log(`Spot ${spot.name}: no location, matchesVibe=${matchesVibe}`);
        return matchesVibe;
      });

  const toggleVibe = (vibeId: string) => {
    setSelectedVibes(prev =>
      prev.includes(vibeId)
        ? prev.filter(id => id !== vibeId)
        : [...prev, vibeId]
    );
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
      <div className="mb-2 px-6 py-3">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Vibemap</h1>
        <p className="text-gray-600">Discover hidden gems with vibe-based filters and AI-powered recommendations</p>
      </div>
      {/* Search Bar */}
      <div className="bg-white border-b border-gray-200 p-4 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search for a location..."
            className="w-full max-w-lg px-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
            style={{ fontSize: '1rem' }}
            aria-label="Search for a location"
          />
          {/* Locate Me Button */}
          <button
            onClick={handleLocateMe}
            className="ml-2 px-3 py-2 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded hover:opacity-90 transition-opacity flex items-center"
            title="Locate Me"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" /></svg>
            Locate Me
          </button>
          {/* Toggle Mapillary */}
          {/* Removed Mapillary toggle as per edit hint */}
        </div>
        {/* Vibe Filters and Refresh */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex flex-wrap gap-2">
            {vibeOptions.map(vibe => (
              <button
                key={vibe.id}
                onClick={() => toggleVibe(vibe.id)}
                className={`vibe-filter ${selectedVibes.includes(vibe.id) ? 'active' : 'inactive'} flex items-center space-x-1`}
              >
                <span>{vibe.icon}</span>
                <span>{vibe.label}</span>
              </button>
            ))}
          </div>
          <button
            onClick={handleRefresh}
            className="ml-4 px-3 py-2 bg-gray-200 rounded hover:bg-gray-300 flex items-center"
            title="Refresh Spots"
          >
            <RefreshCw className="w-4 h-4 mr-1" />
            Refresh
          </button>
        </div>
      </div>
      {/* API Status */}
      <div className={`px-4 py-2 text-sm ${
        apiStatusType === 'success' ? 'text-green-600' :
        apiStatusType === 'error' ? 'text-red-600' : 'text-gray-600'
      }`}>
        {apiStatus}
      </div>
      {/* Main Map and Sidebar - Updated to ensure sidebar matches map height */}
      <div className="flex-1 flex flex-row items-stretch min-w-0 h-full p-4 pb-6 overflow-hidden">
        <div className="flex-1 relative min-w-0 map-area">
          <div ref={mapRef} className="w-full h-full map-container rounded-lg" />
        </div>
        <div className="w-80 bg-white rounded-lg shadow-lg overflow-y-auto ml-4 flex-shrink-0 h-full sidebar-container">
          {/* Photo Spots List */}
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">
              Photo Spots ({dedupedImages.length === 50 ? '50+' : dedupedImages.length})
              {selectedVibes.length > 0 && (
                <span className="text-sm text-gray-500 ml-2">
                  (Filtered by: {selectedVibes.join(', ')})
                </span>
              )}
            </h3>
          </div>
          {/* In the sidebar, show place name, rating, and crowd level */}
          <div className="p-2 overflow-y-auto flex-1">
            {mapillaryTagsLoading ? (
              <div className="text-center text-gray-500 py-8">Loading place details...</div>
            ) : dedupedImages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                {selectedVibes.length > 0 ? 'No spots match the selected vibes.' : 'No images found.'}
              </div>
            ) : (
              dedupedImages.map((img, idx) => (
                <div
                  key={idx}
                  className="flex items-center mb-3 p-3 bg-white rounded-lg shadow-sm hover:bg-purple-50 transition cursor-pointer border border-gray-100"
                  onClick={() => { 
                    // Find the index in the original enrichedImages array
                    const originalIdx = enrichedImages.findIndex(originalImg => 
                      originalImg.photo_url === img.photo_url
                    );
                    setSelectedPlaceIdx(originalIdx); 
                    setShowModal(true); 
                  }}
                >
                  {img.photo_url ? (
                    <img src={img.photo_url} alt="Place" width={64} height={64} className="rounded-lg mr-3 border object-cover" style={{ minWidth: 64, minHeight: 64, maxWidth: 64, maxHeight: 64 }} />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg flex items-center justify-center mr-3">
                      <Camera className="w-8 h-8 text-purple-400" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-gray-900 text-base mb-1">{img.place_name}</div>
                    <div className="text-gray-600 text-xs truncate mb-2">{img.description}</div>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-yellow-500">★</span>
                      <span className="font-semibold">{img.rating ? img.rating.toFixed(1) : 'N/A'}</span>
                      {img.crowd_level && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                          img.crowd_level === 'low' ? 'bg-green-100 text-green-700' :
                          img.crowd_level === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {img.crowd_level}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {/* Spot Details Modal */}
      <AnimatePresence>
        {showModal && selectedPlaceIdx !== null && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <div
              className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-0 relative flex flex-col items-center min-h-[500px]"
              style={{ minWidth: 400 }}
              onClick={e => e.stopPropagation()}
            >
              <button
                className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 text-2xl z-10"
                onClick={() => setShowModal(false)}
                aria-label="Close"
              >
                ×
              </button>
              {enrichedImages[selectedPlaceIdx]?.photo_url ? (
                <img
                  src={enrichedImages[selectedPlaceIdx].photo_url}
                  alt="Spot"
                  className="w-full h-60 object-cover rounded-t-2xl"
                  style={{ maxHeight: 260 }}
                />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mt-8 mb-5">
                  <Camera className="w-10 h-10 text-purple-400" />
                </div>
              )}
              <div className="p-6 flex-1 flex flex-col justify-center w-full">
                <div className="text-2xl font-bold text-gray-900 mb-2 text-center">{enrichedImages[selectedPlaceIdx]?.place_name}</div>
                <div className="text-sm text-gray-500 mb-4 text-center">{enrichedImages[selectedPlaceIdx]?.full_address}</div>
                <div className="text-gray-600 mb-5 text-center text-base whitespace-pre-line">{enrichedImages[selectedPlaceIdx]?.description}</div>
                
                {/* Vibes/Tags */}
                <div className="flex flex-wrap gap-2 justify-center mb-5">
                  {enrichedImages[selectedPlaceIdx]?.vibes && enrichedImages[selectedPlaceIdx]?.vibes.length > 0
                    ? enrichedImages[selectedPlaceIdx].vibes.map((tag: string) => (
                        <span key={tag} className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">{tag}</span>
                      ))
                    : null}
                </div>

                {/* Additional Details */}
                <div className="space-y-3 text-sm text-gray-700 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">🕐</span>
                    <span><strong>Best time:</strong> {enrichedImages[selectedPlaceIdx]?.best_time || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">👥</span>
                    <span><strong>Crowd level:</strong> {enrichedImages[selectedPlaceIdx]?.crowd_level || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">🛡️</span>
                    <span><strong>Safety:</strong> {enrichedImages[selectedPlaceIdx]?.safety_notes || 'N/A'}</span>
                  </div>
                </div>

                {/* Rating and Submitted By */}
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-yellow-500 text-lg">★</span>
                  <span className="font-semibold text-lg">{enrichedImages[selectedPlaceIdx]?.rating ? enrichedImages[selectedPlaceIdx].rating.toFixed(1) : 'N/A'}</span>
                  <span className="text-gray-500">/5 rating</span>
                </div>
                <div className="text-xs text-gray-400 text-center">Submitted by {enrichedImages[selectedPlaceIdx]?.submitted_by || 'Unknown'}</div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AestheticMap; 