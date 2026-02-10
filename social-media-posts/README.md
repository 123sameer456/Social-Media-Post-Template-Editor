# PostCraft - Social Media Post Generator

A full-stack application for creating stunning social media posts with customizable templates. Built with React and Flask.

## Features

✨ **10 Pre-designed Templates** with different styles (minimalist, vibrant, gradient, corporate, nature, retro, dark, pastel, neon, elegant)

🎨 **Full Customization**:
- Edit content and author
- Customize colors (background, text, accent)
- Choose from 8 different font families
- Live preview of changes

📥 **Download & Save**:
- Download posts as PNG images (1080x1080px)
- Save posts to backend or local storage
- High-quality canvas rendering

🎯 **Intuitive Interface**:
- Template gallery with hover effects
- Side-by-side editor and preview
- Responsive design for all devices
- Beautiful animations and transitions

## Tech Stack

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **Custom CSS** - Distinctive design with animations
- **HTML Canvas API** - Image generation

### Backend
- **Flask** - Python web framework
- **Flask-CORS** - Cross-origin resource sharing
- **Pillow** - Image processing (optional)

## Project Structure

```
social-media-posts/
├── backend/
│   ├── app.py              # Flask API server
│   └── requirements.txt    # Python dependencies
│
├── frontend/
│   ├── public/
│   │   └── index.html      # HTML template
│   ├── src/
│   │   ├── App.jsx         # Main React component
│   │   ├── App.css         # Styles
│   │   └── index.jsx       # React entry point
│   ├── package.json        # Node dependencies
│   └── vite.config.js      # Vite configuration
│
└── README.md
```

## Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment (recommended):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the Flask server:
```bash
python app.py
```

The backend will start on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:3000`

## Usage

### Browsing Templates

1. Open the application in your browser
2. Browse through 10 different template styles
3. Click on any template to start editing

### Editing a Post

1. **Content**: Edit the main message text
2. **Author**: Add an optional author name
3. **Background Color**: Choose the post background
4. **Text Color**: Set the text color
5. **Accent Color**: Pick an accent color for decorative elements
6. **Font Family**: Select from 8 different fonts

### Live Preview

- See changes in real-time in the preview panel
- The preview shows exactly how your post will look

### Downloading

1. Click the "📥 Download Post" button
2. The post will be generated as a 1080x1080px PNG image
3. The image will be automatically downloaded to your device

### Saving

1. Click the "💾 Save Post" button
2. If the backend is running, it will save to the API
3. Otherwise, it saves to browser local storage

## API Endpoints

### GET `/api/templates`
Returns all available templates

**Response:**
```json
[
  {
    "id": 1,
    "style": "minimalist",
    "title": "Minimalist Quote",
    "content": "Design is not just what it looks like...",
    "author": "Steve Jobs",
    "backgroundColor": "#FAFAFA",
    "textColor": "#1A1A1A",
    "accentColor": "#E5E5E5",
    "fontFamily": "Georgia, serif",
    "layout": "centered"
  }
]
```

### GET `/api/templates/:id`
Returns a specific template by ID

### POST `/api/save`
Saves a customized post

**Request Body:**
```json
{
  "content": "Your custom message",
  "author": "Author Name",
  "backgroundColor": "#FFFFFF",
  "textColor": "#000000",
  "accentColor": "#FF0000",
  "fontFamily": "Arial, sans-serif"
}
```

### GET `/health`
Health check endpoint

## Customization

### Adding New Templates

Edit `backend/app.py` and add new template objects to the `TEMPLATES` array:

```python
{
    "id": 11,
    "style": "custom",
    "title": "Custom Style",
    "content": "Your message here",
    "author": "Author",
    "backgroundColor": "#HEXCOLOR",
    "textColor": "#HEXCOLOR",
    "accentColor": "#HEXCOLOR",
    "fontFamily": "Font Name, fallback",
    "layout": "layout-style"
}
```

### Modifying Styles

Edit `frontend/src/App.css` to customize:
- Colors (CSS variables in `:root`)
- Animations
- Typography
- Layout and spacing

### Canvas Rendering

The canvas rendering logic is in the `downloadPost` function in `App.jsx`. You can customize:
- Image dimensions (default: 1080x1080)
- Text wrapping
- Font sizes
- Decorative elements

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Performance

- Templates load instantly
- Live preview updates in real-time
- Canvas rendering takes < 1 second
- Optimized animations with CSS transforms

## Future Enhancements

Potential features to add:
- User authentication
- Database storage for saved posts
- More template styles
- Image upload for backgrounds
- Social media direct sharing
- Template categories and filtering
- Multi-page posts
- Video post creation
- Batch editing

## Troubleshooting

### Backend not connecting
- Ensure Flask server is running on port 5000
- Check CORS settings if getting cross-origin errors
- Verify Python dependencies are installed

### Frontend issues
- Clear browser cache
- Check browser console for errors
- Ensure Node modules are installed
- Try `npm install` again

### Download not working
- Check browser download permissions
- Ensure canvas API is supported
- Try a different browser

## License

This project is open source and available under the MIT License.

## Credits

Built with ❤️ using React and Flask

**Design Features:**
- Custom fonts from Google Fonts (Syne, DM Mono, Crimson Pro)
- Gradient backgrounds with animation
- Glassmorphism effects
- Smooth transitions and micro-interactions
