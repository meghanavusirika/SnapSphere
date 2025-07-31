import React, { useState, createContext, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, Link, useLocation } from 'react-router-dom';
import HomePage from './components/HomePage';
import AestheticMap from './components/AestheticMap';
import MoodboardGenerator from './components/MoodboardGenerator';
import AIVibeClassification from './components/AIVibeClassification';
import AICaptions from './components/AICaptions';
import SmartRecommender from './components/SmartRecommender';
import UserSubmittedPhotos from './components/UserSubmittedPhotos';
import { Camera, LogOut, Settings, User, MapPin, Palette, Sparkles, Heart, Zap } from 'lucide-react';

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
  source: 'mapillary' | 'community';
}

// Authentication Context
interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      // Verify token is still valid
      fetch('http://localhost:5001/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => {
          if (data && !data.error) {
            setUser(JSON.parse(storedUser));
          } else {
            // Token invalid, clear storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
          }
          setLoading(false);
        })
        .catch(() => {
          // Network error, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const isAuthenticated = !!user;

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, setUser, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

// Login Component
const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({ name: data.name, email: data.email }));
        setUser({ name: data.name, email: data.email });
        navigate('/app');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err: any) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-600 mt-2">Sign in to your account</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
          
          <button type="submit" className="w-full bg-gradient-to-r from-primary-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity">
            Sign In
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm">
          Don't have an account? <Link to="/signup" className="text-primary-600 hover:underline font-medium">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

// Auth Choice Component
const AuthChoice: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome to SnapSphere</h1>
          <p className="text-gray-600 mt-2">Choose how you'd like to get started</p>
        </div>
        
        <div className="space-y-4">
          <button 
            onClick={() => navigate('/login')}
            className="w-full bg-gradient-to-r from-primary-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            Sign In
          </button>
          
          <button 
            onClick={() => navigate('/signup')}
            className="w-full bg-white border-2 border-primary-500 text-primary-600 py-3 rounded-lg font-medium hover:bg-primary-50 transition-colors"
          >
            Create Account
          </button>
        </div>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Join thousands of creators discovering amazing photo spots</p>
        </div>
      </div>
    </div>
  );
};

// Signup Component
const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/app');
    }
  }, [isAuthenticated, navigate]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({ name: data.name, email: data.email }));
        setUser({ name: data.name, email: data.email });
        navigate('/app');
      } else {
        setError(data.error || 'Signup failed');
      }
    } catch (err: any) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-gray-600 mt-2">Join SnapSphere today</p>
        </div>
        
        <form onSubmit={handleSignup} className="space-y-6">
          {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>
          
          <button type="submit" className="w-full bg-gradient-to-r from-primary-500 to-purple-600 text-white py-3 rounded-lg font-medium hover:opacity-90 transition-opacity">
            Sign Up
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm">
          Already have an account? <Link to="/login" className="text-primary-600 hover:underline font-medium">Sign in</Link>
        </div>
      </div>
    </div>
  );
};

