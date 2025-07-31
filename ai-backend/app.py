from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import requests
import torch
from transformers import CLIPProcessor, CLIPModel
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func
import os
import datetime
import math
import time
import random
from werkzeug.security import generate_password_hash, check_password_hash
import jwt

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

app.config['SECRET_KEY'] = 'supersecretkey'

# Database setup
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///photos.db'
db = SQLAlchemy(app)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)

class Photo(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    photo_url = db.Column(db.String, nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    longitude = db.Column(db.Float, nullable=False)
    vibes = db.Column(db.String, nullable=False)  # Comma-separated tags
    timestamp = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    place_name = db.Column(db.String, nullable=True)  # Short place name
    full_address = db.Column(db.String, nullable=True)  # Full address
    description = db.Column(db.String, nullable=True)  # AI-generated description
    best_time = db.Column(db.String, nullable=True)  # Best time to visit
    crowd_level = db.Column(db.String, nullable=True)  # low, medium, high
    safety_notes = db.Column(db.String, nullable=True)  # Safety information
    rating = db.Column(db.Float, nullable=True)  # Rating out of 5
    submitted_by = db.Column(db.String, nullable=True)  # Who submitted this

# New models for additional features
class Moodboard(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    theme = db.Column(db.String(100), nullable=True)  # e.g., "vintage", "modern", "nature"
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    is_public = db.Column(db.Boolean, default=False)
    
    # Relationship
    user = db.relationship('User', backref='moodboards')

class MoodboardItem(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    moodboard_id = db.Column(db.Integer, db.ForeignKey('moodboard.id'), nullable=False)
    image_url = db.Column(db.String(500), nullable=False)
    caption = db.Column(db.String(300), nullable=True)
    vibes = db.Column(db.String(200), nullable=True)  # Comma-separated vibes
    position_x = db.Column(db.Float, default=0)
    position_y = db.Column(db.Float, default=0)
    width = db.Column(db.Float, default=200)
    height = db.Column(db.Float, default=200)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    
    # Relationship
    moodboard = db.relationship('Moodboard', backref='items')

class AIVibeAnalysis(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    image_url = db.Column(db.String(500), nullable=False)
    primary_vibe = db.Column(db.String(100), nullable=False)
    secondary_vibes = db.Column(db.String(300), nullable=True)  # Comma-separated
    confidence_score = db.Column(db.Float, nullable=False)
    color_palette = db.Column(db.String(200), nullable=True)  # JSON string of colors
    mood_score = db.Column(db.Float, nullable=True)  # 0-1 scale
    style_tags = db.Column(db.String(300), nullable=True)  # Comma-separated style tags
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    
    # Relationship
    user = db.relationship('User', backref='vibe_analyses')

class AICaption(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    image_url = db.Column(db.String(500), nullable=False)
    caption_text = db.Column(db.Text, nullable=False)
    style = db.Column(db.String(50), nullable=True)  # "casual", "professional", "creative"
    hashtags = db.Column(db.String(300), nullable=True)  # Comma-separated hashtags
    mood = db.Column(db.String(50), nullable=True)  # "happy", "moody", "inspiring"
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    
    # Relationship
    user = db.relationship('User', backref='captions')

class SmartRecommendation(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    location_lat = db.Column(db.Float, nullable=True)
    location_lng = db.Column(db.Float, nullable=True)
    weather_condition = db.Column(db.String(100), nullable=True)
    time_of_day = db.Column(db.String(50), nullable=True)  # "golden_hour", "blue_hour", "daylight"
    recommended_spots = db.Column(db.Text, nullable=True)  # JSON string of recommendations
    user_preferences = db.Column(db.Text, nullable=True)  # JSON string of user preferences
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)
    
    # Relationship
    user = db.relationship('User', backref='recommendations')

# Create DB if not exists
with app.app_context():
    db.create_all()

# Load CLIP model and processor
clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch16")
clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch16")

# Example tags/vibes
CANDIDATE_TAGS = [
    "moody", "urban", "nature", "colorful", "peaceful", "vintage", "graffiti", "trail", "abandoned", "calm", "modern"
]

def haversine(lat1, lon1, lat2, lon2):
    # Calculate the great circle distance between two points on the earth (specified in decimal degrees)
    R = 6371  # Radius of earth in kilometers
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi/2)**2 + math.cos(phi1)*math.cos(phi2)*math.sin(dlambda/2)**2
    c = 2*math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

MAPILLARY_CLIENT_ID = "10042547262524216"
MAPILLARY_ACCESS_TOKEN = "MLY|10042547262524216|7aa927975ba24be6862e52ac262d3b4d"

# --- Utility: Enrich photo details (place name, description, vibes) ---
def enrich_photo_details(photo_url, latitude, longitude):
    # 1. Get place name from Nominatim
    def get_place_name_nominatim(lat, lon):
        try:
            url = f'https://nominatim.openstreetmap.org/reverse?format=json&lat={lat}&lon={lon}&zoom=16&addressdetails=1'
            headers = {'User-Agent': 'SnapSphere/1.0'}
            resp = requests.get(url, headers=headers, timeout=5)
            if resp.status_code == 200:
                data = resp.json()
                display_name = data.get('display_name')
                if display_name:
                    # Short name: first part before comma
                    short_name = display_name.split(',')[0].strip()
                    return short_name, display_name
        except Exception:
            pass
        return None, None

    place_name, full_address = get_place_name_nominatim(latitude, longitude)
    if not place_name:
        place_name = f"Scenic Spot near ({latitude:.4f}, {longitude:.4f})"
        full_address = place_name

    # 2. AI-generated description (stub for now)
    def generate_ai_description(photo_url, place_name):
        return f"A photogenic spot with unique vibes at {place_name}. Perfect for capturing memorable moments."
    description = generate_ai_description(photo_url, place_name)

    # 3. Run CLIP for vibes/tags
    try:
        response = requests.get(photo_url, stream=True)
        image = Image.open(response.raw).convert("RGB")
        inputs = clip_processor(
            text=CANDIDATE_TAGS,
            images=image,
            return_tensors="pt",
            padding=True
        )
        with torch.no_grad():
            outputs = clip_model(**inputs)
            logits_per_image = outputs.logits_per_image
            probs = logits_per_image.softmax(dim=1).cpu().numpy()[0]
        top_indices = probs.argsort()[-3:][::-1]
        tags = [CANDIDATE_TAGS[i] for i in top_indices]
        tags_str = ','.join(tags)
    except Exception:
        tags = []
        tags_str = ''

    # Creative, single-paragraph description templates (expanded pool)
    vibe_str = ', '.join(tags) if tags else 'unique'
    description_templates = [
        f"Capture the essence of {place_name}—a spot known for its {vibe_str} vibes. Let your camera tell the story of this hidden gem. Every visit offers a new perspective and a fresh adventure.",
        f"Discover {place_name}, where {vibe_str} energy fills the air. Perfect for spontaneous photo walks and creative inspiration. Don't forget to explore the surroundings for even more surprises!",
        f"Hidden gem alert: {place_name}! Snap stunning shots and soak in the {vibe_str} atmosphere. This place is a favorite among locals and explorers alike. Bring a friend and make memories that last a lifetime.",
        f"Every corner of {place_name} tells a story. Experience its {vibe_str} charm through your lens. Ideal for both quiet reflection and lively group photos. Let your creativity run wild in this photogenic haven.",
        f"Looking for {vibe_str} inspiration? {place_name} is the place to be for unforgettable photos. The light here is magical at any time of day. Capture moments that will brighten your feed and your mood.",
        f"Let {place_name} surprise you with its {vibe_str} scenery and unique photo ops. Wander, explore, and find your favorite angle. This spot is a must-visit for every SnapSphere explorer!",
        f"Step into {place_name} and feel the {vibe_str} spirit all around you. From sunrise to sunset, every moment is picture-perfect. Share your story and inspire others to visit this special place.",
        f"At {place_name}, the {vibe_str} ambiance sets the stage for creativity. Lose yourself in the details and discover new beauty with every step. This is where memories are made and adventures begin.",
        f"Uncover the magic of {place_name}, a haven for {vibe_str} seekers. Let the colors, textures, and sounds spark your imagination. Your next viral photo could be just a click away!",
        f"{place_name} is more than a location—it's an experience. Feel the {vibe_str} energy as you explore every nook and cranny. Bring your friends, your camera, and your sense of wonder.",
        f"Wander through {place_name} and let the {vibe_str} vibes guide your journey. Every visit reveals something new to capture and cherish. This is the spot where ordinary days become extraordinary memories."
    ]
    description = random.choice(description_templates)

    # Generate random additional details
    best_times = [
        "Golden Hour (6-7 PM)", "Sunrise (6-7 AM)", "Blue Hour (8-9 PM)", 
        "Afternoon (2-4 PM)", "Early Morning (7-9 AM)", "Late Afternoon (4-6 PM)"
    ]
    crowd_levels = ["low", "medium", "high"]
    safety_notes = [
        "Safe during daylight hours. Well-lit area.",
        "Check for security. Some areas may be restricted.",
        "Very safe area. Popular with joggers and photographers.",
        "Safe area. Popular with tourists and locals.",
        "Access requires permission. Best during business hours.",
        "Safe during business hours. Check for evening access."
    ]
    submitted_names = [
        "Sarah M.", "Mike R.", "Emma L.", "Alex K.", "David P.", 
        "Jessica W.", "Tom H.", "Lisa F.", "Chris B.", "Maria S."
    ]

    best_time = random.choice(best_times)
    crowd_level = random.choice(crowd_levels)
    safety_note = random.choice(safety_notes)
    rating = round(random.uniform(4.5, 4.9), 1)
    submitted_by = random.choice(submitted_names)

    return place_name, full_address, description, tags, tags_str, best_time, crowd_level, safety_note, rating, submitted_by

@app.route('/add_photo', methods=['POST'])
def add_photo():
    data = request.json
    photo_url = data.get('photo_url')
    latitude = data.get('latitude')
    longitude = data.get('longitude')
    timestamp = data.get('timestamp')
    if not all([photo_url, latitude, longitude]):
        return jsonify({"error": "photo_url, latitude, longitude required"}), 400

    # Enrich details
    place_name, full_address, description, tags, tags_str, best_time, crowd_level, safety_note, rating, submitted_by = enrich_photo_details(photo_url, float(latitude), float(longitude))

    # Store in DB
    photo = Photo(
        photo_url=photo_url,
        latitude=float(latitude),
        longitude=float(longitude),
        vibes=tags_str,
        timestamp=datetime.datetime.fromisoformat(timestamp) if timestamp else datetime.datetime.utcnow(),
        place_name=place_name,
        full_address=full_address,
        description=description,
        best_time=best_time,
        crowd_level=crowd_level,
        safety_notes=safety_note,
        rating=rating,
        submitted_by=submitted_by
    )
    db.session.add(photo)
    db.session.commit()

    return jsonify({"message": "Photo added", "tags": tags, "place_name": place_name, "description": description, "best_time": best_time, "crowd_level": crowd_level, "safety_notes": safety_note, "rating": rating, "submitted_by": submitted_by}), 201

@app.route('/photos_nearby', methods=['GET'])
def photos_nearby():
    try:
        latitude = float(request.args.get('latitude'))
        longitude = float(request.args.get('longitude'))
        radius = float(request.args.get('radius', 2))  # default 2km
        vibe = request.args.get('vibe')
    except Exception:
        return jsonify({"error": "latitude, longitude, radius required"}), 400

    photos = Photo.query.all()
    results = []
    for photo in photos:
        dist = haversine(latitude, longitude, photo.latitude, photo.longitude)
        if dist <= radius:
            if vibe:
                if vibe.lower() not in [v.strip().lower() for v in photo.vibes.split(',')]:
                    continue
            results.append({
                "photo_url": photo.photo_url,
                "latitude": photo.latitude,
                "longitude": photo.longitude,
                "vibes": photo.vibes.split(','),
                "timestamp": photo.timestamp.isoformat(),
                "distance_km": dist
            })
    return jsonify({"photos": results})

@app.route('/classify', methods=['POST'])
def classify():
    data = request.json
    image_url = data.get('image_url')
    if not image_url:
        return jsonify({"error": "No image_url provided"}), 400

    # Download image
    response = requests.get(image_url, stream=True)
    image = Image.open(response.raw).convert("RGB")

    # Prepare inputs for CLIP
    inputs = clip_processor(
        text=CANDIDATE_TAGS,
        images=image,
        return_tensors="pt",
        padding=True
    )

    # Run CLIP
    with torch.no_grad():
        outputs = clip_model(**inputs)
        logits_per_image = outputs.logits_per_image
        probs = logits_per_image.softmax(dim=1).cpu().numpy()[0]

    # Get top 3 tags
    top_indices = probs.argsort()[-3:][::-1]
    tags = [CANDIDATE_TAGS[i] for i in top_indices]

    return jsonify({"tags": tags})

@app.route('/fetch_mapillary_photos', methods=['POST'])
def fetch_mapillary_photos():
    data = request.json
    latitude = data.get('latitude')
    longitude = data.get('longitude')
    radius = data.get('radius', 2)  # in km
    if not all([latitude, longitude]):
        return jsonify({"error": "latitude and longitude required"}), 400
    try:
        lat = float(latitude)
        lon = float(longitude)
        radius = float(radius)
    except Exception:
        return jsonify({"error": "Invalid latitude/longitude/radius"}), 400

    # Mapillary API: search images near location
    delta = radius / 111  # ~1 deg lat ~111km
    min_lat = lat - delta
    max_lat = lat + delta
    min_lon = lon - delta
    max_lon = lon + delta
    bbox = f"{min_lon},{min_lat},{max_lon},{max_lat}"
    url = f"https://graph.mapillary.com/images?access_token={MAPILLARY_ACCESS_TOKEN}&fields=id,thumb_1024_url,geometry&bbox={bbox}&limit=20"
    resp = requests.get(url)
    if resp.status_code != 200:
        return jsonify({"error": "Failed to fetch from Mapillary", "details": resp.text}), 500
    data = resp.json()
    images = data.get('data', [])
    new_photos = []
    for img in images:
        img_id = img.get('id')
        img_url = img.get('thumb_1024_url')
        geom = img.get('geometry', {})
        coords = geom.get('coordinates', [])
        if not (img_url and coords and len(coords) == 2):
            continue
        lon, lat = coords[0], coords[1]
        # Check if already in DB
        exists = Photo.query.filter_by(photo_url=img_url).first()
        if exists:
            continue
        # Enrich details
        place_name, full_address, description, tags, tags_str, best_time, crowd_level, safety_note, rating, submitted_by = enrich_photo_details(img_url, float(lat), float(lon))
        # Store in DB
        photo = Photo(
            photo_url=img_url,
            latitude=float(lat),
            longitude=float(lon),
            vibes=tags_str,
            timestamp=datetime.datetime.utcnow(),
            place_name=place_name,
            full_address=full_address,
            description=description,
            best_time=best_time,
            crowd_level=crowd_level,
            safety_notes=safety_note,
            rating=rating,
            submitted_by=submitted_by
        )
        db.session.add(photo)
        db.session.commit()
        new_photos.append({
            "photo_url": img_url,
            "latitude": lat,
            "longitude": lon,
            "vibes": tags,
            "place_name": place_name,
            "description": description,
            "best_time": best_time,
            "crowd_level": crowd_level,
            "safety_notes": safety_note,
            "rating": rating,
            "submitted_by": submitted_by
        })
        time.sleep(0.2)
    return jsonify({"new_photos": new_photos, "count": len(new_photos)})

@app.route('/place_details', methods=['POST'])
def place_details():
    data = request.json
    latitude = data.get('latitude')
    longitude = data.get('longitude')
    photo_url = data.get('photo_url')
    if not all([latitude, longitude, photo_url]):
        return jsonify({'error': 'latitude, longitude, and photo_url required'}), 400

    # Try to find cached entry
    photo = Photo.query.filter_by(photo_url=photo_url, latitude=latitude, longitude=longitude).first()
    if photo and photo.place_name and photo.description and photo.vibes:
        return jsonify({
            'place_name': photo.place_name,
            'full_address': photo.full_address,
            'description': photo.description,
            'vibes': photo.vibes.split(','),
            'rating': photo.rating,
            'best_time': photo.best_time,
            'crowd_level': photo.crowd_level,
            'safety_notes': photo.safety_notes,
            'submitted_by': photo.submitted_by
        })

    # 1. Get place name from Nominatim
    def get_place_name_nominatim(lat, lon):
        try:
            url = f'https://nominatim.openstreetmap.org/reverse?format=json&lat={lat}&lon={lon}&zoom=16&addressdetails=1'
            headers = {'User-Agent': 'SnapSphere/1.0'}
            resp = requests.get(url, headers=headers, timeout=5)
            if resp.status_code == 200:
                data = resp.json()
                display_name = data.get('display_name')
                if display_name:
                    # Short name: first part before comma
                    short_name = display_name.split(',')[0].strip()
                    return short_name, display_name
        except Exception as e:
            pass
        return None, None

    place_name, full_address = get_place_name_nominatim(latitude, longitude)

    # 2. If Nominatim fails, fallback to AI (stub for now)
    if not place_name:
        place_name = f"Scenic Spot near ({latitude:.4f}, {longitude:.4f})"
        full_address = place_name

    # Use the enrich_photo_details function to get all details including rating
    place_name, full_address, description, tags, tags_str, best_time, crowd_level, safety_note, rating, submitted_by = enrich_photo_details(photo_url, float(latitude), float(longitude))

    # 5. Cache/store in DB
    if not photo:
        photo = Photo(
            photo_url=photo_url,
            latitude=latitude,
            longitude=longitude,
            vibes=tags_str,
            place_name=place_name,
            full_address=full_address,
            description=description,
            best_time=best_time,
            crowd_level=crowd_level,
            safety_notes=safety_note,
            rating=rating,
            submitted_by=submitted_by
        )
        db.session.add(photo)
    else:
        photo.place_name = place_name
        photo.full_address = full_address
        photo.description = description
        photo.vibes = tags_str
        photo.best_time = best_time
        photo.crowd_level = crowd_level
        photo.safety_notes = safety_note
        photo.rating = rating
        photo.submitted_by = submitted_by
    db.session.commit()

    return jsonify({
        'place_name': place_name,
        'full_address': full_address,
        'description': description,
        'vibes': tags,
        'rating': rating,
        'best_time': best_time,
        'crowd_level': crowd_level,
        'safety_notes': safety_note,
        'submitted_by': submitted_by
    })

# Authentication functions
def encode_auth_token(user_id):
    return jwt.encode({'user_id': user_id}, app.config['SECRET_KEY'], algorithm='HS256')

def decode_auth_token(token):
    try:
        payload = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        return payload['user_id']
    except Exception:
        return None

@app.route('/register', methods=['POST'])
def register():
    data = request.json
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    
    if not all([name, email, password]):
        return jsonify({'error': 'Name, email, and password required'}), 400
    
    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already registered'}), 400
    
    user = User(name=name, email=email, password_hash=generate_password_hash(password))
    db.session.add(user)
    db.session.commit()
    
    token = encode_auth_token(user.id)
    return jsonify({'token': token, 'name': user.name, 'email': user.email}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    
    if not all([email, password]):
        return jsonify({'error': 'Email and password required'}), 400
    
    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({'error': 'Invalid credentials'}), 401
    
    token = encode_auth_token(user.id)
    return jsonify({'token': token, 'name': user.name, 'email': user.email}), 200

@app.route('/me', methods=['GET'])
def me():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'Missing or invalid token'}), 401
    
    token = auth_header.split(' ')[1]
    user_id = decode_auth_token(token)
    if not user_id:
        return jsonify({'error': 'Invalid token'}), 401
    
    user = db.session.get(User, user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify({'id': user.id, 'name': user.name, 'email': user.email}), 200

# ===== NEW FEATURE ENDPOINTS =====

# Moodboard endpoints
@app.route('/moodboards', methods=['GET'])
def get_moodboards():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'Missing or invalid token'}), 401
    
    token = auth_header.split(' ')[1]
    user_id = decode_auth_token(token)
    if not user_id:
        return jsonify({'error': 'Invalid token'}), 401
    
    moodboards = Moodboard.query.filter_by(user_id=user_id).order_by(Moodboard.updated_at.desc()).all()
    return jsonify({
        'moodboards': [{
            'id': mb.id,
            'name': mb.name,
            'description': mb.description,
            'theme': mb.theme,
            'created_at': mb.created_at.isoformat(),
            'updated_at': mb.updated_at.isoformat(),
            'is_public': mb.is_public,
            'item_count': len(mb.items)
        } for mb in moodboards]
    })

@app.route('/moodboards', methods=['POST'])
def create_moodboard():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'Missing or invalid token'}), 401
    
    token = auth_header.split(' ')[1]
    user_id = decode_auth_token(token)
    if not user_id:
        return jsonify({'error': 'Invalid token'}), 401
    
    data = request.json
    name = data.get('name')
    description = data.get('description', '')
    theme = data.get('theme', '')
    is_public = data.get('is_public', False)
    
    if not name:
        return jsonify({'error': 'Name is required'}), 400
    
    moodboard = Moodboard(
        user_id=user_id,
        name=name,
        description=description,
        theme=theme,
        is_public=is_public
    )
    db.session.add(moodboard)
    db.session.commit()
    
    return jsonify({
        'id': moodboard.id,
        'name': moodboard.name,
        'description': moodboard.description,
        'theme': moodboard.theme,
        'created_at': moodboard.created_at.isoformat(),
        'updated_at': moodboard.updated_at.isoformat(),
        'is_public': moodboard.is_public
    }), 201

@app.route('/moodboards/<int:moodboard_id>', methods=['GET'])
def get_moodboard(moodboard_id):
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'Missing or invalid token'}), 401
    
    token = auth_header.split(' ')[1]
    user_id = decode_auth_token(token)
    if not user_id:
        return jsonify({'error': 'Invalid token'}), 401
    
    moodboard = Moodboard.query.filter_by(id=moodboard_id, user_id=user_id).first()
    if not moodboard:
        return jsonify({'error': 'Moodboard not found'}), 404
    
    return jsonify({
        'id': moodboard.id,
        'name': moodboard.name,
        'description': moodboard.description,
        'theme': moodboard.theme,
        'created_at': moodboard.created_at.isoformat(),
        'updated_at': moodboard.updated_at.isoformat(),
        'is_public': moodboard.is_public,
        'items': [{
            'id': item.id,
            'image_url': item.image_url,
            'caption': item.caption,
            'vibes': item.vibes.split(',') if item.vibes else [],
            'position_x': item.position_x,
            'position_y': item.position_y,
            'width': item.width,
            'height': item.height,
            'created_at': item.created_at.isoformat()
        } for item in moodboard.items]
    })

