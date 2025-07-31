# 📸 SnapSphere – AI-Powered Photo Spot Discovery & Creative Suite

SnapSphere is a creative map exploration platform built for photographers, content creators, and explorers. Powered by AI and geospatial APIs, it helps you discover photo-worthy locations based on mood, aesthetics, and real-time conditions — not just reviews or popularity.

## 🌐 Live Demo
🔗 [Coming Soon]

## 🖼️ Preview
SnapSphere Interface (Insert screenshots/gif here)

## ✨ Features

### 🗺️ Smart Location Discovery
- **AI-Powered Geocoding**: Converts coordinates into real-world addresses using Nominatim.
- **Mapillary Integration**: Pulls street-level imagery for undiscovered photo spots.
- **Proximity Search**: Finds nearby spots based on your current location.
- **Vibe-Based Filtering**: Search by aesthetic mood like "dreamy," "urban," or "sunset nostalgia."

### 🤖 AI Creative Suite
- **Vibe Analysis**: Uses CLIP (by OpenAI) to detect mood from uploaded images.
- **Smart Captions**: Generates Instagram-ready captions (casual, professional, poetic).
- **Color Palette Extraction**: Pulls color schemes from images for visual planning.
- **Style Tagging**: Categorizes images by themes and artistic style.

### 📱 Moodboard Management
- **Create & Organize**: Drag and drop moodboards by theme or project.
- **Smart Suggestions**: AI-recommended spots based on saved images.
- **Public/Private Sharing**: Control visibility and collaborate with others.

### 🎯 Smart Recommendations
- **Context-Aware Suggestions**: Recommends photo spots based on time of day, weather, and light.
- **Golden Hour Alerts**: Notify users when lighting is perfect.
- **Safe Route Planning**: Choose safer paths for late shoots or unknown areas.
- **Holder Hour Notifications**: Let users know when locations are most and least crowded.

### 👤 User Management
- **Secure Auth**: JWT-based authentication for seamless sign-up/login.
- **Personal Profiles**: Save preferences, moodboards, and submitted spots.
- **User Submissions**: Share and discover hidden gems contributed by the community.

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
- **@v.v.meghanareddy** – Project Lead & Full Stack Dev
- **@JordanKing22** – Backend Architecture & AI Integration
- **@meghanavusirika** – Frontend Dev & UI/UX
- **@manahilbashir** – Creative Strategy & User Experience
- **@PritNotPrinter** – AI/ML Integration & Technical Lead

## 📄 License
MIT License – See LICENSE file

## 🚀 Future Enhancements
- Mobile App (iOS + Android)
- GPT-powered Smart Captions
- Real-Time Moodboard Collaboration
- AR Photo Spot Discovery
- Social Reviews & Ratings
- Public Vibe Trails 