// Main App Component (Authenticated)
const MainApp: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'map' | 'dashboard' | 'moodboard' | 'aivibe' | 'settings' | 'userphotos' | 'smartrecommender' | 'aicaptions'>('map');
  const { user, setUser } = useAuth();
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const signOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const sidebarItems = [
    {
      id: 'map',
      name: 'Vibemap',
      icon: <MapPin className="w-5 h-5" />
    },
    {
      id: 'moodboard',
      name: 'Moodboard',
      icon: <Palette className="w-5 h-5" />
    },
    {
      id: 'userphotos',
      name: 'Community Photo Spots',
      icon: <Camera className="w-5 h-5" />
    },
    {
      id: 'aivibe',
      name: 'Vibe Detection',
      icon: <Sparkles className="w-5 h-5" />
    },
    {
      id: 'smartrecommender',
      name: 'Smart Recommendations',
      icon: <Heart className="w-5 h-5" />
    },
    {
      id: 'aicaptions',
      name: 'Caption Generator',
      icon: <Zap className="w-5 h-5" />
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: <Settings className="w-5 h-5" />
    }
  ];

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return (
          <HomePage 
            onExploreMap={() => setCurrentView('map')} 
            onSignIn={() => window.location.href = '/login'}
            onSignUp={() => window.location.href = '/signup'}
          />
        );
      case 'map':
        return <AestheticMap />;
      case 'userphotos':
        return <UserSubmittedPhotos />;
      case 'smartrecommender':
        return <SmartRecommender />;
      case 'aicaptions':
        return <AICaptions />;
      case 'moodboard':
        return <MoodboardGenerator />;
      case 'aivibe':
        return <AIVibeClassification />;
      case 'settings':
        return (
          <div className="p-8 max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
              <p className="text-gray-600">Manage your account and preferences</p>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{user?.name}</h3>
                  <p className="text-gray-600">{user?.email}</p>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="border-b border-gray-100 pb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <div className="bg-gray-50 rounded-xl px-4 py-3">
                        <p className="text-gray-900 font-medium">{user?.name}</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <div className="bg-gray-50 rounded-xl px-4 py-3">
                        <p className="text-gray-900 font-medium">{user?.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-b border-gray-100 pb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-medium text-gray-900">Email Notifications</p>
                        <p className="text-sm text-gray-600">Receive updates about new features</p>
                      </div>
                      <div className="w-12 h-6 bg-primary-500 rounded-full relative">
                        <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 right-0.5 shadow-sm"></div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-medium text-gray-900">Location Services</p>
                        <p className="text-sm text-gray-600">Allow access to your location</p>
                      </div>
                      <div className="w-12 h-6 bg-gray-300 rounded-full relative">
                        <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 left-0.5 shadow-sm"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <AestheticMap />;
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 overflow-hidden">
      {/* Collapsible Sidebar */}
      <aside className={`bg-white/95 backdrop-blur-md border-r border-gray-100 flex flex-col transition-all duration-300 shadow-sm h-full ${sidebarOpen ? 'w-80' : 'w-20'}`}>
        {/* Sidebar Header with User Profile */}
        <div className="p-4 border-b border-gray-100">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex items-center space-x-3 hover:opacity-80 transition-opacity w-full"
          >
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-purple-600 rounded-full overflow-hidden flex items-center justify-center text-white font-semibold shadow-lg flex-shrink-0">
              {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
            </div>
            {sidebarOpen && (
              <div className="flex-1 min-w-0 text-left">
                <p className="text-base font-semibold text-gray-900 truncate">{user?.name}</p>
                <p className="text-sm text-gray-500 truncate leading-tight">{user?.email}</p>
              </div>
            )}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-3 space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as any)}
              className={`w-full flex items-center space-x-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                currentView === item.id
                  ? 'text-primary-700'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                currentView === item.id ? 'bg-gray-100' : 'bg-gray-100'
              }`}>
                <div className="flex items-center justify-center w-6 h-6">
                  {item.icon}
                </div>
              </div>
              {sidebarOpen && (
                <div className="flex-1 text-left min-w-0">
                  <div className="text-sm font-semibold text-gray-900">{item.name}</div>
                </div>
              )}
            </button>
          ))}
        </nav>

        {/* Sign Out */}
        <div className="p-4 border-t border-gray-100">
              <button
            onClick={signOut}
            className={`w-full flex items-center space-x-4 px-4 py-4 rounded-xl text-red-600 hover:bg-red-50 transition-all duration-200 hover:shadow-sm ${
              !sidebarOpen ? 'justify-center' : ''
            }`}
          >
            <div className="p-2 rounded-lg bg-red-100">
              <LogOut className="w-5 h-5" />
            </div>
            {sidebarOpen && <span className="text-sm font-semibold">Sign Out</span>}
              </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0 h-full">
        {/* Top Navigation Bar */}
        <nav className="bg-white/90 backdrop-blur-md border-b border-gray-100 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Camera className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                  SnapSphere
                </h1>
              </div>
            </div>
            
            {/* Right side actions */}
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-3 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:shadow-sm"
              >
                <div className="w-5 h-5 text-gray-600 font-light">☰</div>
              </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
        <main className="flex-1 overflow-auto bg-gradient-to-br from-gray-50 to-white min-w-0">
          {renderContent()}
      </main>
      </div>
    </div>
  );
};

// Authenticated Home Redirect Component
const AuthenticatedHomeRedirect: React.FC = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/app" replace /> : (
    <HomePage 
      onExploreMap={() => window.location.href = '/auth'} 
      onSignIn={() => window.location.href = '/login'}
      onSignUp={() => window.location.href = '/signup'}
    />
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AuthenticatedHomeRedirect />} />
          <Route path="/home" element={<AuthenticatedHomeRedirect />} />
          <Route path="/auth" element={<AuthChoice />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/app/*" element={<ProtectedRoute><MainApp /></ProtectedRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App; 