@app.route('/moodboards/<int:moodboard_id>/items', methods=['POST'])
def add_moodboard_item(moodboard_id):
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'Missing or invalid token'}), 401
    
    token = auth_header.split(' ')[1]
    user_id = decode_auth_token(token)
    if not user_id:
        return jsonify({'error': 'Invalid token'}), 401
    
    moodboard = Moodboard.query.filter_by(id=moodboard_id, user_id=user_id).first()
    if not moodboard:
        return jsonify({'error': 'Moodboard not found'}), 404
    
    data = request.json
    image_url = data.get('image_url')
    caption = data.get('caption', '')
    vibes = data.get('vibes', [])
    position_x = data.get('position_x', 0)
    position_y = data.get('position_y', 0)
    width = data.get('width', 200)
    height = data.get('height', 200)
    
    if not image_url:
        return jsonify({'error': 'Image URL is required'}), 400
    
    # Analyze image for vibes if not provided
    if not vibes:
        try:
            response = requests.get(image_url, stream=True)
            image = Image.open(response.raw).convert("RGB")
            inputs = clip_processor(
                text=CANDIDATE_TAGS,
                images=image,
                return_tensors="pt",
                padding=True
            )
            with torch.no_grad():
                outputs = clip_model(**inputs)
                logits_per_image = outputs.logits_per_image
                probs = logits_per_image.softmax(dim=1).cpu().numpy()[0]
            top_indices = probs.argsort()[-3:][::-1]
            vibes = [CANDIDATE_TAGS[i] for i in top_indices]
        except Exception:
            vibes = ['unique']
    
    item = MoodboardItem(
        moodboard_id=moodboard_id,
        image_url=image_url,
        caption=caption,
        vibes=','.join(vibes),
        position_x=position_x,
        position_y=position_y,
        width=width,
        height=height
    )
    db.session.add(item)
    db.session.commit()
    
    return jsonify({
        'id': item.id,
        'image_url': item.image_url,
        'caption': item.caption,
        'vibes': vibes,
        'position_x': item.position_x,
        'position_y': item.position_y,
        'width': item.width,
        'height': item.height,
        'created_at': item.created_at.isoformat()
    }), 201

