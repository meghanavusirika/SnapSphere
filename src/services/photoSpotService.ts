import { PhotoSpot } from '../App';

// Interface for different data sources
interface DataSource {
  name: string;
  apiKey?: string;
  baseUrl: string;
  enabled: boolean;
}

// Configuration for different data sources
const DATA_SOURCES: DataSource[] = [
  {
    name: 'Instagram',
    baseUrl: 'https://graph.instagram.com',
    enabled: false // Requires Instagram Basic Display API setup
  },
  {
    name: 'Unsplash',
    baseUrl: 'https://api.unsplash.com',
    enabled: false // Requires Unsplash API key
  },
  {
    name: 'Flickr',
    baseUrl: 'https://api.flickr.com/services/rest',
    enabled: false // Requires Flickr API key
  },
  {
    name: 'Google Places',
    baseUrl: 'https://maps.googleapis.com/maps/api/place',
    enabled: false // Requires Google Places API key
  },
  {
    name: 'Foursquare',
    baseUrl: 'https://api.foursquare.com/v3',
    enabled: false // Requires Foursquare API key
  }
];

// Sample data - In production, this would come from your backend
const SAMPLE_PHOTO_SPOTS: PhotoSpot[] = [
  {
    id: '1',
    name: 'Hidden Garden Alley',
    description: 'A secret passage with ivy-covered walls and vintage street lamps. Perfect for moody, vintage-style photography.',
    location: { lat: 43.6532, lng: -79.3832 },
    vibe: ['vintage', 'moody', 'urban'],
    bestTime: 'Golden Hour (6-7 PM)',
    samplePhotos: ['https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400'],
    safetyNotes: 'Safe during daylight hours. Well-lit area.',
    crowdLevel: 'low',
    submittedBy: 'Sarah M.',
    rating: 4.8,
    source: 'community'
  },
  {
    id: '2',
    name: 'Urban Rooftop Vista',
    description: 'Modern cityscape with perfect skyline views. Great for urban photography and city vibes.',
    location: { lat: 43.6532, lng: -79.3832 },
    vibe: ['urban', 'modern', 'cityscape'],
    bestTime: 'Blue Hour (8-9 PM)',
    samplePhotos: ['https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400'],
    safetyNotes: 'Access requires permission. Best during business hours.',
    crowdLevel: 'medium',
    submittedBy: 'Mike R.',
    rating: 4.6,
    source: 'community'
  },
  {
    id: '3',
    name: 'Misty Lake Pier',
    description: 'Peaceful lakeside with morning fog and wildlife. Ideal for nature and minimalist photography.',
    location: { lat: 43.6532, lng: -79.3832 },
    vibe: ['nature', 'peaceful', 'minimalist'],
    bestTime: 'Sunrise (6-7 AM)',
    samplePhotos: ['https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400'],
    safetyNotes: 'Very safe area. Popular with joggers and photographers.',
    crowdLevel: 'low',
    submittedBy: 'Emma L.',
    rating: 4.9,
    source: 'community'
  },
  {
    id: '4',
    name: 'Colorful Mural Wall',
    description: 'Vibrant street art perfect for colorful, artistic shots. Great for fashion and lifestyle content.',
    location: { lat: 43.6532, lng: -79.3832 },
    vibe: ['colorful', 'artistic', 'street'],
    bestTime: 'Afternoon (2-4 PM)',
    samplePhotos: ['https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400'],
    safetyNotes: 'Safe area. Popular with tourists and locals.',
    crowdLevel: 'medium',
    submittedBy: 'Alex K.',
    rating: 4.7,
    source: 'community'
  },
  {
    id: '5',
    name: 'Industrial Warehouse',
    description: 'Raw, gritty industrial space with amazing textures and lighting. Perfect for edgy photography.',
    location: { lat: 43.6532, lng: -79.3832 },
    vibe: ['industrial', 'gritty', 'edgy'],
    bestTime: 'Late Afternoon (4-6 PM)',
    samplePhotos: ['https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400'],
    safetyNotes: 'Check for security. Some areas may be restricted.',
    crowdLevel: 'low',
    submittedBy: 'David P.',
    rating: 4.5,
    source: 'community'
  }
];

// Instagram API integration example
export const getInstagramPhotoSpots = async (lat: number, lng: number, radius: number = 5000): Promise<PhotoSpot[]> => {
  try {
    // This would require Instagram Basic Display API setup
    // const response = await fetch(`${DATA_SOURCES[0].baseUrl}/me/media?fields=id,caption,media_type,media_url,location&access_token=${process.env.REACT_APP_INSTAGRAM_ACCESS_TOKEN}`);
    // const data = await response.json();
    
    // For now, return sample data
    console.log('Instagram API integration would fetch photo spots from:', { lat, lng, radius });
    return SAMPLE_PHOTO_SPOTS.filter(spot => 
      Math.abs(spot.location.lat - lat) < 0.1 && Math.abs(spot.location.lng - lng) < 0.1
    );
  } catch (error) {
    console.error('Error fetching Instagram photo spots:', error);
    return [];
  }
};

