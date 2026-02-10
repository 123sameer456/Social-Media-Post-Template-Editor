from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import json
import os
from datetime import datetime
import base64
from io import BytesIO

app = Flask(__name__)
CORS(app)

# Predefined social media post templates with different styles
TEMPLATES = [
    {
        "id": 1,
        "style": "minimalist",
        "title": "Minimalist Quote",
        "content": "Design is not just what it looks like. Design is how it works.",
        "author": "Steve Jobs",
        "backgroundColor": "#FAFAFA",
        "textColor": "#1A1A1A",
        "accentColor": "#E5E5E5",
        "fontFamily": "Georgia, serif",
        "layout": "centered"
    },
    {
        "id": 2,
        "style": "vibrant",
        "title": "Vibrant Announcement",
        "content": "🚀 Exciting News! We're launching something amazing next week.",
        "author": "",
        "backgroundColor": "#FF6B6B",
        "textColor": "#FFFFFF",
        "accentColor": "#FFE66D",
        "fontFamily": "Arial, sans-serif",
        "layout": "bold"
    },
    {
        "id": 3,
        "style": "gradient",
        "title": "Gradient Inspiration",
        "content": "Believe you can and you're halfway there.",
        "author": "Theodore Roosevelt",
        "backgroundColor": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        "textColor": "#FFFFFF",
        "accentColor": "#FFD700",
        "fontFamily": "Helvetica, sans-serif",
        "layout": "overlay"
    },
    {
        "id": 4,
        "style": "corporate",
        "title": "Corporate Update",
        "content": "Q4 Results: Revenue up 45% year-over-year. Thank you to our amazing team!",
        "author": "",
        "backgroundColor": "#1E3A8A",
        "textColor": "#FFFFFF",
        "accentColor": "#60A5FA",
        "fontFamily": "Arial, sans-serif",
        "layout": "professional"
    },
    {
        "id": 5,
        "style": "nature",
        "title": "Nature Vibes",
        "content": "In every walk with nature, one receives far more than he seeks.",
        "author": "John Muir",
        "backgroundColor": "#2D5016",
        "textColor": "#F0FDF4",
        "accentColor": "#86EFAC",
        "fontFamily": "Georgia, serif",
        "layout": "organic"
    },
    {
        "id": 6,
        "style": "retro",
        "title": "Retro Post",
        "content": "Good vibes only ✌️ Bringing back the classics",
        "author": "",
        "backgroundColor": "#FCD34D",
        "textColor": "#7C2D12",
        "accentColor": "#DC2626",
        "fontFamily": "Courier New, monospace",
        "layout": "vintage"
    },
    {
        "id": 7,
        "style": "dark",
        "title": "Dark Mode",
        "content": "The future belongs to those who believe in the beauty of their dreams.",
        "author": "Eleanor Roosevelt",
        "backgroundColor": "#0A0A0A",
        "textColor": "#FAFAFA",
        "accentColor": "#3B82F6",
        "fontFamily": "system-ui, sans-serif",
        "layout": "sleek"
    },
    {
        "id": 8,
        "style": "pastel",
        "title": "Pastel Dream",
        "content": "Create the things you wish existed 💭",
        "author": "",
        "backgroundColor": "#FDE1E7",
        "textColor": "#374151",
        "accentColor": "#C084FC",
        "fontFamily": "Trebuchet MS, sans-serif",
        "layout": "soft"
    },
    {
        "id": 9,
        "style": "neon",
        "title": "Neon Glow",
        "content": "Dream big. Work hard. Stay focused.",
        "author": "",
        "backgroundColor": "#1A1A2E",
        "textColor": "#00FF9F",
        "accentColor": "#FF006E",
        "fontFamily": "Impact, sans-serif",
        "layout": "electric"
    },
    {
        "id": 10,
        "style": "elegant",
        "title": "Elegant Serif",
        "content": "Simplicity is the ultimate sophistication.",
        "author": "Leonardo da Vinci",
        "backgroundColor": "#F8F7F4",
        "textColor": "#2C2C2C",
        "accentColor": "#B8860B",
        "fontFamily": "Palatino, serif",
        "layout": "refined"
    }
]

@app.route('/api/templates', methods=['GET'])
def get_templates():
    """Get all available templates"""
    return jsonify(TEMPLATES)

@app.route('/api/templates/<int:template_id>', methods=['GET'])
def get_template(template_id):
    """Get a specific template by ID"""
    template = next((t for t in TEMPLATES if t['id'] == template_id), None)
    if template:
        return jsonify(template)
    return jsonify({"error": "Template not found"}), 404

@app.route('/api/save', methods=['POST'])
def save_post():
    """Save a customized post (in a real app, this would save to a database)"""
    data = request.json
    # In a real application, you would save this to a database
    # For now, we'll just return success
    return jsonify({
        "success": True,
        "message": "Post saved successfully",
        "data": data
    })

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
