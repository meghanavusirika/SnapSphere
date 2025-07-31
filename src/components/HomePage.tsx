import React from 'react';
import { motion } from 'framer-motion';
import { 
  MapPin, 
  Camera, 
  Sparkles, 
  Heart, 
  Star,
  ArrowRight,
  Palette,
  Zap,
  LogIn,
  UserPlus
} from 'lucide-react';

interface HomePageProps {
  onExploreMap: () => void;
  onSignIn: () => void;
  onSignUp: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onExploreMap, onSignIn, onSignUp }) => {
  const features = [
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Vibemap",
      description: "Discover hidden gems with vibe-based filters. Find moody alleys, peaceful nature spots, and urban aesthetics.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Vibe Detection",
      description: "Smart AI analyzes photos to classify styles and generate creative descriptions automatically.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Camera className="w-6 h-6" />,
      title: "Community Photo Spots",
      description: "Community-driven photo spots with sample shots, timing tips, and safety notes.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Smart Recommendations",
      description: "Get personalized suggestions based on your style, weather, and golden hour alerts.",
      color: "from-red-500 to-pink-500"
    },
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Moodboard",
      description: "Create visual storyboards and moodboards for your photo shoots.",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Caption Generator",
              description: "Generate AI-powered captions based on location and mood.",
      color: "from-indigo-500 to-purple-500"
    }
  ];

  const sampleSpots = [
    {
      name: "Hidden Garden Alley",
      vibe: "vintage",
      description: "A secret passage with ivy-covered walls and vintage street lamps",
      rating: 4.8,
      bestTime: "Golden Hour",
      imageUrl: "https://i0.wp.com/nevertooldtotravel.com/wp-content/uploads/2017/02/42-Amazing-Courtyards-Passageways-to-Discover-in-Carmel.jpg?fit=640%2C480&ssl=1"
    },
    {
      name: "Urban Rooftop Vista",
      vibe: "urban",
      description: "Modern cityscape with perfect skyline views",
      rating: 4.6,
      bestTime: "Blue Hour",
      imageUrl: "https://s3-media0.fl.yelpcdn.com/bphoto/nY1q8fJJCxKzUIRViubPBw/348s.jpg"
    },
    {
      name: "Misty Lake Pier",
      vibe: "nature",
      description: "Peaceful lakeside with morning fog and wildlife",
      rating: 4.9,
      bestTime: "Sunrise",
      imageUrl: "https://thumbs.dreamstime.com/b/misty-lake-pier-autumn-landscape-tranquil-scene-misty-lake-pier-autumn-landscape-tranquil-scene-360452572.jpg"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header Bar */}
      <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand Name */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-purple-600 rounded-full flex items-center justify-center">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                SnapSphere
              </span>
            </div>

            {/* Authentication Buttons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={onSignIn}
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:text-primary-600 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </button>
              <button
                onClick={onSignUp}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-opacity"
              >
                <UserPlus className="w-4 h-4" />
                <span>Sign Up</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-purple-50 to-pink-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              Find Your Perfect
              <br />
              Photo Spot
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              SnapSphere helps content creators, photographers, and travelers discover 
              visually stunning locations with AI-powered recommendations and community insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={onExploreMap}
                className="btn-primary text-lg px-8 py-4 flex items-center justify-center space-x-2"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        </div>
        
        {/* Floating Elements */}
        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="absolute top-20 left-10 text-primary-400 opacity-20"
        >
          <Camera className="w-12 h-12" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute top-40 right-20 text-purple-400 opacity-20"
        >
          <MapPin className="w-10 h-10" />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why SnapSphere?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We combine the power of AI with community insights to help you discover 
              the most photogenic locations around you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="card hover:shadow-xl transition-shadow duration-300"
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample Spots Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Discover Amazing Spots
            </h2>
            <p className="text-xl text-gray-600">
              Real locations shared by our community of creators
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {sampleSpots.map((spot, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="card hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mb-4 flex items-center justify-center">
                  <img 
                    src={spot.imageUrl} 
                    alt={spot.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    spot.vibe === 'vintage' ? 'bg-aesthetic-vintage text-white' :
                    spot.vibe === 'urban' ? 'bg-aesthetic-urban text-gray-800' :
                    'bg-aesthetic-nature text-white'
                  }`}>
                    {spot.vibe}
                  </span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{spot.rating}</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {spot.name}
                </h3>
                <p className="text-gray-600 text-sm mb-3">
                  {spot.description}
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <span>🕐</span>
                  <span className="ml-1">Best: {spot.bestTime}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-500 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Find Your Perfect Shot?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of creators who are already discovering amazing photo spots with SnapSphere.
            </p>
            <button
              onClick={onExploreMap}
              className="bg-white text-primary-600 font-semibold py-4 px-8 rounded-lg text-lg hover:bg-gray-50 transition-colors duration-200 flex items-center space-x-2 mx-auto"
            >
              <span>Start Exploring</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage; 