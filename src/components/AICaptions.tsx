import React, { useState, useRef } from 'react';
import { Upload, Zap, Copy, Download, RefreshCw, Camera, X, Sparkles } from 'lucide-react';
import { captionService } from '../services/featureService';

interface CaptionResult {
  caption: string;
  hashtags?: string[];
  style: string;
  mood: string;
  vibes?: string[];
  caption_id?: number;
}

const AICaptions: React.FC = () => {
  const [imageUrl, setImageUrl] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<'casual' | 'professional' | 'creative'>('casual');
  const [selectedMood, setSelectedMood] = useState<'happy' | 'moody' | 'inspiring'>('happy');
  const [result, setResult] = useState<CaptionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [recentCaptions, setRecentCaptions] = useState<CaptionResult[]>([]);
  
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

  const generateCaption = async () => {
    if (!imageUrl) return;

    try {
      setLoading(true);
      setError('');
      
      console.log('Generating caption...');
      console.log('Image URL:', imageUrl);
      console.log('Style:', selectedStyle);
      console.log('Mood:', selectedMood);
      
      const result = await captionService.generateCaption({
        image_url: imageUrl,
        style: selectedStyle,
        mood: selectedMood
      });
      
      console.log('Caption generation result:', result);
      setResult(result);
      setRecentCaptions(prev => [result, ...prev.slice(0, 4)]);
    } catch (err: any) {
      console.error('Error details:', err);
      setError(err.message || 'Failed to generate caption');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const getStyleIcon = (style: string) => {
    switch (style) {
      case 'casual': return '😊';
      case 'professional': return '💼';
      case 'creative': return '✨';
      default: return '📝';
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood) {
      case 'happy': return 'text-yellow-600';
      case 'moody': return 'text-blue-600';
      case 'inspiring': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto h-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Caption Generator</h1>
        <p className="text-gray-600">Generate AI-powered captions based on location and mood</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-200px)]">
        {/* Image Upload & Settings */}
        <div className="space-y-6 overflow-y-auto">
          {/* Image Upload */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
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
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Camera className="w-10 h-10 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Image Selected</h3>
                <p className="text-gray-600 mb-6">Upload an image to generate captions</p>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  Upload Image
                </button>
              </div>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Style & Mood Settings */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Caption Style</h2>
            
            {/* Style Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Writing Style</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'casual', label: 'Casual', icon: '😊', desc: 'Fun & relaxed' },
                  { value: 'professional', label: 'Professional', icon: '💼', desc: 'Formal & polished' },
                  { value: 'creative', label: 'Creative', icon: '✨', desc: 'Artistic & unique' }
                ].map((style) => (
                  <button
                    key={style.value}
                    onClick={() => setSelectedStyle(style.value as any)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      selectedStyle === style.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">{style.icon}</div>
                    <div className="font-semibold text-gray-900">{style.label}</div>
                    <div className="text-xs text-gray-600">{style.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Mood Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Mood</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: 'happy', label: 'Happy', icon: '😊', color: 'text-yellow-600' },
                  { value: 'moody', label: 'Moody', icon: '😔', color: 'text-blue-600' },
                  { value: 'inspiring', label: 'Inspiring', icon: '🌟', color: 'text-purple-600' }
                ].map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => setSelectedMood(mood.value as any)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      selectedMood === mood.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">{mood.icon}</div>
                    <div className="font-semibold text-gray-900">{mood.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={generateCaption}
              disabled={loading || !imageUrl}
              className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  <span>Generate Caption</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="space-y-6 overflow-y-auto">
          {result && result.caption ? (
            <>
              {/* Generated Caption */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900">Generated Caption</h2>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{getStyleIcon(result.style)}</span>
                    <span className={`text-sm font-medium ${getMoodColor(result.mood)}`}>
                      {result.mood}
                    </span>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 mb-4">
                  <p className="text-lg text-gray-900 leading-relaxed">{result.caption}</p>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => copyToClipboard(result.caption)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <Copy className="w-4 h-4" />
                    <span>{copied ? 'Copied!' : 'Copy Caption'}</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                    <Download className="w-4 h-4" />
                    <span>Export</span>
                  </button>
                </div>
              </div>

              {/* Hashtags */}
              {(result.hashtags && result.hashtags.length > 0) && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Suggested Hashtags</h2>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(result.hashtags || []).map((hashtag, index) => (
                      <span
                        key={index}
                        className="px-3 py-2 bg-gradient-to-r from-primary-100 to-purple-100 text-primary-700 rounded-lg text-sm font-medium cursor-pointer hover:bg-primary-200 transition-colors"
                        onClick={() => copyToClipboard(hashtag)}
                      >
                        {hashtag}
                      </span>
                    ))}
                  </div>
                  <button
                    onClick={() => copyToClipboard((result.hashtags || []).join(' '))}
                    className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy All Hashtags</span>
                  </button>
                </div>
              )}

              {/* Detected Vibes */}
              {(result.vibes && result.vibes.length > 0) && (
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">Detected Vibes</h2>
                  <div className="flex flex-wrap gap-2">
                    {(result.vibes || []).map((vibe, index) => (
                      <span
                        key={index}
                        className="px-3 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-lg text-sm font-medium"
                      >
                        {vibe}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Generate</h2>
              <p className="text-lg text-gray-600 mb-6">Upload an image and select your style to generate the perfect caption</p>
              <div className="bg-gray-50 rounded-xl p-6 max-w-lg mx-auto">
                <p className="text-sm text-gray-500">Our AI will analyze your image and create engaging captions that match your chosen style and mood.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Captions */}
      {recentCaptions.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Captions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentCaptions.map((caption, index) => (
              <div
                key={caption.caption_id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setResult(caption)}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-500">Caption #{index + 1}</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-lg">{getStyleIcon(caption.style)}</span>
                    <span className={`text-xs font-medium ${getMoodColor(caption.mood)}`}>
                      {caption.mood}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-700 line-clamp-3 mb-3">{caption.caption}</p>
                <div className="flex flex-wrap gap-1">
                  {(caption.hashtags || []).slice(0, 3).map((hashtag, hashtagIndex) => (
                    <span
                      key={hashtagIndex}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                    >
                      {hashtag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
              <div className="w-20 h-20 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Upload className="w-10 h-10 text-indigo-600" />
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

export default AICaptions; 