// Unsplash API integration example
export const getUnsplashPhotoSpots = async (query: string, lat: number, lng: number): Promise<PhotoSpot[]> => {
  try {
    // This would use Unsplash API to find photos by location
    // const response = await fetch(`${DATA_SOURCES[1].baseUrl}/search/photos?query=${query}&lat=${lat}&lng=${lng}&client_id=${process.env.REACT_APP_UNSPLASH_API_KEY}`);
    // const data = await response.json();
    
    console.log('Unsplash API integration would fetch photos for:', { query, lat, lng });
    return SAMPLE_PHOTO_SPOTS.filter(spot => 
      spot.vibe.some(vibe => vibe.toLowerCase().includes(query.toLowerCase()))
    );
  } catch (error) {
    console.error('Error fetching Unsplash photo spots:', error);
    return [];
  }
};

// Flickr API integration example
export const getFlickrPhotoSpots = async (lat: number, lng: number, radius: number = 5): Promise<PhotoSpot[]> => {
  try {
    // This would use Flickr API to find geotagged photos
    // const response = await fetch(`${DATA_SOURCES[2].baseUrl}?method=flickr.photos.search&api_key=${process.env.REACT_APP_FLICKR_API_KEY}&lat=${lat}&lon=${lng}&radius=${radius}&format=json&nojsoncallback=1`);
    // const data = await response.json();
    
    console.log('Flickr API integration would fetch geotagged photos from:', { lat, lng, radius });
    return SAMPLE_PHOTO_SPOTS;
  } catch (error) {
    console.error('Error fetching Flickr photo spots:', error);
    return [];
  }
};

// Google Places API integration example
export const getGooglePlacesPhotoSpots = async (lat: number, lng: number, radius: number = 5000): Promise<PhotoSpot[]> => {
  try {
    // This would use Google Places API to find aesthetic locations
    // const response = await fetch(`${DATA_SOURCES[3].baseUrl}/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=establishment&key=${process.env.REACT_APP_GOOGLE_PLACES_API_KEY}`);
    // const data = await response.json();
    
    console.log('Google Places API integration would fetch aesthetic locations from:', { lat, lng, radius });
    return SAMPLE_PHOTO_SPOTS;
  } catch (error) {
    console.error('Error fetching Google Places photo spots:', error);
    return [];
  }
};

// Foursquare API integration example
export const getFoursquarePhotoSpots = async (lat: number, lng: number, radius: number = 5000): Promise<PhotoSpot[]> => {
  try {
    // This would use Foursquare API to find unique venues
    // const response = await fetch(`${DATA_SOURCES[4].baseUrl}/places/nearby?ll=${lat},${lng}&radius=${radius}`, {
    //   headers: {
    //     'Authorization': `Bearer ${process.env.REACT_APP_FOURSQUARE_API_KEY}`
    //   }
    // });
    // const data = await response.json();
    
    console.log('Foursquare API integration would fetch unique venues from:', { lat, lng, radius });
    return SAMPLE_PHOTO_SPOTS;
  } catch (error) {
    console.error('Error fetching Foursquare photo spots:', error);
    return [];
  }
};

// Mapillary API integration
export const getMapillaryImages = async (
  lat: number,
  lng: number,
  radius: number = 100,
  limit: number = 10
): Promise<any[]> => {
  try {
    const apiKey = process.env.REACT_APP_MAPILLARY_API_KEY;
    if (!apiKey) throw new Error('Mapillary API key not set');
    // Mapillary images endpoint (v4)
    const url = `https://graph.mapillary.com/images?access_token=${apiKey}&fields=id,thumb_256_url,geometry&closeto=${lng},${lat}&radius=${radius}&limit=${limit}`;
    const response = await fetch(url);
    const data = await response.json();
    // Return array of images (id, thumb_256_url, geometry)
    return data.data || [];
  } catch (error) {
    console.error('Error fetching Mapillary images:', error);
    return [];
  }
};

// AI Vibe Classification using local CLIP backend (Flask)
// Requires: python backend running at http://localhost:5001/classify
export const classifyImageVibe = async (imageUrl: string): Promise<string[]> => {
  try {
    const response = await fetch('http://localhost:5001/classify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image_url: imageUrl })
    });
    const data = await response.json();
    return data.tags || [];
  } catch (error) {
    console.error('Error classifying image vibe:', error);
    return [];
  }
};

// Stub for generating SnapSphere tags from vibe and objects (to be implemented)
export const generateSnapSphereTags = (
  vibeLabels: string[],
  detectedObjects: string[]
): string[] => {
  // TODO: Implement tag generation logic
  return [];
};