# AI Vibe Classification endpoints
@app.route('/analyze_vibe', methods=['POST'])
def analyze_vibe():
    
    data = request.json
    image_url = data.get('image_url')
    
    if not image_url:
        return jsonify({'error': 'Image URL is required'}), 400
    
    try:
        # Handle data URLs (base64 encoded images)
        if image_url.startswith('data:image'):
            import base64
            # Extract base64 data from data URL
            header, encoded = image_url.split(",", 1)
            image_data = base64.b64decode(encoded)
            
            # Create PIL image from bytes
            from io import BytesIO
            image = Image.open(BytesIO(image_data)).convert("RGB")
        else:
            # Download and analyze image from URL
            response = requests.get(image_url, stream=True)
            image = Image.open(response.raw).convert("RGB")
        
        # Ensure image is properly sized and formatted
        image = image.resize((224, 224))  # Standard size for CLIP
        
        # CLIP analysis
        inputs = clip_processor(
            text=CANDIDATE_TAGS,
            images=image,
            return_tensors="pt",
            padding=True
        )
        with torch.no_grad():
            outputs = clip_model(**inputs)
            logits_per_image = outputs.logits_per_image
            probs = logits_per_image.softmax(dim=1).cpu().numpy()[0]
        
        # Get top vibes
        top_indices = probs.argsort()[-5:][::-1]
        primary_vibe = CANDIDATE_TAGS[top_indices[0]]
        secondary_vibes = [CANDIDATE_TAGS[i] for i in top_indices[1:]]
        confidence_score = float(probs[top_indices[0]])
        
        # Generate color palette (simplified)
        color_palette = ["#000000", "#ffffff", "#cccccc", "#999999", "#666666"]
        
        # Calculate mood score (simplified)
        mood_score = min(confidence_score + 0.2, 1.0)
        
        # Generate style tags
        style_tags = []
        if confidence_score > 0.7:
            style_tags.append('high_contrast')
        if 'nature' in primary_vibe.lower():
            style_tags.extend(['organic', 'natural'])
        if 'urban' in primary_vibe.lower():
            style_tags.extend(['city', 'modern'])
        if 'vintage' in primary_vibe.lower():
            style_tags.extend(['retro', 'nostalgic'])
        
        return jsonify({
            'primary_vibe': primary_vibe,
            'secondary_vibes': secondary_vibes,
            'confidence_score': confidence_score,
            'color_palette': color_palette,
            'mood_score': mood_score,
            'style_tags': style_tags
        })
        
    except Exception as e:
        return jsonify({'error': f'Failed to analyze image: {str(e)}'}), 500

