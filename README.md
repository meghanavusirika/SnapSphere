# 📸 SnapSphere – AI-Powered Photo Spot Discovery & Creative Suite

SnapSphere is a creative map exploration platform built for photographers, content creators, and explorers. Powered by AI, ggogle maps API and geospatial APIs, it helps you discover photo-worthy locations based on mood, aesthetics, and real-time conditions — not just reviews or popularity.

## 🌐 Video Demo
🔗 [Coming Soon]

## 🖼️ Preview
![Home_Page](https://github.com/meghanavusirika/SnapSphere/blob/main/Images/HomePage.png)
![VibeMap](https://github.com/meghanavusirika/SnapSphere/blob/main/Images/Screenshot%202025-07-31%20at%203.01.37%20PM.png)

## ✨ Features

- 🗺️ **VibeMap**: Explore photo spots on an interactive map filtered by aesthetic vibes
- 🎨 **Moodboards**: Plan shoots or save favorite locations with customizable moodboards
- 📍 **Community Photo Spots**: Discover and submit hidden gems shared by other explorers
- 🎯 **Vibe Detection**: Upload any photo to get an AI-powered vibe analysis
- 🔍 **Smart Recommendations**: Get location-based spot suggestions using weather, time, and vibe data
- 💬 **Caption Generator**: Generate aesthetic, share-ready captions based on your photos

## 🛠️ Tech Stack
- **Frontend**: React + TypeScript, Tailwind CSS, Mapbox GL JS
- **Backend**: Python Flask, SQLAlchemy, SQLite
- **AI/ML**: CLIP (OpenAI), PyTorch, Transformers
- **Maps & Location**: Mapillary API, Nominatim Geocoding, Google Maps APIs
- **Authentication**: JWT, Werkzeug Security
- **Image Processing**: Pillow (PIL), CLIP Processor

## ⚙️ Local Setup Instructions

### 1. Environment Variables
```bash
cp env.example .env
```

Edit `.env` with your credentials:

```dotenv
FLASK_SECRET_KEY=your_super_secret_key_here
MAPILLARY_CLIENT_ID=your_mapillary_client_id
MAPILLARY_ACCESS_TOKEN=your_mapillary_access_token
FLASK_PORT=5001
FLASK_DEBUG=True
DATABASE_URL=sqlite:///photos.db
```

### 2. Get API Keys

#### 🧭 Mapillary
1. Sign up at [Mapillary](https://www.mapillary.com/)
2. Create an app and get your Client ID and Access Token

#### 🗺️ Google Maps (Optional)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Enable:
   - Maps JavaScript API
   - Geocoding API
3. Generate API key and add to your frontend config

### 3. Installation

#### 🐍 Backend
```bash
cd ai-backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python -c "from app import app, db; app.app_context().push(); db.create_all()"
```

#### 🧩 Frontend
```bash
cd ..
npm install
npm run build
```

### 4. Running the App

**Terminal 1 – Backend**
```bash
cd ai-backend
source venv/bin/activate
python app.py
```

**Terminal 2 – Frontend**
```bash
npm start
```

### 5. Open the App
👉 http://localhost:3000

## 🏗️ Architecture Overview

### 🧠 AI/ML Pipeline
- **CLIP**: For vibe classification
- **Caption Generator**: Custom templates
- **Color Extraction**: Extracts palette from photo
- **Smart Recommender**: Time/weather/place-aware

### ⚙️ Backend (Flask)
- AI processing
- API endpoints
- User auth & DB operations

### 🎨 Frontend (React)
- Mapbox + custom layers
- Moodboard UI
- Vibe filtering system

## 🔐 Security Notes
⚠️ **Don't commit .env to GitHub**. It contains sensitive credentials.
`.gitignore` already excludes it.

## 📊 API Endpoints

### 🔐 Auth
- `POST /register`
- `POST /login`
- `GET /me`

### 📍 Photos
- `GET /photos_nearby`
- `POST /add_photo`
- `POST /fetch_mapillary_photos`
- `POST /place_details`

### 🧠 AI Tools
- `POST /analyze_vibe`
- `POST /generate_caption`
- `POST /smart_recommendations`

### 📁 Moodboards
- `GET /moodboards`
- `POST /moodboards`
- `GET /moodboards/<id>`
- `POST /moodboards/<id>/items`

## 🤝 Contributing
1. Fork the repo
2. Create your branch (`git checkout -b feature/AmazingFeature`)
3. Add your own `.env` (never commit it!)
4. Test everything
5. Submit a pull request

## 👥 Contributors – SpurHacks 2025
- **@meghanavusirika** – Project Lead & Full-Stack Developer (built VibeMap, Community Photo Spots, Smart Recommendations, Caption Generator, and overall integration)
- **@advitiya6594** – Full-Stack Developer (worked on Vibe Classification and Moodboards)

## 📄 License
MIT License

## 🚀 Future Enhancements
- Mobile App (iOS + Android)
- GPT-powered Smart Captions
- Real-Time Moodboard Collaboration
- AR Photo Spot Discovery
- Social Reviews & Ratings
- Public Vibe Trails 
