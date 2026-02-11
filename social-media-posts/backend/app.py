from flask import Flask, jsonify, request
from flask_cors import CORS
import json
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Advanced templates with diverse visual styles
TEMPLATES = [
    {
        "id": 1,
        "style": "curved-wave",
        "title": "Wave Style",
        "content": 'Success is not final, "failure is not fatal": it is the courage to continue that counts.',
        "highlightColor": "#FFD700",
        "backgroundColor": "#1E293B",
        "textColor": "#FFFFFF",
        "accentColor": "#F97316",
        "fontFamily": "Georgia, serif",
        "logoPosition": "top-left",
        "companyEmail": "hello@company.com",
        "companyWebsite": "www.company.com",
        "showCTA": True,
        "ctaText": "Learn More",
        "ctaBackgroundColor": "#F97316",
        "ctaTextColor": "#FFFFFF",
        "backgroundImageOpacity": 0.3,
        "visualStyle": {
            "type": "wave",
            "waveColor": "#F97316",
            "wavePosition": "bottom",
            "waveHeight": 200
        }
    },
    {
        "id": 2,
        "style": "circle-accent",
        "title": "Circle Burst",
        "content": 'The only way to do "great work" is to love what you do.',
        "highlightColor": "#06B6D4",
        "backgroundColor": "#FFFFFF",
        "textColor": "#0F172A",
        "accentColor": "#06B6D4",
        "fontFamily": "Arial, sans-serif",
        "logoPosition": "top-right",
        "companyEmail": "contact@brand.com",
        "companyWebsite": "brand.com",
        "showCTA": True,
        "ctaText": "Get Started",
        "ctaBackgroundColor": "#0F172A",
        "ctaTextColor": "#FFFFFF",
        "backgroundImageOpacity": 0.2,
        "visualStyle": {
            "type": "circles",
            "circleColor": "#06B6D4",
            "circleOpacity": 0.15,
            "circleCount": 3
        }
    },
    {
        "id": 3,
        "style": "diagonal-split",
        "title": "Diagonal Split",
        "content": 'Innovation distinguishes between a "leader" and a "follower".',
        "highlightColor": "#FF006E",
        "backgroundColor": "#0A0A0A",
        "textColor": "#FAFAFA",
        "accentColor": "#FF006E",
        "fontFamily": "Impact, sans-serif",
        "logoPosition": "bottom-left",
        "companyEmail": "info@startup.io",
        "companyWebsite": "startup.io",
        "showCTA": True,
        "ctaText": "Join Us",
        "ctaBackgroundColor": "#FF006E",
        "ctaTextColor": "#FFFFFF",
        "backgroundImageOpacity": 0.4,
        "visualStyle": {
            "type": "diagonal",
            "diagonalColor": "#FF006E",
            "diagonalAngle": 45,
            "diagonalOpacity": 0.2
        }
    },
    {
        "id": 4,
        "style": "corner-ribbon",
        "title": "Corner Ribbon",
        "content": 'Creativity is intelligence having "fun". Think "different", act "bold".',
        "highlightColor": "#A855F7",
        "backgroundColor": "#FDF2F8",
        "textColor": "#581C87",
        "accentColor": "#A855F7",
        "fontFamily": "Palatino, serif",
        "logoPosition": "top-left",
        "companyEmail": "creative@studio.com",
        "companyWebsite": "creativestudio.com",
        "showCTA": True,
        "ctaText": "Start Creating",
        "ctaBackgroundColor": "#A855F7",
        "ctaTextColor": "#FFFFFF",
        "backgroundImageOpacity": 0.25,
        "visualStyle": {
            "type": "ribbon",
            "ribbonColor": "#A855F7",
            "ribbonPosition": "top-right",
            "ribbonText": "NEW"
        }
    },
    {
        "id": 5,
        "style": "gradient-mesh",
        "title": "Gradient Mesh",
        "content": 'Your "mindset" determines your success. Embrace "challenges", celebrate "growth".',
        "highlightColor": "#10B981",
        "backgroundColor": "#064E3B",
        "textColor": "#D1FAE5",
        "accentColor": "#10B981",
        "fontFamily": "Helvetica, sans-serif",
        "logoPosition": "bottom-right",
        "companyEmail": "grow@company.com",
        "companyWebsite": "growthco.com",
        "showCTA": True,
        "ctaText": "Start Growing",
        "ctaBackgroundColor": "#10B981",
        "ctaTextColor": "#064E3B",
        "backgroundImageOpacity": 0.35,
        "visualStyle": {
            "type": "gradient-mesh",
            "gradientColors": ["#064E3B", "#10B981", "#34D399"],
            "meshPattern": "radial"
        }
    },
    {
        "id": 6,
        "style": "geometric-pattern",
        "title": "Geometric Pattern",
        "content": 'Every "expert" was once a "beginner". Start "today", improve "tomorrow".',
        "highlightColor": "#FBBF24",
        "backgroundColor": "#1F2937",
        "textColor": "#F9FAFB",
        "accentColor": "#FBBF24",
        "fontFamily": "Arial, sans-serif",
        "logoPosition": "top-right",
        "companyEmail": "inspire@motivation.com",
        "companyWebsite": "dailyinspire.com",
        "showCTA": True,
        "ctaText": "Get Inspired",
        "ctaBackgroundColor": "#FBBF24",
        "ctaTextColor": "#1F2937",
        "backgroundImageOpacity": 0.3,
        "visualStyle": {
            "type": "geometric",
            "pattern": "triangles",
            "patternColor": "#FBBF24",
            "patternOpacity": 0.1
        }
    },
    {
        "id": 7,
        "style": "border-frame",
        "title": "Border Frame",
        "content": 'The "future" is already here. It\'s just not evenly "distributed" yet.',
        "highlightColor": "#3B82F6",
        "backgroundColor": "#0C0A09",
        "textColor": "#E7E5E4",
        "accentColor": "#3B82F6",
        "fontFamily": "system-ui, sans-serif",
        "logoPosition": "top-left",
        "companyEmail": "hello@techco.io",
        "companyWebsite": "techco.io",
        "showCTA": True,
        "ctaText": "Explore Tech",
        "ctaBackgroundColor": "#3B82F6",
        "ctaTextColor": "#FFFFFF",
        "backgroundImageOpacity": 0.4,
        "visualStyle": {
            "type": "frame",
            "frameColor": "#3B82F6",
            "frameWidth": 20,
            "frameStyle": "gradient",
            "cornerRadius": 30
        }
    },
    {
        "id": 8,
        "style": "bubble-overlay",
        "title": "Bubble Design",
        "content": 'In the middle of "difficulty" lies "opportunity". Never give up.',
        "highlightColor": "#D97706",
        "backgroundColor": "#F5F5F4",
        "textColor": "#44403C",
        "accentColor": "#D97706",
        "fontFamily": "Georgia, serif",
        "logoPosition": "bottom-left",
        "companyEmail": "wisdom@quotes.com",
        "companyWebsite": "wisdomquotes.com",
        "showCTA": True,
        "ctaText": "Read More",
        "ctaBackgroundColor": "#D97706",
        "ctaTextColor": "#FFFFFF",
        "backgroundImageOpacity": 0.2,
        "visualStyle": {
            "type": "bubbles",
            "bubbleColor": "#D97706",
            "bubbleOpacity": 0.1,
            "bubbleCount": 5,
            "bubbleSizes": [100, 150, 80, 120, 90]
        }
    },
    {
        "id": 9,
        "style": "stripe-pattern",
        "title": "Stripe Energy",
        "content": 'Dream "big", work "hard", stay "focused". Success is inevitable!',
        "highlightColor": "#EF4444",
        "backgroundColor": "#FEF3C7",
        "textColor": "#7C2D12",
        "accentColor": "#EF4444",
        "fontFamily": "Impact, sans-serif",
        "logoPosition": "top-right",
        "companyEmail": "energy@vibes.com",
        "companyWebsite": "highvibes.com",
        "showCTA": True,
        "ctaText": "Join the Movement",
        "ctaBackgroundColor": "#EF4444",
        "ctaTextColor": "#FFFFFF",
        "backgroundImageOpacity": 0.3,
        "visualStyle": {
            "type": "stripes",
            "stripeColor": "#EF4444",
            "stripeAngle": 45,
            "stripeOpacity": 0.15,
            "stripeWidth": 50
        }
    },
    {
        "id": 10,
        "style": "double-border",
        "title": "Elegant Frame",
        "content": 'Simplicity is the ultimate "sophistication". Less is "more".',
        "highlightColor": "#8B7355",
        "backgroundColor": "#FAFAF9",
        "textColor": "#292524",
        "accentColor": "#8B7355",
        "fontFamily": "Palatino, serif",
        "logoPosition": "bottom-right",
        "companyEmail": "elegant@design.com",
        "companyWebsite": "elegantdesign.com",
        "showCTA": True,
        "ctaText": "Discover More",
        "ctaBackgroundColor": "#8B7355",
        "ctaTextColor": "#FFFFFF",
        "backgroundImageOpacity": 0.25,
        "visualStyle": {
            "type": "double-border",
            "borderColor1": "#8B7355",
            "borderColor2": "#D4C5B9",
            "borderGap": 15,
            "borderWidth": 8
        }
    },
    {
        "id": 11,
        "style": "blob-shape",
        "title": "Organic Blobs",
        "content": 'Change is the only "constant". Adapt, "evolve", and "thrive".',
        "highlightColor": "#EC4899",
        "backgroundColor": "#18181B",
        "textColor": "#FAFAFA",
        "accentColor": "#EC4899",
        "fontFamily": "Helvetica, sans-serif",
        "logoPosition": "top-left",
        "companyEmail": "change@evolve.io",
        "companyWebsite": "evolve.io",
        "showCTA": True,
        "ctaText": "Evolve Now",
        "ctaBackgroundColor": "#EC4899",
        "ctaTextColor": "#FFFFFF",
        "backgroundImageOpacity": 0.3,
        "visualStyle": {
            "type": "blob",
            "blobColor": "#EC4899",
            "blobOpacity": 0.15,
            "blobPosition": "background",
            "blobCount": 2
        }
    },
    {
        "id": 12,
        "style": "curved-corner",
        "title": "Curved Corner",
        "content": 'The "best time" to plant a tree was 20 years ago. The second best time is "now".',
        "highlightColor": "#14B8A6",
        "backgroundColor": "#F0FDFA",
        "textColor": "#134E4A",
        "accentColor": "#14B8A6",
        "fontFamily": "Georgia, serif",
        "logoPosition": "top-right",
        "companyEmail": "plant@green.com",
        "companyWebsite": "greenstart.com",
        "showCTA": True,
        "ctaText": "Start Today",
        "ctaBackgroundColor": "#14B8A6",
        "ctaTextColor": "#FFFFFF",
        "backgroundImageOpacity": 0.2,
        "visualStyle": {
            "type": "curved-corner",
            "cornerColor": "#14B8A6",
            "cornerPosition": "bottom-right",
            "cornerSize": 300,
            "cornerOpacity": 0.2
        }
    },
    {
        "id": 13,
        "style": "half-circle",
        "title": "Half Circle",
        "content": 'Life is 10% what happens to you and 90% how you "react" to it.',
        "highlightColor": "#F59E0B",
        "backgroundColor": "#422006",
        "textColor": "#FEF3C7",
        "accentColor": "#F59E0B",
        "fontFamily": "Arial, sans-serif",
        "logoPosition": "bottom-left",
        "companyEmail": "life@wisdom.com",
        "companyWebsite": "lifewisdom.com",
        "showCTA": True,
        "ctaText": "Learn More",
        "ctaBackgroundColor": "#F59E0B",
        "ctaTextColor": "#422006",
        "backgroundImageOpacity": 0.3,
        "visualStyle": {
            "type": "half-circle",
            "circleColor": "#F59E0B",
            "circlePosition": "left",
            "circleOpacity": 0.15,
            "circleSize": 400
        }
    },
    {
        "id": 14,
        "style": "dots-pattern",
        "title": "Dot Matrix",
        "content": 'Small "daily improvements" over time lead to "stunning results".',
        "highlightColor": "#8B5CF6",
        "backgroundColor": "#F5F3FF",
        "textColor": "#4C1D95",
        "accentColor": "#8B5CF6",
        "fontFamily": "system-ui, sans-serif",
        "logoPosition": "top-left",
        "companyEmail": "daily@improve.io",
        "companyWebsite": "dailyimprove.io",
        "showCTA": True,
        "ctaText": "Start Improving",
        "ctaBackgroundColor": "#8B5CF6",
        "ctaTextColor": "#FFFFFF",
        "backgroundImageOpacity": 0.25,
        "visualStyle": {
            "type": "dots",
            "dotColor": "#8B5CF6",
            "dotOpacity": 0.2,
            "dotSize": 4,
            "dotSpacing": 30
        }
    },
    {
        "id": 15,
        "style": "asymmetric-blocks",
        "title": "Asymmetric Blocks",
        "content": 'Be "fearless" in the pursuit of what sets your soul on "fire".',
        "highlightColor": "#DC2626",
        "backgroundColor": "#FEF2F2",
        "textColor": "#7F1D1D",
        "accentColor": "#DC2626",
        "fontFamily": "Impact, sans-serif",
        "logoPosition": "top-right",
        "companyEmail": "fire@passion.com",
        "companyWebsite": "passion.com",
        "showCTA": True,
        "ctaText": "Ignite Now",
        "ctaBackgroundColor": "#DC2626",
        "ctaTextColor": "#FFFFFF",
        "backgroundImageOpacity": 0.3,
        "visualStyle": {
            "type": "blocks",
            "blockColor": "#DC2626",
            "blockOpacity": 0.1,
            "blockCount": 3,
            "blockStyle": "asymmetric"
        }
    },
    {
        "id": 16,
        "style": "wavy-lines",
        "title": "Wavy Lines",
        "content": 'The "journey" of a thousand miles begins with a single "step".',
        "highlightColor": "#06B6D4",
        "backgroundColor": "#083344",
        "textColor": "#CFFAFE",
        "accentColor": "#06B6D4",
        "fontFamily": "Palatino, serif",
        "logoPosition": "bottom-right",
        "companyEmail": "journey@path.com",
        "companyWebsite": "yourpath.com",
        "showCTA": True,
        "ctaText": "Begin Journey",
        "ctaBackgroundColor": "#06B6D4",
        "ctaTextColor": "#083344",
        "backgroundImageOpacity": 0.25,
        "visualStyle": {
            "type": "wavy-lines",
            "lineColor": "#06B6D4",
            "lineOpacity": 0.2,
            "lineCount": 4,
            "lineThickness": 3
        }
    },
    {
        "id": 17,
        "style": "corner-cut",
        "title": "Corner Cut",
        "content": 'Your "limitation" is only your "imagination". Dream "bigger".',
        "highlightColor": "#F97316",
        "backgroundColor": "#FFFBEB",
        "textColor": "#78350F",
        "accentColor": "#F97316",
        "fontFamily": "Helvetica, sans-serif",
        "logoPosition": "top-left",
        "companyEmail": "dream@bigger.com",
        "companyWebsite": "dreambig.com",
        "showCTA": True,
        "ctaText": "Dream Bigger",
        "ctaBackgroundColor": "#F97316",
        "ctaTextColor": "#FFFFFF",
        "backgroundImageOpacity": 0.2,
        "visualStyle": {
            "type": "corner-cut",
            "cutColor": "#F97316",
            "cutPosition": "top-right",
            "cutSize": 200,
            "cutOpacity": 0.3
        }
    },
    {
        "id": 18,
        "style": "zigzag-border",
        "title": "Zigzag Energy",
        "content": 'Be the "energy" you want to "attract". Radiate "positivity".',
        "highlightColor": "#FACC15",
        "backgroundColor": "#1C1917",
        "textColor": "#FAFAF9",
        "accentColor": "#FACC15",
        "fontFamily": "Impact, sans-serif",
        "logoPosition": "bottom-left",
        "companyEmail": "energy@positive.io",
        "companyWebsite": "positive.io",
        "showCTA": True,
        "ctaText": "Get Energized",
        "ctaBackgroundColor": "#FACC15",
        "ctaTextColor": "#1C1917",
        "backgroundImageOpacity": 0.35,
        "visualStyle": {
            "type": "zigzag",
            "zigzagColor": "#FACC15",
            "zigzagPosition": "bottom",
            "zigzagHeight": 50,
            "zigzagOpacity": 0.4
        }
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
    """Save a customized post"""
    data = request.json
    return jsonify({
        "success": True,
        "message": "Post saved successfully",
        "data": data,
        "timestamp": datetime.now().isoformat()
    })

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "templates_count": len(TEMPLATES)
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)