# AI Captions endpoints
@app.route('/generate_caption', methods=['POST'])
def generate_caption():
    
    data = request.json
    image_url = data.get('image_url')
    style = data.get('style', 'casual')
    mood = data.get('mood', 'happy')
    
    if not image_url:
        return jsonify({'error': 'Image URL is required'}), 400
    
    try:
        # Handle data URLs (base64 encoded images)
        if image_url.startswith('data:image'):
            import base64
            # Extract base64 data from data URL
            header, encoded = image_url.split(",", 1)
            image_data = base64.b64decode(encoded)
            
            # Create PIL image from bytes
            from io import BytesIO
            image = Image.open(BytesIO(image_data)).convert("RGB")
        else:
            # Download and analyze image from URL
            response = requests.get(image_url, stream=True)
            image = Image.open(response.raw).convert("RGB")
        
        # Ensure image is properly sized and formatted
        image = image.resize((224, 224))  # Standard size for CLIP
        
        # CLIP analysis for vibe detection
        try:
            inputs = clip_processor(
                text=CANDIDATE_TAGS,
                images=image,
                return_tensors="pt",
                padding=True
            )
            with torch.no_grad():
                outputs = clip_model(**inputs)
                logits_per_image = outputs.logits_per_image
                probs = logits_per_image.softmax(dim=1).cpu().numpy()[0]
        except Exception as clip_error:
            print(f"CLIP processing error: {clip_error}")
            # Fallback to default vibes
            detected_vibes = ['nature', 'peaceful', 'calm']
            return jsonify({
                'caption': "Living my best life! 🌟 This moment is everything I needed today.",
                'hashtags': ['#nature', '#peaceful', '#calm', '#goodvibes', '#lifestyle', '#daily', '#happy', '#positive', '#joy'],
                'detected_vibes': detected_vibes,
                'style': style,
                'mood': mood
            })
        
        # Get detected vibes
        top_indices = probs.argsort()[-3:][::-1]
        detected_vibes = [CANDIDATE_TAGS[i] for i in top_indices]
        
        # Generate caption based on style and mood
        caption_templates = {
            'casual': [
                f"Living my best {detected_vibes[0]} life ✨",
                f"Found this {detected_vibes[0]} spot and I'm obsessed!",
                f"Can't get enough of these {detected_vibes[0]} vibes",
                f"Today's mood: {detected_vibes[0]} and {detected_vibes[1]}",
                f"Exploring the {detected_vibes[0]} side of life"
            ],
            'professional': [
                f"Capturing the essence of {detected_vibes[0]} in this composition",
                f"A study in {detected_vibes[0]} and {detected_vibes[1]} aesthetics",
                f"The interplay of light and {detected_vibes[0]} elements",
                f"Documenting the {detected_vibes[0]} character of this location",
                f"An exploration of {detected_vibes[0]} visual narratives"
            ],
            'creative': [
                f"✨ {detected_vibes[0].upper()} MAGIC ✨",
                f"Where {detected_vibes[0]} meets {detected_vibes[1]} and dreams come true",
                f"Lost in a {detected_vibes[0]} daydream",
                f"Channeling {detected_vibes[0]} energy today",
                f"✨ {detected_vibes[0]} vibes only ✨"
            ]
        }
        
        caption = random.choice(caption_templates.get(style, caption_templates['casual']))
        
        # Generate hashtags
        hashtags = [f"#{vibe}" for vibe in detected_vibes[:3]] + [
            "#photography", "#snapsphere", "#photooftheday", "#instagood"
        ]
        
        return jsonify({
            'caption': caption,
            'hashtags': hashtags,
            'style': style,
            'mood': mood,
            'vibes': detected_vibes
        })
        
    except Exception as e:
        return jsonify({'error': f'Failed to generate caption: {str(e)}'}), 500

