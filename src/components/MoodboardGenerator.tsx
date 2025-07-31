import React, { useState, useEffect, useRef } from 'react';
import { Plus, Upload, Palette, Save, Trash2, Edit3, Eye, EyeOff, X, Move } from 'lucide-react';
import { moodboardService } from '../services/featureService';

interface MoodboardItem {
  id: number;
  image_url: string;
  caption?: string;
  vibes: string[];
  position_x: number;
  position_y: number;
  width: number;
  height: number;
  created_at: string;
}

interface Moodboard {
  id: number;
  name: string;
  description?: string;
  theme?: string;
  created_at: string;
  updated_at: string;
  is_public: boolean;
  item_count: number;
}

const MoodboardGenerator: React.FC = () => {
  const [moodboards, setMoodboards] = useState<Moodboard[]>([]);
  const [selectedMoodboard, setSelectedMoodboard] = useState<Moodboard | null>(null);
  const [currentItems, setCurrentItems] = useState<MoodboardItem[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [draggedItem, setDraggedItem] = useState<MoodboardItem | null>(null);
  const [editingItem, setEditingItem] = useState<MoodboardItem | null>(null);
  
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadMoodboards();
  }, []);

  const loadMoodboards = async () => {
    try {
      setLoading(true);
      const response = await moodboardService.getMoodboards();
      setMoodboards(response.moodboards);
    } catch (error) {
      console.error('Failed to load moodboards:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMoodboardItems = async (moodboardId: number) => {
    try {
      const response = await moodboardService.getMoodboard(moodboardId);
      setCurrentItems(response.items || []);
    } catch (error) {
      console.error('Failed to load moodboard items:', error);
    }
  };

  const handleCreateMoodboard = async (formData: {
    name: string;
    description: string;
    theme: string;
    is_public: boolean;
  }) => {
    try {
      setLoading(true);
      const newMoodboard = await moodboardService.createMoodboard(formData);
      setMoodboards(prev => [newMoodboard, ...prev]);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create moodboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMoodboard = async (moodboard: Moodboard) => {
    setSelectedMoodboard(moodboard);
    await loadMoodboardItems(moodboard.id);
  };

  const handleAddItem = async (formData: {
    image_url: string;
    caption: string;
  }) => {
    if (!selectedMoodboard) return;

    try {
      setLoading(true);
      const newItem = await moodboardService.addMoodboardItem(selectedMoodboard.id, {
        ...formData,
        position_x: Math.random() * 200,
        position_y: Math.random() * 200,
        width: 200,
        height: 200
      });
      setCurrentItems(prev => [...prev, newItem]);
      setShowAddItemModal(false);
    } catch (error) {
      console.error('Failed to add item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e: React.DragEvent, item: MoodboardItem) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedItem || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCurrentItems(prev => 
      prev.map(item => 
        item.id === draggedItem.id 
          ? { ...item, position_x: x, position_y: y }
          : item
      )
    );
    setDraggedItem(null);
  };

  const handleItemResize = (itemId: number, width: number, height: number) => {
    setCurrentItems(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, width, height }
          : item
      )
    );
  };

  const handleItemEdit = (item: MoodboardItem) => {
    setEditingItem(item);
  };

  const handleItemDelete = (itemId: number) => {
    setCurrentItems(prev => prev.filter(item => item.id !== itemId));
  };

  return (
    <div className="p-6 max-w-7xl mx-auto h-full">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Moodboard</h1>
        <p className="text-gray-600">Create visual storyboards and moodboards for your photo shoots</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Your Moodboards</h2>
              <button
                onClick={() => setShowCreateModal(true)}
                className="p-2 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
              </div>
            ) : (
              <div className="space-y-3">
                {moodboards.map((moodboard) => (
                  <div
                    key={moodboard.id}
                    onClick={() => handleSelectMoodboard(moodboard)}
                    className={`p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                      selectedMoodboard?.id === moodboard.id
                        ? 'bg-gradient-to-r from-primary-50 to-purple-50 border-2 border-primary-200'
                        : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 truncate">{moodboard.name}</h3>
                      {moodboard.is_public ? (
                        <Eye className="w-4 h-4 text-green-600" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {moodboard.description || 'No description'}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{moodboard.item_count} items</span>
                      <span>{moodboard.theme || 'No theme'}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Canvas */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-full overflow-y-auto">
            {selectedMoodboard ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedMoodboard.name}</h2>
                    <p className="text-gray-600">{selectedMoodboard.description}</p>
                  </div>
                  <button
                    onClick={() => setShowAddItemModal(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Add Item</span>
                  </button>
                </div>

                <div
                  ref={canvasRef}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  className="relative bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 min-h-[500px] overflow-auto"
                  style={{ backgroundImage: 'radial-gradient(circle at 20px 20px, #e5e7eb 2px, transparent 0)' }}
                >
                  {currentItems.map((item) => (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item)}
                      className="absolute cursor-move group"
                      style={{
                        left: item.position_x,
                        top: item.position_y,
                        width: item.width,
                        height: item.height
                      }}
                    >
                      <div className="relative w-full h-full rounded-lg overflow-hidden shadow-lg border-2 border-white hover:border-primary-300 transition-all duration-200">
                        <img
                          src={item.image_url}
                          alt={item.caption || 'Moodboard item'}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Overlay with controls */}
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200">
                          <div className="absolute top-2 right-2 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => handleItemEdit(item)}
                              className="p-1 bg-white rounded-full shadow-sm hover:bg-gray-50"
                            >
                              <Edit3 className="w-3 h-3 text-gray-600" />
                            </button>
                            <button
                              onClick={() => handleItemDelete(item.id)}
                              className="p-1 bg-white rounded-full shadow-sm hover:bg-red-50"
                            >
                              <Trash2 className="w-3 h-3 text-red-600" />
                            </button>
                          </div>
                        </div>

                        {/* Caption */}
                        {item.caption && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                            <p className="text-white text-sm font-medium">{item.caption}</p>
                          </div>
                        )}

                        {/* Vibes tags */}
                        {item.vibes.length > 0 && (
                          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                            {item.vibes.slice(0, 3).map((vibe, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-white bg-opacity-90 rounded-full text-xs font-medium text-gray-700"
                              >
                                {vibe}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Palette className="w-10 h-10 text-pink-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">No Moodboard Selected</h3>
                <p className="text-gray-600 mb-6">Select a moodboard from the sidebar or create a new one to get started.</p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
                >
                  Create Your First Moodboard
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Moodboard Modal */}
      {showCreateModal && (
        <CreateMoodboardModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateMoodboard}
          loading={loading}
        />
      )}

      {/* Add Item Modal */}
      {showAddItemModal && selectedMoodboard && (
        <AddItemModal
          onClose={() => setShowAddItemModal(false)}
          onSubmit={handleAddItem}
          loading={loading}
        />
      )}

      {/* Edit Item Modal */}
      {editingItem && (
        <EditItemModal
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onSave={(updatedItem) => {
            setCurrentItems(prev =>
              prev.map(item =>
                item.id === updatedItem.id ? updatedItem : item
              )
            );
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
};

// Modal Components
interface CreateMoodboardModalProps {
  onClose: () => void;
  onSubmit: (data: { name: string; description: string; theme: string; is_public: boolean }) => void;
  loading: boolean;
}

const CreateMoodboardModal: React.FC<CreateMoodboardModalProps> = ({ onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    theme: '',
    is_public: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Create New Moodboard</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
            <input
              type="text"
              value={formData.theme}
              onChange={(e) => setFormData(prev => ({ ...prev, theme: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="e.g., vintage, modern, nature"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="is_public"
              checked={formData.is_public}
              onChange={(e) => setFormData(prev => ({ ...prev, is_public: e.target.checked }))}
              className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            />
            <label htmlFor="is_public" className="ml-2 text-sm text-gray-700">
              Make this moodboard public
            </label>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.name}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Moodboard'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface AddItemModalProps {
  onClose: () => void;
  onSubmit: (data: { image_url: string; caption: string }) => void;
  loading: boolean;
}

const AddItemModal: React.FC<AddItemModalProps> = ({ onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    image_url: '',
    caption: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Add Item to Moodboard</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
            <input
              type="url"
              value={formData.image_url}
              onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="https://example.com/image.jpg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Caption</label>
            <input
              type="text"
              value={formData.caption}
              onChange={(e) => setFormData(prev => ({ ...prev, caption: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Optional caption for this image"
            />
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !formData.image_url}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

interface EditItemModalProps {
  item: MoodboardItem;
  onClose: () => void;
  onSave: (item: MoodboardItem) => void;
}

const EditItemModal: React.FC<EditItemModalProps> = ({ item, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    caption: item.caption || '',
    width: item.width,
    height: item.height
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...item, ...formData });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Edit Item</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-6">
          <img
            src={item.image_url}
            alt={item.caption || 'Moodboard item'}
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Caption</label>
            <input
              type="text"
              value={formData.caption}
              onChange={(e) => setFormData(prev => ({ ...prev, caption: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Width</label>
              <input
                type="number"
                value={formData.width}
                onChange={(e) => setFormData(prev => ({ ...prev, width: Number(e.target.value) }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                min="100"
                max="400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
              <input
                type="number"
                value={formData.height}
                onChange={(e) => setFormData(prev => ({ ...prev, height: Number(e.target.value) }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                min="100"
                max="400"
              />
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MoodboardGenerator; 