import React, { useState, useRef } from 'react';
import { Upload, Sparkles, Palette, TrendingUp, Camera, X, Download, Share2, RefreshCw } from 'lucide-react';
import { vibeAnalysisService } from '../services/featureService';

interface VibeAnalysis {
  primary_vibe: string;
  secondary_vibes: string[];
  confidence_score: number;
  color_palette: string[];
  mood_score: number;
  style_tags: string[];
  analysis_id: number;
}

const AIVibeClassification: React.FC = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [analysis, setAnalysis] = useState<VibeAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [recentAnalyses, setRecentAnalyses] = useState<VibeAnalysis[]>([
    {
      analysis_id: 1,
      primary_vibe: 'Nature',
      secondary_vibes: ['Peaceful', 'Calm', 'Organic'],
      confidence_score: 0.87,
      color_palette: ['#2d5016', '#4a7c59', '#8fbc8f', '#98fb98', '#f0fff0'],
      mood_score: 0.72,
      style_tags: ['natural', 'organic', 'serene']
    },
    {
      analysis_id: 2,
      primary_vibe: 'Urban',
      secondary_vibes: ['Modern', 'Dynamic', 'Architectural'],
      confidence_score: 0.91,
      color_palette: ['#2c3e50', '#34495e', '#7f8c8d', '#bdc3c7', '#ecf0f1'],
      mood_score: 0.65,
      style_tags: ['modern', 'geometric', 'industrial']
    },
    {
      analysis_id: 3,
      primary_vibe: 'Vintage',
      secondary_vibes: ['Retro', 'Nostalgic', 'Classic'],
      confidence_score: 0.78,
      color_palette: ['#8b4513', '#d2691e', '#daa520', '#f4a460', '#deb887'],
      mood_score: 0.58,
      style_tags: ['retro', 'classic', 'timeless']
    },
    {
      analysis_id: 4,
      primary_vibe: 'Colorful',
      secondary_vibes: ['Vibrant', 'Energetic', 'Playful'],
      confidence_score: 0.94,
      color_palette: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'],
      mood_score: 0.89,
      style_tags: ['vibrant', 'energetic', 'playful']
    }
  ]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImageUrl(result);
        setShowUploadModal(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUrlInput = (url: string) => {
    setImageUrl(url);
    setShowUploadModal(false);
  };

  const analyzeImage = async () => {
    if (!imageUrl) return;

    try {
      setLoading(true);
      setError('');
      
      console.log('Analyzing image...');
      console.log('Image URL:', imageUrl);
      
      const result = await vibeAnalysisService.analyzeVibe(imageUrl);
      
      console.log('Vibe analysis result:', result);
      setAnalysis(result);
      setRecentAnalyses(prev => [result, ...prev.slice(0, 4)]);
    } catch (err: any) {
      console.error('Error details:', err);
      setError(err.message || 'Failed to analyze image');
    } finally {
      setLoading(false);
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 0.8) return 'bg-green-100 text-green-800';
    if (score >= 0.6) return 'bg-blue-100 text-blue-800';
    if (score >= 0.4) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getMoodEmoji = (score: number) => {
    if (score >= 0.8) return '😊';
    if (score >= 0.6) return '😐';
    return '😔';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto h-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Vibe Detection</h1>
        <p className="text-gray-600">Smart AI analyzes and classifies photo styles with detailed insights</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Image Upload Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Upload Image</h2>
              <button
                onClick={() => setShowUploadModal(true)}
                className="p-2 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                <Upload className="w-5 h-5" />
              </button>
            </div>

            {imageUrl ? (
              <div className="space-y-4">
                <div className="relative rounded-lg overflow-hidden">
                  <img
                    src={imageUrl}
                    alt="Uploaded image"
                    className="w-full h-64 object-cover"
                  />
                  <button
                    onClick={() => setImageUrl('')}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-gray-50"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
                
                <button
                  onClick={analyzeImage}
                  disabled={loading}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Analyze Vibe</span>
                    </>
                  )}
                </button>

                {/* Recent Analyses - Simple Design */}
                <div className="mt-6">
                  <div className="max-w-2xl mx-auto">
                    <h2 className="text-lg font-semibold text-gray-700 mb-3 text-center">Recent Analyses</h2>
                    <div className="space-y-3">
                      {/* Sample Card 1 */}
                      <div className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-600">Nature</span>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">87%</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Peaceful</span>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Calm</span>
                        </div>
                        <div className="flex space-x-2">
                          <div className="w-3 h-3 bg-green-600 rounded"></div>
                          <div className="w-3 h-3 bg-blue-500 rounded"></div>
                          <div className="w-3 h-3 bg-yellow-400 rounded"></div>
                        </div>
                      </div>

                      {/* Sample Card 2 */}
                      <div className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-600">Urban</span>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">91%</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Modern</span>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Dynamic</span>
                        </div>
                        <div className="flex space-x-2">
                          <div className="w-3 h-3 bg-gray-600 rounded"></div>
                          <div className="w-3 h-3 bg-blue-400 rounded"></div>
                          <div className="w-3 h-3 bg-slate-300 rounded"></div>
                        </div>
                      </div>

                      {/* Sample Card 3 */}
                      <div className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-600">Vintage</span>
                          <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">78%</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Retro</span>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Classic</span>
                        </div>
                        <div className="flex space-x-2">
                          <div className="w-3 h-3 bg-amber-600 rounded"></div>
                          <div className="w-3 h-3 bg-orange-400 rounded"></div>
                          <div className="w-3 h-3 bg-yellow-300 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Camera className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Image Selected</h3>
                <p className="text-gray-600 mb-6">Upload an image to start analyzing its vibe</p>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  Upload Image
                </button>

                {/* Recent Analyses - Simple Design */}
                <div className="mt-8">
                  <div className="max-w-2xl mx-auto">
                    <h2 className="text-lg font-semibold text-gray-700 mb-3 text-center">Recent Analyses</h2>
                    <div className="space-y-3">
                      {/* Sample Card 1 */}
                      <div className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-600">Nature</span>
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">87%</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Peaceful</span>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Calm</span>
                        </div>
                        <div className="flex space-x-2">
                          <div className="w-3 h-3 bg-green-600 rounded"></div>
                          <div className="w-3 h-3 bg-blue-500 rounded"></div>
                          <div className="w-3 h-3 bg-yellow-400 rounded"></div>
                        </div>
                      </div>

                      {/* Sample Card 2 */}
                      <div className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-600">Urban</span>
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">91%</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Modern</span>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Dynamic</span>
                        </div>
                        <div className="flex space-x-2">
                          <div className="w-3 h-3 bg-gray-600 rounded"></div>
                          <div className="w-3 h-3 bg-blue-400 rounded"></div>
                          <div className="w-3 h-3 bg-slate-300 rounded"></div>
                        </div>
                      </div>

                      {/* Sample Card 3 */}
                      <div className="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-600">Vintage</span>
                          <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded-full">78%</span>
                        </div>
                        <div className="flex flex-wrap gap-1 mb-2">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Retro</span>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Classic</span>
                        </div>
                        <div className="flex space-x-2">
                          <div className="w-3 h-3 bg-amber-600 rounded"></div>
                          <div className="w-3 h-3 bg-orange-400 rounded"></div>
                          <div className="w-3 h-3 bg-yellow-300 rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Analysis Results */}
        <div className="lg:col-span-2">
          <div className="h-full overflow-y-auto">
            {analysis ? (
              <div className="space-y-6">
                {/* Primary Vibe */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-gray-900">Primary Vibe</h2>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${getConfidenceColor(analysis.confidence_score)}`}>
                      {Math.round(analysis.confidence_score * 100)}% confidence
                    </div>
                  </div>
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">✨</div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-2 capitalize">
                      {analysis.primary_vibe}
                    </h3>
                    <p className="text-gray-600">This is the dominant aesthetic vibe detected in your image</p>
                  </div>
                </div>

                {/* Secondary Vibes */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Secondary Vibes</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {analysis.secondary_vibes.map((vibe, index) => (
                      <div
                        key={index}
                        className="p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg text-center"
                      >
                        <span className="text-sm font-medium text-gray-700 capitalize">{vibe}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Color Palette */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Palette className="w-5 h-5 text-gray-600" />
                    <h2 className="text-xl font-bold text-gray-900">Color Palette</h2>
                  </div>
                  <div className="flex space-x-3">
                    {analysis.color_palette.map((color, index) => (
                      <div key={index} className="flex flex-col items-center space-y-2">
                        <div
                          className="w-12 h-12 rounded-lg shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                        <span className="text-xs text-gray-600 font-mono">{color}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mood & Style */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <TrendingUp className="w-5 h-5 text-gray-600" />
                      <h2 className="text-xl font-bold text-gray-900">Mood Score</h2>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl mb-2">{getMoodEmoji(analysis.mood_score)}</div>
                      <div className="text-2xl font-bold text-gray-900 mb-2">
                        {Math.round(analysis.mood_score * 100)}%
                      </div>
                      <p className="text-gray-600">Overall mood intensity</p>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Style Tags</h2>
                    <div className="flex flex-wrap gap-2">
                      {analysis.style_tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gradient-to-r from-primary-100 to-purple-100 text-primary-700 rounded-full text-sm font-medium"
                        >
                          {tag.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Actions</h2>
                  <div className="flex space-x-3">
                    <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity">
                      <Download className="w-4 h-4" />
                      <span>Export Analysis</span>
                    </button>
                    <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                      <Share2 className="w-4 h-4" />
                      <span>Share Results</span>
                    </button>
                  </div>
                </div>


              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Sparkles className="w-10 h-10 text-blue-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Analyze</h2>
                <p className="text-lg text-gray-600 mb-6">Upload an image to get started with AI vibe classification</p>
                <div className="bg-gray-50 rounded-xl p-6 max-w-lg mx-auto">
                  <p className="text-sm text-gray-500">Our AI will analyze your image and provide detailed insights about its aesthetic vibes, color palette, mood, and style characteristics.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <UploadModal
          onClose={() => setShowUploadModal(false)}
          onFileUpload={handleImageUpload}
          onUrlInput={handleUrlInput}
          fileInputRef={fileInputRef}
        />
      )}
    </div>
  );
};

interface UploadModalProps {
  onClose: () => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUrlInput: (url: string) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const UploadModal: React.FC<UploadModalProps> = ({ onClose, onFileUpload, onUrlInput, fileInputRef }) => {
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('file');
  const [url, setUrl] = useState('');

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onUrlInput(url.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Upload Image</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Upload Method Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setUploadMethod('file')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                uploadMethod === 'file'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              File Upload
            </button>
            <button
              onClick={() => setUploadMethod('url')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                uploadMethod === 'url'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              URL Input
            </button>
          </div>

          {/* File Upload */}
          {uploadMethod === 'file' && (
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Upload className="w-10 h-10 text-blue-600" />
              </div>
              <p className="text-gray-600 mb-4">Click to select an image file</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-6 py-3 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                Choose File
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={onFileUpload}
                className="hidden"
              />
            </div>
          )}

          {/* URL Input */}
          {uploadMethod === 'url' && (
            <form onSubmit={handleUrlSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={!url.trim()}
                className="w-full px-4 py-3 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                Use URL
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIVibeClassification; 