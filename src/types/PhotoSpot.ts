export interface PhotoSpot {
  id: string;
  name: string;
  description: string;
  location: {
    lat: number;
    lng: number;
  };
  vibe: string[];
  bestTime: string;
  samplePhotos: string[];
  safetyNotes: string;
  crowdLevel: 'low' | 'medium' | 'high';
  submittedBy: string;
  rating: number;
  imageUrl?: string;
  source: 'unsplash' | 'flickr' | 'instagram' | 'community';
} 