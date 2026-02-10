# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies

**Backend (Python):**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

**Frontend (Node.js):**
```bash
cd frontend
npm install
```

### Step 2: Start the Application

**Option A - Use the startup script (Recommended):**

On Linux/Mac:
```bash
./start.sh
```

On Windows:
```bash
start.bat
```

**Option B - Start manually:**

Terminal 1 (Backend):
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python app.py
```

Terminal 2 (Frontend):
```bash
cd frontend
npm run dev
```

### Step 3: Use the Application

1. Open http://localhost:3000 in your browser
2. Click on any template to start editing
3. Customize your post (text, colors, fonts)
4. Download or save your creation!

## 📱 Features at a Glance

- **10 Templates**: Minimalist, Vibrant, Gradient, Corporate, Nature, Retro, Dark, Pastel, Neon, Elegant
- **Full Customization**: Edit content, colors, and fonts
- **Live Preview**: See changes in real-time
- **Download**: Export as 1080x1080px PNG
- **Save**: Store posts locally or to backend

## 🎨 How to Create a Post

1. **Browse Templates**: Scroll through the gallery and click one you like
2. **Edit Content**: Type your message and optionally add an author
3. **Customize Colors**: Pick background, text, and accent colors
4. **Choose Font**: Select from 8 different font families
5. **Preview**: Watch your changes appear in real-time
6. **Download**: Click "Download Post" to get your PNG
7. **Save**: Click "Save Post" to store it

## 💡 Tips

- Keep messages concise for better readability
- Use high contrast between text and background
- Match accent colors with your brand
- Try different templates for different occasions
- Experiment with font combinations

## 🐛 Common Issues

**Can't connect to backend?**
- Make sure Flask is running on port 5000
- Check that you installed Python dependencies

**Frontend won't start?**
- Run `npm install` in the frontend directory
- Delete `node_modules` and reinstall if needed

**Download not working?**
- Check browser permissions for downloads
- Try a different browser (Chrome recommended)

## 📚 Next Steps

- Read the full README.md for detailed documentation
- Customize templates in `backend/app.py`
- Modify styles in `frontend/src/App.css`
- Add your own features!

---

Need help? Check the README.md or create an issue on GitHub.