# Smart Recommendations endpoints
@app.route('/smart_recommendations', methods=['POST'])
def get_smart_recommendations():
    
    data = request.json
    latitude = data.get('latitude')
    longitude = data.get('longitude')
    weather = data.get('weather', 'clear')
    time_of_day = data.get('time_of_day', 'daylight')
    user_preferences = data.get('preferences', {})
    
    if not all([latitude, longitude]):
        return jsonify({'error': 'Latitude and longitude are required'}), 400
    
    try:
        # Get photos from the main database (existing map photos)
        photos = Photo.query.all()
        recommendations = []
        seen_places = set()  # Track unique place names
        
        print(f"Total photos in database: {len(photos)}")
        print(f"Searching near coordinates: {latitude}, {longitude}")
        
        for photo in photos:
            # Calculate distance from user location
            dist = haversine(latitude, longitude, photo.latitude, photo.longitude)
            
            # Only include photos within 10km radius
            if dist <= 10:
                # Parse vibes from comma-separated string
                vibes = [v.strip() for v in photo.vibes.split(',')] if photo.vibes else []
                
                # Skip if we've already seen this place name (deduplication)
                place_name = photo.place_name or 'Unknown Location'
                if place_name in seen_places:
                    print(f"Skipping duplicate place: {place_name}")
                    continue
                seen_places.add(place_name)
                
                print(f"Adding recommendation: {place_name} at {dist:.1f}km")
                
                # Determine priority based on weather and time matching
                priority = 'normal'
                if weather == 'clear' and time_of_day == 'golden_hour':
                    if 'nature' in vibes or 'peaceful' in vibes:
                        priority = 'high'
                elif weather == 'sunny' and time_of_day == 'daylight':
                    if 'urban' in vibes or 'modern' in vibes:
                        priority = 'high'
                
                recommendation = {
                    'id': photo.id,
                    'photo_url': photo.photo_url,
                    'place_name': place_name,
                    'description': photo.description or 'Beautiful photo spot with great views',
                    'vibes': vibes,
                    'best_time': photo.best_time or 'daylight',
                    'crowd_level': photo.crowd_level or 'medium',
                    'rating': photo.rating or 4.5,
                    'distance_km': round(dist, 1),
                    'priority': priority
                }
                recommendations.append(recommendation)
        
        # Sort by distance and priority
        recommendations.sort(key=lambda x: (x['priority'] != 'high', x['distance_km']))
        

        
        # Return top 5 unique recommendations
        return jsonify(recommendations[:5])
    except Exception as e:
        return jsonify({'error': f'Failed to get recommendations: {str(e)}'}), 500

@app.route('/update_ratings', methods=['POST'])
def update_ratings():
    """Update existing photos with ratings if they don't have them"""
    try:
        # Get all photos without ratings
        photos_without_ratings = Photo.query.filter_by(rating=None).all()
        updated_count = 0
        
        for photo in photos_without_ratings:
            # Generate random rating
            rating = round(random.uniform(4.5, 4.9), 1)
            photo.rating = rating
            updated_count += 1
        
        db.session.commit()
        return jsonify({'message': f'Updated {updated_count} photos with ratings'}), 200
    except Exception as e:
        return jsonify({'error': f'Failed to update ratings: {str(e)}'}), 500



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=False) 