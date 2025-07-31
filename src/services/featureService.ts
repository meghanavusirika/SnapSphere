const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

// Moodboard API calls
export const moodboardService = {
  async getMoodboards() {
    // Return sample moodboards for demo
    return {
      moodboards: [
        {
          id: 1,
          name: 'Nature Vibes',
          description: 'A collection of natural landscapes and outdoor photography',
          theme: 'nature',
          is_public: true,
          created_at: '2024-01-15T10:30:00Z',
          updated_at: '2024-01-15T10:30:00Z',
          item_count: 3
        },
        {
          id: 2,
          name: 'Urban Photography',
          description: 'Cityscapes and urban architecture',
          theme: 'urban',
          is_public: true,
          created_at: '2024-01-16T14:20:00Z',
          updated_at: '2024-01-16T14:20:00Z',
          item_count: 2
        },
        {
          id: 3,
          name: 'Vintage Aesthetic',
          description: 'Retro and nostalgic photo collections',
          theme: 'vintage',
          is_public: true,
          created_at: '2024-01-17T09:15:00Z',
          updated_at: '2024-01-17T09:15:00Z',
          item_count: 4
        }
      ]
    };
  },

  async createMoodboard(data: {
    name: string;
    description?: string;
    theme?: string;
    is_public?: boolean;
  }) {
    // Simulate creating a moodboard
    return {
      id: Math.floor(Math.random() * 1000) + 4,
      name: data.name,
      description: data.description || '',
      theme: data.theme || '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_public: data.is_public || false,
      item_count: 0
    };
  },

  async getMoodboard(id: number) {
    // For existing sample moodboards (1, 2, 3), return sample data
    if (id <= 3) {
      const sampleItems = [
        {
          id: 1,
          image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
          caption: 'Peaceful pier view',
          vibes: ['nature', 'peaceful', 'calm'],
          position_x: 100,
          position_y: 50,
          width: 200,
          height: 150,
          created_at: '2024-01-15T10:30:00Z'
        },
        {
          id: 2,
          image_url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400',
          caption: 'Urban cityscape',
          vibes: ['urban', 'modern', 'city'],
          position_x: 350,
          position_y: 100,
          width: 180,
          height: 120,
          created_at: '2024-01-15T11:00:00Z'
        }
      ];

      return {
        id: id,
        name: id === 1 ? 'Nature Vibes' : id === 2 ? 'Urban Photography' : 'Vintage Aesthetic',
        description: id === 1 ? 'A collection of natural landscapes and outdoor photography' : 
                    id === 2 ? 'Cityscapes and urban architecture' : 'Retro and nostalgic photo collections',
        theme: id === 1 ? 'nature' : id === 2 ? 'urban' : 'vintage',
        created_at: '2024-01-15T10:30:00Z',
        updated_at: '2024-01-15T10:30:00Z',
        is_public: true,
        items: sampleItems
      };
    }
    
    // For new moodboards (id > 3), return empty moodboard
    return {
      id: id,
      name: `Moodboard ${id}`,
      description: '',
      theme: '',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_public: false,
      items: []
    };
  },

  async addMoodboardItem(moodboardId: number, data: {
    image_url: string;
    caption?: string;
    vibes?: string[];
    position_x?: number;
    position_y?: number;
    width?: number;
    height?: number;
  }) {
    // Simulate adding an item
    return {
      id: Math.floor(Math.random() * 1000) + 10,
      image_url: data.image_url,
      caption: data.caption || '',
      vibes: data.vibes || [],
      position_x: data.position_x || 0,
      position_y: data.position_y || 0,
      width: data.width || 200,
      height: data.height || 200,
      created_at: new Date().toISOString()
    };
  }
};

// AI Vibe Classification API calls
export const vibeAnalysisService = {
  async analyzeVibe(imageUrl: string) {
    const response = await fetch(`${API_BASE_URL}/analyze_vibe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ image_url: imageUrl })
    });
    if (!response.ok) throw new Error('Failed to analyze vibe');
    return response.json();
  }
};

// AI Captions API calls
export const captionService = {
  async generateCaption(data: {
    image_url: string;
    style?: 'casual' | 'professional' | 'creative';
    mood?: 'happy' | 'moody' | 'inspiring';
  }) {
    const response = await fetch(`${API_BASE_URL}/generate_caption`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to generate caption');
    return response.json();
  }
};

// Smart Recommendations API calls
export const recommendationService = {
  async getSmartRecommendations(data: {
    latitude: number;
    longitude: number;
    weather?: string;
    time_of_day?: string;
    preferences?: any;
  }) {
    const response = await fetch(`${API_BASE_URL}/smart_recommendations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to get recommendations');
    return response.json();
  }
}; 