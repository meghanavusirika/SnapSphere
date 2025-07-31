# SnapSphere - AI-Powered Photo Spot Discovery & Creative Suite

A comprehensive photo spot discovery and creative management platform that combines AI-powered location intelligence with advanced creative tools for photographers and content creators.

🌐 **Live Demo**  
Check out the deployed application: 🔗 [Coming Soon]

## 📸 Preview
![SnapSphere Interface](https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=SnapSphere+Interface)

## ✨ Features

### 🗺️ **Smart Location Discovery**
- **AI-Powered Geocoding**: Automatic place name detection using Nominatim
- **Mapillary Integration**: Real-time photo spot discovery from street-level imagery
- **Proximity Search**: Find photo spots within customizable radius
- **Vibe-Based Filtering**: Filter locations by mood and aesthetic

### 🤖 **AI Creative Suite**
- **Vibe Analysis**: CLIP-powered image analysis for mood detection
- **Smart Captions**: AI-generated captions with multiple styles (casual, professional, creative)
- **Color Palette Extraction**: Automatic color scheme detection from images
- **Style Tagging**: Intelligent categorization of photo aesthetics

### 📱 **Moodboard Management**
- **Visual Collections**: Create and organize photo collections by theme
- **Drag & Drop Interface**: Intuitive moodboard creation
- **Public/Private Sharing**: Control visibility of your creative collections
- **AI-Enhanced Curation**: Smart suggestions for moodboard items

### 🎯 **Smart Recommendations**
- **Location-Based Suggestions**: Personalized photo spots based on your location
- **Weather-Aware Recommendations**: Optimal shooting conditions and timing
- **Crowd Level Intelligence**: Know when spots are least crowded
- **Golden Hour Alerts**: Perfect timing for magical lighting

### 🔐 **User Management**
- **Secure Authentication**: JWT-based user authentication
- **Personal Profiles**: User-specific collections and preferences
- **Activity Tracking**: Monitor your photography journey

## 🛠️ Tech Stack

**Frontend**: React + TypeScript, Tailwind CSS, Mapbox GL JS  
**Backend**: Python Flask, SQLAlchemy, SQLite  
**AI/ML**: CLIP (OpenAI), PyTorch, Transformers  
**Maps & Location**: Mapillary API, Nominatim Geocoding  
**Authentication**: JWT, Werkzeug Security  
**Image Processing**: Pillow (PIL), CLIP Processor  

## ⚙️ Local Setup Instructions

The steps below are for developers who want to run SnapSphere locally for development or contribution purposes.

### 1. Environment Variables

Copy the example environment file and configure your secrets:

```bash
cp env.example .env
```

Edit the `.env` file with your actual credentials:

```env
# Flask Configuration
FLASK_SECRET_KEY=your_super_secret_key_here
FLASK_ENV=development

# Mapillary API Configuration (for street-level photos)
MAPILLARY_CLIENT_ID=your_mapillary_client_id
MAPILLARY_ACCESS_TOKEN=your_mapillary_access_token

# Server Configuration
FLASK_PORT=5001
FLASK_DEBUG=True

# Database Configuration
DATABASE_URL=sqlite:///photos.db
```

### 2. Get API Keys

#### Mapillary API (Street-Level Photos)
1. Sign up at [Mapillary](https://www.mapillary.com/developers)
2. Create a new application
3. Get your Client ID and Access Token
4. Add to `MAPILLARY_CLIENT_ID` and `MAPILLARY_ACCESS_TOKEN`

#### Google Maps API (Optional - for enhanced mapping)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Maps JavaScript API
4. Create credentials and add to your frontend configuration

### 3. Installation

#### Prerequisites
- Python 3.8+
- Node.js 16+
- pip (Python package manager)

#### Backend Setup
```bash
# Navigate to backend directory
cd ai-backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Initialize database
python -c "from app import app, db; app.app_context().push(); db.create_all()"
```

#### Frontend Setup
```bash
# Navigate to project root
cd ..

# Install frontend dependencies
npm install

# Build the application
npm run build
```

### 4. Running the Application

#### Terminal 1 - Backend Server (Port 5001)
```bash
cd ai-backend
source venv/bin/activate
python app.py
```

#### Terminal 2 - Frontend Development Server (Port 3000)
```bash
npm start
```

### 5. Access the Application

Open your browser to: `http://localhost:3000`

## 🏗️ Architecture

### Backend Services
- **Main API Server**: Flask application on port 5001
- **AI Processing**: CLIP model for image analysis and vibe detection
- **Database**: SQLite with SQLAlchemy ORM
- **Authentication**: JWT-based user management

### Frontend Components
- **React App**: TypeScript-based frontend on port 3000
- **Map Integration**: Mapbox GL JS for interactive mapping
- **State Management**: React Context for global state
- **UI Framework**: Tailwind CSS for styling

### AI/ML Pipeline
- **Image Analysis**: CLIP model for vibe classification
- **Caption Generation**: Template-based AI caption creation
- **Color Extraction**: Automated color palette detection
- **Recommendation Engine**: Location and preference-based suggestions

## 🔒 Security Notes

⚠️ **Important**: Never commit the `.env` file to version control. It contains sensitive API keys and database credentials.

The `.env` file is already included in `.gitignore` to prevent accidental commits.

## 📊 API Endpoints

### Authentication
- `POST /register` - User registration
- `POST /login` - User authentication
- `GET /me` - Get user profile

### Photo Spots
- `GET /photos_nearby` - Find nearby photo spots
- `POST /add_photo` - Add new photo spot
- `POST /fetch_mapillary_photos` - Import from Mapillary
- `POST /place_details` - Get location details

### AI Features
- `POST /analyze_vibe` - Analyze image vibes
- `POST /generate_caption` - Generate AI captions
- `POST /smart_recommendations` - Get personalized recommendations

### Moodboards
- `GET /moodboards` - Get user moodboards
- `POST /moodboards` - Create new moodboard
- `GET /moodboards/<id>` - Get specific moodboard
- `POST /moodboards/<id>/items` - Add item to moodboard

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Make sure to add your own `.env` file (never commit it)
4. Test your changes thoroughly
5. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
6. Push to the branch (`git push origin feature/AmazingFeature`)
7. Open a Pull Request

## 👥 Contributors

**SnapSphere Team for Spurhacks 2025**
- **@v.v.meghanareddy** – Project Lead & Full-Stack Development
- **@JordanKing22** – Backend Architecture & AI Integration
- **@meghanavusirika** – Frontend Development & UI/UX Design
- **@manahilbashir** – Creative Direction & User Experience
- **@PritNotPrinter** – AI/ML Implementation & Technical Lead

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🚀 Future Enhancements

- **Real-time Collaboration**: Multi-user moodboard editing
- **Advanced AI Models**: Integration with GPT-4 for enhanced captions
- **Social Features**: Photo spot reviews and ratings
- **Mobile App**: Native iOS and Android applications
- **AR Integration**: Augmented reality photo spot discovery
- **Weather Integration**: Real-time weather-based recommendations

---

**Built with ❤️ for the photography community** 