// Main function to get photo spots from all sources
export const getAllPhotoSpots = async (
  lat: number, 
  lng: number, 
  radius: number = 5000,
  vibeFilters: string[] = []
): Promise<PhotoSpot[]> => {
  try {
    const promises = [
      getInstagramPhotoSpots(lat, lng, radius),
      getUnsplashPhotoSpots('aesthetic', lat, lng),
      getFlickrPhotoSpots(lat, lng, radius / 1000), // Flickr uses km
      getGooglePlacesPhotoSpots(lat, lng, radius),
      getFoursquarePhotoSpots(lat, lng, radius)
    ];

    const results = await Promise.allSettled(promises);
    const allSpots: PhotoSpot[] = [];

    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        allSpots.push(...result.value);
      }
    });

    // Remove duplicates based on location proximity
    const uniqueSpots = removeDuplicateSpots(allSpots);
    
    // Filter by vibe if specified
    if (vibeFilters.length > 0) {
      return uniqueSpots.filter(spot => 
        spot.vibe.some(vibe => vibeFilters.includes(vibe))
      );
    }

    return uniqueSpots;
  } catch (error) {
    console.error('Error fetching all photo spots:', error);
    return SAMPLE_PHOTO_SPOTS;
  }
};

// Helper function to remove duplicate spots based on location proximity
const removeDuplicateSpots = (spots: PhotoSpot[], proximityThreshold: number = 0.001): PhotoSpot[] => {
  const uniqueSpots: PhotoSpot[] = [];
  
  spots.forEach(spot => {
    const isDuplicate = uniqueSpots.some(existingSpot => 
      Math.abs(existingSpot.location.lat - spot.location.lat) < proximityThreshold &&
      Math.abs(existingSpot.location.lng - spot.location.lng) < proximityThreshold
    );
    
    if (!isDuplicate) {
      uniqueSpots.push(spot);
    }
  });
  
  return uniqueSpots;
};

// Function to get photo spots by vibe
export const getPhotoSpotsByVibe = async (vibe: string, lat: number, lng: number): Promise<PhotoSpot[]> => {
  const allSpots = await getAllPhotoSpots(lat, lng);
  return allSpots.filter(spot => spot.vibe.includes(vibe));
};

// Function to get trending photo spots
export const getTrendingPhotoSpots = async (lat: number, lng: number): Promise<PhotoSpot[]> => {
  const allSpots = await getAllPhotoSpots(lat, lng);
  return allSpots
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10);
};

// Function to submit a new photo spot
export const submitPhotoSpot = async (spot: Omit<PhotoSpot, 'id' | 'submittedBy' | 'rating'>): Promise<PhotoSpot> => {
  try {
    // This would send the data to your backend
    // const response = await fetch('/api/photo-spots', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(spot)
    // });
    // return await response.json();
    
    console.log('Submitting new photo spot:', spot);
    
    // For demo purposes, return a mock response
    return {
      ...spot,
      id: Date.now().toString(),
      submittedBy: 'Current User',
      rating: 0
    };
  } catch (error) {
    console.error('Error submitting photo spot:', error);
    throw error;
  }
};

// Fetch place name from Nominatim (OpenStreetMap) given lat/lng
export async function getPlaceNameFromNominatim(lat: number, lng: number): Promise<string> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`;
    const res = await fetch(url, { headers: { 'User-Agent': 'SnapSphere/1.0' } });
    const data = await res.json();
    if (data && data.display_name) {
      return data.display_name;
    }
    return 'Unknown Place';
  } catch (e) {
    return 'Unknown Place';
  }
}

// Fetch enriched place details from backend
export async function getPlaceDetails(lat: number, lng: number, photoUrl: string): Promise<{ 
  place_name: string, 
  description: string, 
  vibes: string[],
  best_time: string,
  crowd_level: string,
  safety_notes: string,
  rating: number,
  submitted_by: string,
  full_address: string
}> {
  try {
    const response = await fetch('http://localhost:5001/place_details', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ latitude: lat, longitude: lng, photo_url: photoUrl })
    });
    const data = await response.json();
    return {
      place_name: data.place_name,
      description: data.description,
      vibes: data.vibes || [],
      best_time: data.best_time,
      crowd_level: data.crowd_level,
      safety_notes: data.safety_notes,
      rating: data.rating,
      submitted_by: data.submitted_by,
      full_address: data.full_address
    };
  } catch (error) {
    console.error('Error fetching place details:', error);
    return { 
      place_name: 'Unknown Place', 
      description: '', 
      vibes: [],
      best_time: 'N/A',
      crowd_level: 'N/A',
      safety_notes: 'N/A',
      rating: 0,
      submitted_by: 'Unknown',
      full_address: 'Unknown Address'
    };
  }
}

export default {
  getAllPhotoSpots,
  getPhotoSpotsByVibe,
  getTrendingPhotoSpots,
  submitPhotoSpot,
  DATA_SOURCES
}; 