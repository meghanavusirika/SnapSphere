# 🚀 SnapSphere Setup Guide

## 📋 Quick Start (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm start
```

### 3. Open Browser
Go to `http://localhost:3000`

**That's it!** The app will work with sample data immediately.

---

## 🔑 API Keys Setup (Optional - for real data)

### Google Maps API Key (Required for map)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable "Maps JavaScript API"
4. Create credentials (API Key)
5. Add to `.env.local`:
```
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### Unsplash API Key (For real photos)
1. Go to [Unsplash Developers](https://unsplash.com/developers)
2. Create an app
3. Get your Access Key
4. Add to `.env.local`:
```
REACT_APP_UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
```

### Flickr API Key (For Flickr photos)
1. Go to [Flickr App Garden](https://www.flickr.com/services/apps/create/)
2. Create a new app
3. Get your API Key
4. Add to `.env.local`:
```
REACT_APP_FLICKR_API_KEY=your_flickr_api_key_here
```

### Instagram API (Advanced - Optional)
1. Requires Instagram Basic Display API setup
2. More complex setup process
3. Add to `.env.local`:
```
REACT_APP_INSTAGRAM_ACCESS_TOKEN=your_instagram_access_token_here
```

---

## 📁 File Structure

```
SnapSphere/
├── src/
│   ├── components/
│   │   ├── HomePage.tsx          # Beautiful landing page
│   │   └── AestheticMap.tsx      # Main map feature
│   ├── App.tsx                   # Main app component
│   ├── index.tsx                 # Entry point
│   └── index.css                 # Styles
├── public/
│   └── index.html               # HTML template
├── package.json                 # Dependencies
├── tailwind.config.js          # Tailwind configuration
└── .env.local                  # API keys (create this)
```

---

## 🎯 Features Included

### ✅ Aesthetic Map Overlay
- Google Maps integration
- Vibe-based filtering (Vintage, Urban, Nature, etc.)
- Interactive photo spot markers
- Real-time API data fetching
- User location detection

### ✅ Beautiful Homepage
- Feature showcase
- Animated sections
- Professional design
- Mobile responsive

### ✅ API Integrations
- Unsplash (real photos)
- Flickr (community photos)
- Instagram (social media)
- Fallback to sample data

### ✅ Professional UI/UX
- Smooth animations
- Modern design
- Loading states
- Error handling

---

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)
1. Push code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables
5. Deploy!

### Option 2: Netlify
1. Push code to GitHub
2. Go to [Netlify](https://netlify.com)
3. Import your repository
4. Add environment variables
5. Deploy!

### Option 3: GitHub Pages
```bash
npm run build
# Upload build folder to GitHub Pages
```

---

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Required
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key

# Optional - for real data
REACT_APP_UNSPLASH_ACCESS_KEY=your_unsplash_key
REACT_APP_FLICKR_API_KEY=your_flickr_key
REACT_APP_INSTAGRAM_ACCESS_TOKEN=your_instagram_token
```

---

## 🎨 Customization

### Colors
Edit `tailwind.config.js`:
```javascript
colors: {
  primary: {
    500: '#ed5aff',  // Main purple
    600: '#d926da',  // Darker purple
  }
}
```

### Sample Data
Edit `src/components/AestheticMap.tsx`:
```javascript
const samplePhotoSpots = [
  // Add your own photo spots here
];
```

### Vibe Filters
Edit the `vibeOptions` array in `AestheticMap.tsx`:
```javascript
const vibeOptions = [
  { id: 'your-vibe', label: 'Your Vibe', icon: '🎨' }
];
```

---

## 🐛 Troubleshooting

### "Google Maps not loading"
- Check your Google Maps API key
- Make sure Maps JavaScript API is enabled
- Check browser console for errors

### "APIs not working"
- Verify API keys are correct
- Check network tab for API errors
- App will fallback to sample data

### "Build errors"
```bash
npm install
npm start
```

### "Port already in use"
```bash
# Kill existing process
pkill -f "react-scripts start"
# Or use different port
PORT=3001 npm start
```

---

## 📱 Demo Script

1. **"This is SnapSphere - a smart photo spot finder"**
2. **"It integrates with multiple APIs to find real photo locations"**
3. **"Watch as it fetches data from Unsplash, Flickr, and Instagram"**
4. **"The AI automatically classifies photos by vibe"**
5. **"Users can filter by aesthetic preferences"**
6. **"Each spot shows real photos and community ratings"**

---

## 🏆 Hackathon Tips

### Before Demo
- Test all features
- Prepare API keys
- Practice demo script
- Check mobile responsiveness

### During Demo
- Start with homepage
- Show map functionality
- Demonstrate API integration
- Highlight technical features

### After Demo
- Be ready for questions
- Explain technical decisions
- Show code structure
- Discuss future features

---

## 📞 Support

If you have issues:
1. Check the troubleshooting section
2. Look at browser console for errors
3. Verify all API keys are correct
4. Make sure all dependencies are installed

**Good luck with your hackathon! 🚀** 