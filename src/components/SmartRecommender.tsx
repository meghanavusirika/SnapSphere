import React, { useState, useEffect } from 'react';
import { Heart, MapPin, Cloud, Sun, Moon, Clock, Star, Navigation, Filter, RefreshCw } from 'lucide-react';
import { recommendationService } from '../services/featureService';

interface Recommendation {
  id: number;
  photo_url: string;
  place_name: string;
  description: string;
  vibes: string[];
  best_time: string;
  crowd_level: string;
  rating: number;
  distance_km: number;
  priority?: 'high' | 'normal';
}

interface SmartRecommenderProps {
  recommendations: Recommendation[];
  weather_condition: string;
  time_of_day: string;
  total_spots_found: number;
}

const SmartRecommender: React.FC = () => {
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [locationSearch, setLocationSearch] = useState('');
  const [useLocationSearch, setUseLocationSearch] = useState(true); // Changed to true as default
  const [weather, setWeather] = useState('clear');
  const [timeOfDay, setTimeOfDay] = useState('daylight');
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    maxDistance: 5,
    minRating: 4.0,
    preferredVibes: [] as string[]
  });

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setLatitude(latitude.toString());
          setLongitude(longitude.toString());
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  }, []);

  const geocodeLocation = async (locationName: string) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationName)}&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const location = data[0];
        setLatitude(location.lat);
        setLongitude(location.lon);
        return { lat: parseFloat(location.lat), lng: parseFloat(location.lon) };
      } else {
        throw new Error('Location not found');
      }
    } catch (error) {
      console.error('Geocoding error:', error);
      throw new Error('Failed to find location. Please check the spelling and try again.');
    }
  };

  const getRecommendations = async () => {
    let finalLatitude = latitude;
    let finalLongitude = longitude;

    if (useLocationSearch && locationSearch.trim()) {
      try {
        setLoading(true);
        setError('');
        const coords = await geocodeLocation(locationSearch.trim());
        finalLatitude = coords.lat.toString();
        finalLongitude = coords.lng.toString();
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
        return;
      }
    }

    if (!finalLatitude || !finalLongitude) {
      setError('Please enter location coordinates or search for a location');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const result = await recommendationService.getSmartRecommendations({
        latitude: parseFloat(finalLatitude),
        longitude: parseFloat(finalLongitude),
        weather: weather,
        time_of_day: timeOfDay,
        preferences: filters
      });
      setRecommendations(result);
    } catch (err: any) {
      setError(err.message || 'Failed to get recommendations');
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition) {
      case 'clear': return <Sun className="w-5 h-5 text-yellow-500" />;
      case 'cloudy': return <Cloud className="w-5 h-5 text-gray-500" />;
      case 'rainy': return <Cloud className="w-5 h-5 text-blue-500" />;
      case 'sunny': return <Sun className="w-5 h-5 text-orange-500" />;
      default: return <Sun className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getTimeIcon = (time: string) => {
    switch (time) {
      case 'golden_hour': return <Sun className="w-5 h-5 text-orange-500" />;
      case 'blue_hour': return <Moon className="w-5 h-5 text-blue-500" />;
      case 'daylight': return <Sun className="w-5 h-5 text-yellow-500" />;
      default: return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    return priority === 'high' ? 'border-orange-500 bg-orange-50' : 'border-gray-200';
  };

  const getCrowdLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto h-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Smart Recommendations</h1>
        <p className="text-gray-600">Get personalized suggestions based on your style, weather, and golden hour alerts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Input Panel */}
        <div className="lg:col-span-1 space-y-6 overflow-y-auto">
          {/* Location Input */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-2 mb-4">
              <MapPin className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-bold text-gray-900">Location</h2>
            </div>
            
            {/* Location Input Toggle */}
            <div className="flex space-x-2 mb-4">
              <button
                onClick={() => setUseLocationSearch(true)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  useLocationSearch
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Search Location
              </button>
              <button
                onClick={() => setUseLocationSearch(false)}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  !useLocationSearch
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Coordinates
              </button>
            </div>
            
            <div className="space-y-4">
              {!useLocationSearch ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
                    <input
                      type="number"
                      step="any"
                      value={latitude}
                      onChange={(e) => setLatitude(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="40.7128"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
                    <input
                      type="number"
                      step="any"
                      value={longitude}
                      onChange={(e) => setLongitude(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      placeholder="-74.0060"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search Location</label>
                  <input
                    type="text"
                    value={locationSearch}
                    onChange={(e) => setLocationSearch(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="e.g., Times Square, Central Park, or Brooklyn Bridge"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Enter a city, landmark, or address to find nearby photo spots
                  </p>
                </div>
              )}

              {userLocation && (
                <button
                  onClick={() => {
                    setLatitude(userLocation.lat.toString());
                    setLongitude(userLocation.lng.toString());
                    setUseLocationSearch(false);
                    setLocationSearch('');
                  }}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Use Current Location</span>
                </button>
              )}
            </div>
          </div>

          {/* Weather & Time Settings */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Conditions</h2>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Filter className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Weather Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Weather Condition</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'clear', label: 'Clear', icon: <Sun className="w-4 h-4" /> },
                    { value: 'cloudy', label: 'Cloudy', icon: <Cloud className="w-4 h-4" /> },
                    { value: 'rainy', label: 'Rainy', icon: <Cloud className="w-4 h-4" /> },
                    { value: 'sunny', label: 'Sunny', icon: <Sun className="w-4 h-4" /> }
                  ].map((condition) => (
                    <button
                      key={condition.value}
                      onClick={() => setWeather(condition.value)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 flex items-center space-x-2 ${
                        weather === condition.value
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {condition.icon}
                      <span className="text-sm font-medium">{condition.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time of Day Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Time of Day</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: 'daylight', label: 'Daylight', icon: <Sun className="w-4 h-4" /> },
                    { value: 'golden_hour', label: 'Golden Hour', icon: <Sun className="w-4 h-4" /> },
                    { value: 'blue_hour', label: 'Blue Hour', icon: <Moon className="w-4 h-4" /> }
                  ].map((time) => (
                    <button
                      key={time.value}
                      onClick={() => setTimeOfDay(time.value)}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 flex flex-col items-center space-y-1 ${
                        timeOfDay === time.value
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {time.icon}
                      <span className="text-xs font-medium">{time.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Advanced Filters</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Distance (km)</label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={filters.maxDistance}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxDistance: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>1km</span>
                      <span>{filters.maxDistance}km</span>
                      <span>10km</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Rating</label>
                    <input
                      type="range"
                      min="3.0"
                      max="5.0"
                      step="0.1"
                      value={filters.minRating}
                      onChange={(e) => setFilters(prev => ({ ...prev, minRating: parseFloat(e.target.value) }))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>3.0</span>
                      <span>{filters.minRating}</span>
                      <span>5.0</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Generate Button */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <button
              onClick={getRecommendations}
              disabled={loading || (!latitude && !longitude && !locationSearch.trim())}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Finding Spots...</span>
                </>
              ) : (
                <>
                  <Heart className="w-5 h-5" />
                  <span>{useLocationSearch ? 'Find Photo Spots' : 'Get Recommendations'}</span>
                </>
              )}
            </button>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 overflow-y-auto">
          {recommendations.length > 0 ? (
            <div className="space-y-6">
              {/* Current Conditions */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Current Conditions</h2>
                <div className="flex items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    {getWeatherIcon(weather)}
                    <span className="font-medium capitalize">{weather}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getTimeIcon(timeOfDay)}
                    <span className="font-medium capitalize">{timeOfDay.replace('_', ' ')}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {useLocationSearch && locationSearch ? locationSearch : `${latitude}, ${longitude}`}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div className="space-y-4">
                {recommendations.map((spot, index) => (
                  <div
                    key={spot.id}
                    className={`bg-white rounded-2xl shadow-sm border-2 p-6 transition-all duration-200 hover:shadow-md ${getPriorityColor(spot.priority || 'normal')}`}
                  >
                    <div className="flex space-x-4">
                      {/* Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={spot.photo_url}
                          alt={spot.place_name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-bold text-gray-900 truncate">
                            {spot.place_name || 'Unknown Location'}
                          </h3>
                          <div className="flex items-center space-x-1">
                            <Star className="w-4 h-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">{spot.rating || 0}</span>
                          </div>
                        </div>

                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {spot.description || 'No description available'}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            {/* Vibes */}
                            <div className="flex space-x-1">
                              {(spot.vibes || []).slice(0, 3).map((vibe, vibeIndex) => (
                                <span
                                  key={vibeIndex}
                                  className="px-2 py-1 bg-gradient-to-r from-primary-100 to-purple-100 text-primary-700 rounded-full text-xs font-medium"
                                >
                                  {vibe}
                                </span>
                              ))}
                            </div>

                            {/* Best Time */}
                            <div className="flex items-center space-x-1 text-sm text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span>{spot.best_time || 'Unknown'}</span>
                            </div>

                            {/* Crowd Level */}
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCrowdLevelColor(spot.crowd_level || 'medium')}`}>
                              {spot.crowd_level || 'medium'} crowd
                            </span>
                          </div>

                          <div className="text-right">
                            <div className="text-sm text-gray-500">
                              {(spot.distance_km || 0).toFixed(1)}km away
                            </div>
                            {spot.priority === 'high' && (
                              <div className="text-xs text-orange-600 font-medium">Perfect timing!</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-red-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready for Recommendations</h2>
              <p className="text-lg text-gray-600 mb-6">Enter your location and preferences to get personalized photo spot suggestions</p>
              <div className="bg-gray-50 rounded-xl p-6 max-w-lg mx-auto">
                <p className="text-sm text-gray-500">Our smart recommender considers weather conditions, time of day, and your preferences to suggest the perfect photo spots.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SmartRecommender; 