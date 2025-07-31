import React, { useState, useEffect } from 'react';
import { Camera, Upload, MapPin, Clock, Star, Users, Shield, Heart, Share2, Download, Filter, Search } from 'lucide-react';

interface UserPhoto {
  id: number;
  title: string;
  description: string;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  image_url: string;
  submitted_by: string;
  submitted_date: string;
  vibes: string[];
  best_time: string;
  crowd_level: 'low' | 'medium' | 'high';
  safety_notes: string;
  rating: number;
  likes: number;
  sample_photos: string[];
  tips: string[];
}

const UserSubmittedPhotos: React.FC = () => {
  const [photos, setPhotos] = useState<UserPhoto[]>([]);
  const [filteredPhotos, setFilteredPhotos] = useState<UserPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<UserPhoto | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVibe, setSelectedVibe] = useState<string>('');
  const [selectedCrowdLevel, setSelectedCrowdLevel] = useState<string>('');

  // Sample data for demonstration
  useEffect(() => {
    const samplePhotos: UserPhoto[] = [
      {
        id: 1,
        title: "Sunset at Central Park Lake",
        description: "Perfect spot for golden hour photography with stunning reflections",
        location: {
          lat: 40.7829,
          lng: -73.9654,
          address: "Central Park Lake, New York, NY"
        },
        image_url: "https://media.istockphoto.com/id/144724298/photo/the-lake-in-central-park.jpg?s=612x612&w=0&k=20&c=pXkBrkqs9DIIzEIFOAFT4KuXcxAyphOiH9z2qqQeO-E=",
        submitted_by: "Sarah M.",
        submitted_date: "2024-01-15",
        vibes: ["nature", "peaceful", "romantic"],
        best_time: "golden_hour",
        crowd_level: "medium",
        safety_notes: "Well-lit area, generally safe. Watch for cyclists on nearby paths.",
        rating: 4.8,
        likes: 127,
        sample_photos: [
          "https://media.istockphoto.com/id/144724298/photo/the-lake-in-central-park.jpg?s=612x612&w=0&k=20&c=pXkBrkqs9DIIzEIFOAFT4KuXcxAyphOiH9z2qqQeO-E=",
          "https://media.istockphoto.com/id/144724298/photo/the-lake-in-central-park.jpg?s=612x612&w=0&k=20&c=pXkBrkqs9DIIzEIFOAFT4KuXcxAyphOiH9z2qqQeO-E="
        ],
        tips: [
          "Best light 30 minutes before sunset",
          "Bring a tripod for long exposures",
          "Weekdays are less crowded"
        ]
      },
      {
        id: 2,
        title: "Brooklyn Bridge Urban Vibe",
        description: "Iconic bridge with stunning city views and industrial aesthetics",
        location: {
          lat: 40.7061,
          lng: -73.9969,
          address: "Brooklyn Bridge, New York, NY"
        },
        image_url: "https://www.readyforboardingblog.com/wp-content/uploads/2023/09/brooklyn-nowy-jork-19-202309-readyforboarding_pl.jpg",
        submitted_by: "Mike R.",
        submitted_date: "2024-01-12",
        vibes: ["urban", "modern", "iconic"],
        best_time: "blue_hour",
        crowd_level: "high",
        safety_notes: "Busy area, be mindful of pedestrians. Watch for traffic.",
        rating: 4.6,
        likes: 89,
        sample_photos: [
          "https://www.readyforboardingblog.com/wp-content/uploads/2023/09/brooklyn-nowy-jork-19-202309-readyforboarding_pl.jpg",
          "https://www.readyforboardingblog.com/wp-content/uploads/2023/09/brooklyn-nowy-jork-19-202309-readyforboarding_pl.jpg"
        ],
        tips: [
          "Blue hour provides dramatic lighting",
          "Use wide angle for bridge shots",
          "Early morning for fewer crowds"
        ]
      },
      {
        id: 3,
        title: "Hidden Garden Oasis",
        description: "Secret garden spot perfect for intimate portraits and nature shots",
        location: {
          lat: 40.7589,
          lng: -73.9851,
          address: "Bryant Park, New York, NY"
        },
        image_url: "https://st.houzz.com/simgs/a261f9860d06a96f_8-1000/rustic-landscape.jpg",
        submitted_by: "Emma L.",
        submitted_date: "2024-01-10",
        vibes: ["nature", "peaceful", "vintage"],
        best_time: "daylight",
        crowd_level: "low",
        safety_notes: "Quiet area, well-maintained paths. Perfect for peaceful photography.",
        rating: 4.9,
        likes: 203,
        sample_photos: [
          "https://st.houzz.com/simgs/a261f9860d06a96f_8-1000/rustic-landscape.jpg",
          "https://st.houzz.com/simgs/a261f9860d06a96f_8-1000/rustic-landscape.jpg"
        ],
        tips: [
          "Spring and fall offer best colors",
          "Early morning for soft light",
          "Bring macro lens for detail shots"
        ]
      }
    ];
    
    setPhotos(samplePhotos);
    setFilteredPhotos(samplePhotos);
  }, []);

  // Filter photos based on search and filters
  useEffect(() => {
    let filtered = photos;
    
    if (searchTerm) {
      filtered = filtered.filter(photo => 
        photo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        photo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        photo.location.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedVibe) {
      filtered = filtered.filter(photo => 
        photo.vibes.includes(selectedVibe)
      );
    }
    
    if (selectedCrowdLevel) {
      filtered = filtered.filter(photo => 
        photo.crowd_level === selectedCrowdLevel
      );
    }
    
    setFilteredPhotos(filtered);
  }, [photos, searchTerm, selectedVibe, selectedCrowdLevel]);

  const getCrowdLevelColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getBestTimeIcon = (time: string) => {
    switch (time) {
      case 'golden_hour': return '🌅';
      case 'blue_hour': return '🌆';
      case 'daylight': return '☀️';
      default: return '📷';
    }
  };

  const getVibeColor = (vibe: string) => {
    const colors = {
      nature: 'bg-green-100 text-green-800',
      peaceful: 'bg-blue-100 text-blue-800',
      romantic: 'bg-pink-100 text-pink-800',
      urban: 'bg-gray-100 text-gray-800',
      modern: 'bg-purple-100 text-purple-800',
      iconic: 'bg-orange-100 text-orange-800',
      vintage: 'bg-amber-100 text-amber-800'
    };
    return colors[vibe as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto h-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Photo Spots</h1>
        <p className="text-gray-600">Community-driven photo spots with sample shots, timing tips, and safety notes</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search photos, locations, or descriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Vibe Filter */}
          <div>
            <select
              value={selectedVibe}
              onChange={(e) => setSelectedVibe(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Vibes</option>
              <option value="nature">Nature</option>
              <option value="peaceful">Peaceful</option>
              <option value="romantic">Romantic</option>
              <option value="urban">Urban</option>
              <option value="modern">Modern</option>
              <option value="iconic">Iconic</option>
              <option value="vintage">Vintage</option>
            </select>
          </div>

          {/* Crowd Level Filter */}
          <div>
            <select
              value={selectedCrowdLevel}
              onChange={(e) => setSelectedCrowdLevel(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">All Crowd Levels</option>
              <option value="low">Low Crowd</option>
              <option value="medium">Medium Crowd</option>
              <option value="high">High Crowd</option>
            </select>
          </div>
        </div>
      </div>

      {/* Upload Button */}
      <div className="mb-6">
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
        >
          <Upload className="w-5 h-5" />
          <span>Submit Your Photo Spot</span>
        </button>
      </div>

      {/* Photos Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPhotos.map((photo) => (
          <div
            key={photo.id}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedPhoto(photo)}
          >
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={photo.image_url}
                alt={photo.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 flex items-center space-x-1 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-sm">
                <Star className="w-4 h-4 fill-current" />
                <span>{photo.rating}</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <h3 className="font-bold text-gray-900 mb-2">{photo.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{photo.description}</p>
              
              {/* Location */}
              <div className="flex items-center space-x-2 mb-3">
                <MapPin className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">{photo.location.address}</span>
              </div>

              {/* Vibes */}
              <div className="flex flex-wrap gap-1 mb-3">
                {photo.vibes.slice(0, 3).map((vibe, index) => (
                  <span
                    key={index}
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getVibeColor(vibe)}`}
                  >
                    {vibe}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{getBestTimeIcon(photo.best_time)}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span className={`px-2 py-1 rounded-full text-xs ${getCrowdLevelColor(photo.crowd_level)}`}>
                      {photo.crowd_level}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Heart className="w-4 h-4" />
                  <span>{photo.likes}</span>
                </div>
              </div>

              {/* Submitted by */}
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">By {photo.submitted_by}</span>
                  <span className="text-xs text-gray-500">{photo.submitted_date}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredPhotos.length === 0 && (
        <div className="text-center py-12">
          <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No photos found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Photo Detail Modal */}
      {selectedPhoto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">{selectedPhoto.title}</h2>
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Main Image */}
                <div>
                  <img
                    src={selectedPhoto.image_url}
                    alt={selectedPhoto.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <p className="text-gray-600">{selectedPhoto.description}</p>
                  
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{selectedPhoto.location.address}</span>
                  </div>

                  {/* Vibes */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Vibes</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPhoto.vibes.map((vibe, index) => (
                        <span
                          key={index}
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getVibeColor(vibe)}`}
                        >
                          {vibe}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Tips */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Photography Tips</h4>
                    <ul className="space-y-1">
                      {selectedPhoto.tips.map((tip, index) => (
                        <li key={index} className="text-sm text-gray-600 flex items-start space-x-2">
                          <span className="text-primary-500 mt-1">•</span>
                          <span>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Safety Notes */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Safety Notes</h4>
                    <p className="text-sm text-gray-600">{selectedPhoto.safety_notes}</p>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>{selectedPhoto.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4 text-red-500" />
                      <span>{selectedPhoto.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4 text-blue-500" />
                      <span className={`px-2 py-1 rounded-full text-xs ${getCrowdLevelColor(selectedPhoto.crowd_level)}`}>
                        {selectedPhoto.crowd_level} crowd
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 mt-6 pt-6 border-t border-gray-100">
                <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity">
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
                <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Save</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <PhotoSubmissionForm onClose={() => setShowUploadModal(false)} onSuccess={(newPhoto) => {
              setPhotos(prev => [newPhoto, ...prev]);
              setFilteredPhotos(prev => [newPhoto, ...prev]);
              setShowUploadModal(false);
            }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSubmittedPhotos;

// Photo Submission Form Component
interface PhotoSubmissionFormProps {
  onClose: () => void;
  onSuccess: (photo: UserPhoto) => void;
}

const PhotoSubmissionForm: React.FC<PhotoSubmissionFormProps> = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: {
      lat: 0,
      lng: 0,
      address: ''
    },
    image_url: '',
    vibes: [] as string[],
    best_time: 'golden_hour',
    crowd_level: 'medium' as 'low' | 'medium' | 'high',
    safety_notes: '',
    tips: [''] as string[]
  });
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedImage, setUploadedImage] = useState<string>('');

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLocationChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [field]: value
      }
    }));
  };

  const handleVibeToggle = (vibe: string) => {
    setFormData(prev => ({
      ...prev,
      vibes: prev.vibes.includes(vibe)
        ? prev.vibes.filter(v => v !== vibe)
        : [...prev.vibes, vibe]
    }));
  };

  const handleTipChange = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      tips: prev.tips.map((tip, i) => i === index ? value : tip)
    }));
  };

  const addTip = () => {
    setFormData(prev => ({
      ...prev,
      tips: [...prev.tips, '']
    }));
  };

  const removeTip = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tips: prev.tips.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setUploadedImage(result);
        handleInputChange('image_url', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !formData.image_url) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newPhoto: UserPhoto = {
        id: Date.now(),
        title: formData.title,
        description: formData.description,
        location: formData.location,
        image_url: formData.image_url,
        submitted_by: "You",
        submitted_date: new Date().toISOString().split('T')[0],
        vibes: formData.vibes,
        best_time: formData.best_time,
        crowd_level: formData.crowd_level,
        safety_notes: formData.safety_notes,
        rating: 5.0,
        likes: 0,
        sample_photos: [formData.image_url],
        tips: formData.tips.filter(tip => tip.trim() !== '')
      };
      
      onSuccess(newPhoto);
      setLoading(false);
    }, 1000);
  };

  const availableVibes = [
    'nature', 'peaceful', 'romantic', 'urban', 'modern', 'iconic', 'vintage'
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Submit Your Photo Spot</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
          <span className="text-2xl">×</span>
        </button>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-6">
        {[1, 2, 3].map((step) => (
          <div key={step} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep >= step 
                ? 'bg-primary-500 text-white' 
                : 'bg-gray-200 text-gray-600'
            }`}>
              {step}
            </div>
            {step < 3 && (
              <div className={`w-16 h-1 mx-2 ${
                currentStep > step ? 'bg-primary-500' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Basic Info */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photo Spot Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g., Sunset at Central Park Lake"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe what makes this spot special for photography..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location Address *
            </label>
            <input
              type="text"
              value={formData.location.address}
              onChange={(e) => handleLocationChange('address', e.target.value)}
              placeholder="e.g., Central Park Lake, New York, NY"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="flex space-x-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                value={formData.location.lat}
                onChange={(e) => handleLocationChange('lat', parseFloat(e.target.value))}
                placeholder="40.7829"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                value={formData.location.lng}
                onChange={(e) => handleLocationChange('lng', parseFloat(e.target.value))}
                placeholder="-73.9654"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={() => setCurrentStep(2)}
              disabled={!formData.title || !formData.description || !formData.location.address}
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Image and Vibes */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Photo *
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {uploadedImage ? (
                <div className="space-y-4">
                  <img
                    src={uploadedImage}
                    alt="Uploaded"
                    className="w-full h-48 object-cover rounded-lg mx-auto"
                  />
                  <button
                    onClick={() => document.getElementById('image-upload')?.click()}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Change Photo
                  </button>
                </div>
              ) : (
                <div>
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">Click to upload a photo of your spot</p>
                  <button
                    onClick={() => document.getElementById('image-upload')?.click()}
                    className="px-6 py-3 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Choose Photo
                  </button>
                </div>
              )}
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Vibes (Select all that apply)
            </label>
            <div className="grid grid-cols-2 gap-3">
              {availableVibes.map((vibe) => (
                <button
                  key={vibe}
                  onClick={() => handleVibeToggle(vibe)}
                  className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                    formData.vibes.includes(vibe)
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium text-gray-900 capitalize">{vibe}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Best Time to Shoot
              </label>
              <select
                value={formData.best_time}
                onChange={(e) => handleInputChange('best_time', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="golden_hour">Golden Hour</option>
                <option value="blue_hour">Blue Hour</option>
                <option value="daylight">Daylight</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Crowd Level
              </label>
              <select
                value={formData.crowd_level}
                onChange={(e) => handleInputChange('crowd_level', e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={() => setCurrentStep(3)}
              disabled={!formData.image_url || formData.vibes.length === 0}
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Tips and Safety */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photography Tips
            </label>
            {formData.tips.map((tip, index) => (
              <div key={index} className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={tip}
                  onChange={(e) => handleTipChange(index, e.target.value)}
                  placeholder="e.g., Best light 30 minutes before sunset"
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
                {formData.tips.length > 1 && (
                  <button
                    onClick={() => removeTip(index)}
                    className="px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              onClick={addTip}
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              + Add another tip
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Safety Notes
            </label>
            <textarea
              value={formData.safety_notes}
              onChange={(e) => handleInputChange('safety_notes', e.target.value)}
              placeholder="Any safety considerations or important notes for photographers..."
              rows={3}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Photo Spot'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}; 