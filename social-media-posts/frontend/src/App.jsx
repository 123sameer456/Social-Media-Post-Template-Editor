import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const App = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [editedPost, setEditedPost] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [notification, setNotification] = useState('');
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [logoImage, setLogoImage] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/templates');
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      console.error('Error fetching templates:', error);
      setTemplates([]);
    }
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setEditedPost({ 
      ...template,
      logoPosition: template.logoPosition || "top-left",
      companyEmail: template.companyEmail || "",
      companyWebsite: template.companyWebsite || "",
      showCTA: template.showCTA !== undefined ? template.showCTA : true,
      ctaText: template.ctaText || "Learn More",
      ctaBackgroundColor: template.ctaBackgroundColor || "#F97316",
      ctaTextColor: template.ctaTextColor || "#FFFFFF",
      backgroundImageOpacity: template.backgroundImageOpacity || 0.3,
      highlightColor: template.highlightColor || "#FFD700",
      visualStyle: template.visualStyle || {}
    });
    setShowEditor(true);
  };

  const handleInputChange = (field, value) => {
    setEditedPost(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBackgroundImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBackgroundImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogoImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const parseContentWithHighlights = (content) => {
    const parts = [];
    let currentIndex = 0;
    const regex = /"([^"]*)"/g;
    let match;

    while ((match = regex.exec(content)) !== null) {
      if (match.index > currentIndex) {
        parts.push({
          type: 'text',
          content: content.substring(currentIndex, match.index)
        });
      }
      parts.push({
        type: 'highlight',
        content: match[1]
      });
      currentIndex = match.index + match[0].length;
    }

    if (currentIndex < content.length) {
      parts.push({
        type: 'text',
        content: content.substring(currentIndex)
      });
    }

    return parts;
  };

  const downloadPost = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = 1080;
    canvas.height = 1080;

    // Draw background color
    ctx.fillStyle = editedPost.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw visual style elements
    drawVisualStyle(ctx, canvas, editedPost.visualStyle);

    // Draw background image with opacity
    if (backgroundImage) {
      const bgImg = new Image();
      bgImg.onload = () => {
        ctx.globalAlpha = editedPost.backgroundImageOpacity;
        ctx.drawImage(bgImg, 0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1.0;
        continueDrawing();
      };
      bgImg.src = backgroundImage;
    } else {
      continueDrawing();
    }

    function continueDrawing() {
      // Draw logo
      if (logoImage) {
        const logoImg = new Image();
        logoImg.onload = () => {
          const logoSize = 120;
          let logoX, logoY;
          
          switch(editedPost.logoPosition) {
            case 'top-left':
              logoX = 40;
              logoY = 40;
              break;
            case 'top-right':
              logoX = canvas.width - logoSize - 40;
              logoY = 40;
              break;
            case 'bottom-left':
              logoX = 40;
              logoY = canvas.height - logoSize - 40;
              break;
            case 'bottom-right':
              logoX = canvas.width - logoSize - 40;
              logoY = canvas.height - logoSize - 40;
              break;
            default:
              logoX = 40;
              logoY = 40;
          }
          
          ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
          finishDrawing();
        };
        logoImg.src = logoImage;
      } else {
        finishDrawing();
      }
    }

    function finishDrawing() {
      // Draw content with highlights
      ctx.fillStyle = editedPost.textColor;
      ctx.font = `bold 52px ${editedPost.fontFamily}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const parts = parseContentWithHighlights(editedPost.content);
      const maxWidth = canvas.width - 160;
      let y = canvas.height / 2 - 100;
      const lineHeight = 75;

      let currentLine = '';
      let currentX = canvas.width / 2;

      parts.forEach((part) => {
        if (part.type === 'highlight') {
          if (currentLine) {
            ctx.fillStyle = editedPost.textColor;
            ctx.fillText(currentLine, currentX, y);
            currentLine = '';
            y += lineHeight;
          }

          const highlightText = `"${part.content}"`;
          const metrics = ctx.measureText(highlightText);
          
          ctx.fillStyle = editedPost.highlightColor;
          ctx.fillRect(
            currentX - metrics.width / 2 - 15,
            y - 35,
            metrics.width + 30,
            70
          );
          
          ctx.fillStyle = editedPost.textColor;
          ctx.fillText(highlightText, currentX, y);
          y += lineHeight;
        } else {
          currentLine += part.content;
        }
      });

      if (currentLine) {
        ctx.fillStyle = editedPost.textColor;
        ctx.fillText(currentLine, currentX, y);
        y += lineHeight;
      }

      // Draw company info
      ctx.font = '20px Arial';
      ctx.fillStyle = editedPost.textColor;
      ctx.textAlign = 'left';
      
      let infoY = canvas.height - 120;
      if (editedPost.companyEmail) {
        ctx.fillText(`📧 ${editedPost.companyEmail}`, 40, infoY);
        infoY += 30;
      }
      if (editedPost.companyWebsite) {
        ctx.fillText(`🌐 ${editedPost.companyWebsite}`, 40, infoY);
      }

      // Draw CTA button
      if (editedPost.showCTA && editedPost.ctaText) {
        const btnWidth = 300;
        const btnHeight = 70;
        const btnX = (canvas.width - btnWidth) / 2;
        const btnY = canvas.height - 150;

        ctx.fillStyle = editedPost.ctaBackgroundColor;
        ctx.beginPath();
        ctx.roundRect(btnX, btnY, btnWidth, btnHeight, 15);
        ctx.fill();

        ctx.fillStyle = editedPost.ctaTextColor;
        ctx.font = 'bold 28px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(editedPost.ctaText, canvas.width / 2, btnY + btnHeight / 2 + 5);
      }

      // Download
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `social-post-${Date.now()}.png`;
        a.click();
        URL.revokeObjectURL(url);
        showNotification('Post downloaded successfully! 🎉');
      });
    }
  };

  const drawVisualStyle = (ctx, canvas, visualStyle) => {
    if (!visualStyle || !visualStyle.type) return;

    ctx.save();

    switch(visualStyle.type) {
      case 'wave':
        drawWave(ctx, canvas, visualStyle);
        break;
      case 'circles':
        drawCircles(ctx, canvas, visualStyle);
        break;
      case 'diagonal':
        drawDiagonal(ctx, canvas, visualStyle);
        break;
      case 'geometric':
        drawGeometric(ctx, canvas, visualStyle);
        break;
      case 'frame':
        drawFrame(ctx, canvas, visualStyle);
        break;
      case 'bubbles':
        drawBubbles(ctx, canvas, visualStyle);
        break;
      case 'stripes':
        drawStripes(ctx, canvas, visualStyle);
        break;
      case 'double-border':
        drawDoubleBorder(ctx, canvas, visualStyle);
        break;
      case 'dots':
        drawDots(ctx, canvas, visualStyle);
        break;
      case 'zigzag':
        drawZigzag(ctx, canvas, visualStyle);
        break;
      default:
        break;
    }

    ctx.restore();
  };

  const drawWave = (ctx, canvas, style) => {
    ctx.fillStyle = style.waveColor;
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - style.waveHeight);
    
    for (let x = 0; x <= canvas.width; x += 10) {
      const y = Math.sin(x * 0.01) * 50 + (canvas.height - style.waveHeight);
      ctx.lineTo(x, y);
    }
    
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1.0;
  };

  const drawCircles = (ctx, canvas, style) => {
    ctx.fillStyle = style.circleColor;
    ctx.globalAlpha = style.circleOpacity;
    
    const positions = [
      { x: canvas.width * 0.8, y: canvas.height * 0.2, r: 200 },
      { x: canvas.width * 0.15, y: canvas.height * 0.7, r: 150 },
      { x: canvas.width * 0.5, y: canvas.height * 0.9, r: 100 }
    ];
    
    positions.forEach(pos => {
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, pos.r, 0, Math.PI * 2);
      ctx.fill();
    });
    
    ctx.globalAlpha = 1.0;
  };

  const drawDiagonal = (ctx, canvas, style) => {
    ctx.fillStyle = style.diagonalColor;
    ctx.globalAlpha = style.diagonalOpacity;
    
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(canvas.width, 0);
    ctx.lineTo(canvas.width, canvas.height * 0.7);
    ctx.lineTo(0, canvas.height * 0.4);
    ctx.closePath();
    ctx.fill();
    
    ctx.globalAlpha = 1.0;
  };

  const drawGeometric = (ctx, canvas, style) => {
    ctx.strokeStyle = style.patternColor;
    ctx.globalAlpha = style.patternOpacity;
    ctx.lineWidth = 2;
    
    for (let i = 0; i < 10; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = 30 + Math.random() * 50;
      
      ctx.beginPath();
      ctx.moveTo(x, y - size);
      ctx.lineTo(x + size, y + size);
      ctx.lineTo(x - size, y + size);
      ctx.closePath();
      ctx.stroke();
    }
    
    ctx.globalAlpha = 1.0;
  };

  const drawFrame = (ctx, canvas, style) => {
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, style.frameColor);
    gradient.addColorStop(1, style.frameColor + '80');
    
    ctx.strokeStyle = gradient;
    ctx.lineWidth = style.frameWidth;
    ctx.beginPath();
    ctx.roundRect(
      style.frameWidth / 2,
      style.frameWidth / 2,
      canvas.width - style.frameWidth,
      canvas.height - style.frameWidth,
      style.cornerRadius
    );
    ctx.stroke();
  };

  const drawBubbles = (ctx, canvas, style) => {
    ctx.fillStyle = style.bubbleColor;
    ctx.globalAlpha = style.bubbleOpacity;
    
    const bubbles = [
      { x: canvas.width * 0.2, y: canvas.height * 0.3, r: 100 },
      { x: canvas.width * 0.8, y: canvas.height * 0.5, r: 150 },
      { x: canvas.width * 0.5, y: canvas.height * 0.15, r: 80 },
      { x: canvas.width * 0.7, y: canvas.height * 0.8, r: 120 },
      { x: canvas.width * 0.1, y: canvas.height * 0.6, r: 90 }
    ];
    
    bubbles.forEach(bubble => {
      ctx.beginPath();
      ctx.arc(bubble.x, bubble.y, bubble.r, 0, Math.PI * 2);
      ctx.fill();
    });
    
    ctx.globalAlpha = 1.0;
  };

  const drawStripes = (ctx, canvas, style) => {
    ctx.save();
    ctx.fillStyle = style.stripeColor;
    ctx.globalAlpha = style.stripeOpacity;
    
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((style.stripeAngle * Math.PI) / 180);
    
    for (let i = -canvas.width; i < canvas.width * 2; i += style.stripeWidth * 2) {
      ctx.fillRect(i - canvas.width, -canvas.height, style.stripeWidth, canvas.height * 3);
    }
    
    ctx.globalAlpha = 1.0;
    ctx.restore();
  };

  const drawDoubleBorder = (ctx, canvas, style) => {
    // Outer border
    ctx.strokeStyle = style.borderColor1;
    ctx.lineWidth = style.borderWidth;
    ctx.strokeRect(
      style.borderWidth / 2,
      style.borderWidth / 2,
      canvas.width - style.borderWidth,
      canvas.height - style.borderWidth
    );
    
    // Inner border
    ctx.strokeStyle = style.borderColor2;
    const gap = style.borderGap + style.borderWidth;
    ctx.strokeRect(
      gap,
      gap,
      canvas.width - gap * 2,
      canvas.height - gap * 2
    );
  };

  const drawDots = (ctx, canvas, style) => {
    ctx.fillStyle = style.dotColor;
    ctx.globalAlpha = style.dotOpacity;
    
    for (let x = 0; x < canvas.width; x += style.dotSpacing) {
      for (let y = 0; y < canvas.height; y += style.dotSpacing) {
        ctx.beginPath();
        ctx.arc(x, y, style.dotSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    
    ctx.globalAlpha = 1.0;
  };

  const drawZigzag = (ctx, canvas, style) => {
    ctx.fillStyle = style.zigzagColor;
    ctx.globalAlpha = style.zigzagOpacity;
    
    ctx.beginPath();
    const zigzagY = canvas.height - style.zigzagHeight;
    const zigzagWidth = 40;
    
    ctx.moveTo(0, zigzagY);
    for (let x = 0; x < canvas.width; x += zigzagWidth) {
      ctx.lineTo(x + zigzagWidth / 2, canvas.height - style.zigzagHeight + (x % (zigzagWidth * 2) === 0 ? -30 : 0));
      ctx.lineTo(x + zigzagWidth, zigzagY);
    }
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();
    ctx.fill();
    
    ctx.globalAlpha = 1.0;
  };

  const savePost = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editedPost),
      });
      const data = await response.json();
      showNotification('Post saved successfully! ✅');
    } catch (error) {
      console.error('Error saving post:', error);
      showNotification('Saved to local storage! 💾');
      localStorage.setItem('savedPost', JSON.stringify(editedPost));
    }
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 3000);
  };

  const closeEditor = () => {
    setShowEditor(false);
    setSelectedTemplate(null);
    setEditedPost(null);
    setBackgroundImage(null);
    setLogoImage(null);
  };

  const renderPreviewContent = () => {
    const parts = parseContentWithHighlights(editedPost.content);
    
    return parts.map((part, index) => {
      if (part.type === 'highlight') {
        return (
          <span 
            key={index}
            style={{
              backgroundColor: editedPost.highlightColor,
              padding: '4px 8px',
              borderRadius: '4px'
            }}
          >
            "{part.content}"
          </span>
        );
      }
      return <span key={index}>{part.content}</span>;
    });
  };

  const renderVisualStylePreview = () => {
    const style = editedPost.visualStyle;
    if (!style || !style.type) return null;

    const commonStyles = {
      position: 'absolute',
      pointerEvents: 'none'
    };

    switch(style.type) {
      case 'wave':
        return (
          <div className="visual-wave" style={{
            ...commonStyles,
            bottom: 0,
            left: 0,
            right: 0,
            height: `${(style.waveHeight / 1080) * 100}%`,
            background: style.waveColor,
            opacity: 0.3,
            clipPath: 'polygon(0% 40%, 10% 35%, 20% 38%, 30% 32%, 40% 35%, 50% 30%, 60% 35%, 70% 32%, 80% 38%, 90% 35%, 100% 40%, 100% 100%, 0% 100%)'
          }} />
        );
      
      case 'circles':
        return (
          <>
            <div className="circle-accent" style={{
              ...commonStyles,
              width: '200px',
              height: '200px',
              borderRadius: '50%',
              background: style.circleColor,
              opacity: style.circleOpacity,
              top: '10%',
              right: '10%'
            }} />
            <div className="circle-accent" style={{
              ...commonStyles,
              width: '150px',
              height: '150px',
              borderRadius: '50%',
              background: style.circleColor,
              opacity: style.circleOpacity,
              bottom: '20%',
              left: '5%'
            }} />
          </>
        );
      
      case 'diagonal':
        return (
          <div className="diagonal-overlay" style={{
            ...commonStyles,
            top: 0,
            left: 0,
            right: 0,
            height: '70%',
            background: style.diagonalColor,
            opacity: style.diagonalOpacity,
            clipPath: 'polygon(0 0, 100% 0, 100% 70%, 0 40%)'
          }} />
        );
      
      case 'frame':
        return (
          <div className="frame-border" style={{
            ...commonStyles,
            top: '10px',
            left: '10px',
            right: '10px',
            bottom: '10px',
            border: `${style.frameWidth}px solid ${style.frameColor}`,
            borderRadius: `${style.cornerRadius}px`,
            background: `linear-gradient(135deg, ${style.frameColor}20, transparent)`
          }} />
        );
      
      case 'stripes':
        return (
          <div className="stripe-pattern" style={{
            ...commonStyles,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `repeating-linear-gradient(${style.stripeAngle}deg, transparent, transparent ${style.stripeWidth}px, ${style.stripeColor}${Math.floor(style.stripeOpacity * 255).toString(16)} ${style.stripeWidth}px, ${style.stripeColor}${Math.floor(style.stripeOpacity * 255).toString(16)} ${style.stripeWidth * 2}px)`
          }} />
        );
      
      case 'double-border':
        return (
          <>
            <div style={{
              ...commonStyles,
              top: '4px',
              left: '4px',
              right: '4px',
              bottom: '4px',
              border: `${style.borderWidth}px solid ${style.borderColor1}`,
            }} />
            <div style={{
              ...commonStyles,
              top: `${style.borderGap + style.borderWidth + 4}px`,
              left: `${style.borderGap + style.borderWidth + 4}px`,
              right: `${style.borderGap + style.borderWidth + 4}px`,
              bottom: `${style.borderGap + style.borderWidth + 4}px`,
              border: `${style.borderWidth}px solid ${style.borderColor2}`,
            }} />
          </>
        );
      
      case 'dots':
        return (
          <div className="dots-pattern" style={{
            ...commonStyles,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `radial-gradient(circle, ${style.dotColor} ${style.dotSize}px, transparent ${style.dotSize}px)`,
            backgroundSize: `${style.dotSpacing}px ${style.dotSpacing}px`,
            opacity: style.dotOpacity
          }} />
        );
      
      case 'zigzag':
        return (
          <div className="zigzag-pattern" style={{
            ...commonStyles,
            bottom: 0,
            left: 0,
            right: 0,
            height: `${(style.zigzagHeight / 1080) * 100}%`,
            background: style.zigzagColor,
            opacity: style.zigzagOpacity,
            clipPath: 'polygon(0% 30%, 5% 0%, 10% 30%, 15% 0%, 20% 30%, 25% 0%, 30% 30%, 35% 0%, 40% 30%, 45% 0%, 50% 30%, 55% 0%, 60% 30%, 65% 0%, 70% 30%, 75% 0%, 80% 30%, 85% 0%, 90% 30%, 95% 0%, 100% 30%, 100% 100%, 0% 100%)'
          }} />
        );
      
      case 'bubbles':
        return (
          <>
            {[
              { size: '100px', top: '20%', left: '10%' },
              { size: '150px', top: '50%', right: '15%' },
              { size: '80px', top: '10%', right: '30%' },
              { size: '120px', bottom: '15%', left: '40%' }
            ].map((bubble, idx) => (
              <div key={idx} style={{
                ...commonStyles,
                width: bubble.size,
                height: bubble.size,
                borderRadius: '50%',
                background: style.bubbleColor,
                opacity: style.bubbleOpacity,
                ...bubble
              }} />
            ))}
          </>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="app">
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      
      {notification && (
        <div className="notification">
          {notification}
        </div>
      )}

      <header className="header">
        <div className="header-content">
          <h1 className="logo">
            <span className="logo-icon">✨</span>
            PostCraft
          </h1>
          <p className="tagline">Create stunning social media hooks with unique visual styles</p>
        </div>
      </header>

      <main className="main-content">
        {!showEditor ? (
          <div className="templates-grid">
            <h2 className="section-title">Choose Your Visual Style</h2>
            <div className="grid">
              {templates.map((template, index) => (
                <div
                  key={template.id}
                  className="template-card"
                  style={{
                    animationDelay: `${index * 0.05}s`
                  }}
                  onClick={() => handleTemplateSelect(template)}
                >
                  <div
                    className="template-preview"
                    style={{
                      background: template.backgroundColor,
                      color: template.textColor,
                      fontFamily: template.fontFamily,
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <div className="preview-content" style={{ position: 'relative', zIndex: 2 }}>
                      <p className="preview-text">
                        {template.content.substring(0, 60)}
                        {template.content.length > 60 ? '...' : ''}
                      </p>
                    </div>
                    <div className="visual-style-indicator" style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: template.accentColor,
                      color: 'white',
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '10px',
                      fontWeight: 'bold',
                      zIndex: 3,
                      textTransform: 'uppercase',
                      fontFamily: 'DM Mono, monospace'
                    }}>
                      {template.visualStyle?.type || 'basic'}
                    </div>
                  </div>
                  <div className="template-info">
                    <h3>{template.title}</h3>
                    <span className="style-badge">{template.style}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="editor-container">
            <div className="editor-header">
              <button className="back-button" onClick={closeEditor}>
                ← Back to Templates
              </button>
              <h2>Edit Your Hook Post</h2>
            </div>

            <div className="editor-layout">
              <div className="editor-controls">
                <div className="control-group">
                  <label>Hook Content (Use "quotes" to highlight text)</label>
                  <textarea
                    value={editedPost.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    rows={4}
                    placeholder='Example: Success is "not final", failure is "not fatal"...'
                  />
                  <small style={{color: '#94A3B8', fontSize: '12px'}}>
                    💡 Tip: Put text in "double quotes" to highlight it
                  </small>
                </div>

                <div className="control-row-2">
                  <div className="control-group">
                    <label>Background</label>
                    <input
                      type="color"
                      value={editedPost.backgroundColor}
                      onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
                    />
                  </div>

                  <div className="control-group">
                    <label>Text</label>
                    <input
                      type="color"
                      value={editedPost.textColor}
                      onChange={(e) => handleInputChange('textColor', e.target.value)}
                    />
                  </div>

                  <div className="control-group">
                    <label>Highlight</label>
                    <input
                      type="color"
                      value={editedPost.highlightColor}
                      onChange={(e) => handleInputChange('highlightColor', e.target.value)}
                    />
                  </div>
                </div>

                <div className="control-group">
                  <label>Font Family</label>
                  <select
                    value={editedPost.fontFamily}
                    onChange={(e) => handleInputChange('fontFamily', e.target.value)}
                  >
                    <option value="Georgia, serif">Georgia (Serif)</option>
                    <option value="Arial, sans-serif">Arial (Sans-serif)</option>
                    <option value="Helvetica, sans-serif">Helvetica</option>
                    <option value="Impact, sans-serif">Impact (Bold)</option>
                    <option value="Palatino, serif">Palatino (Elegant)</option>
                  </select>
                </div>

                <div className="section-divider">
                  <span>BRANDING</span>
                </div>

                <div className="control-group">
                  <label>Logo Upload</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="file-input"
                  />
                  {logoImage && <small style={{color: '#10B981'}}>✓ Logo uploaded</small>}
                </div>

                <div className="control-group">
                  <label>Logo Position</label>
                  <select
                    value={editedPost.logoPosition}
                    onChange={(e) => handleInputChange('logoPosition', e.target.value)}
                  >
                    <option value="top-left">Top Left</option>
                    <option value="top-right">Top Right</option>
                    <option value="bottom-left">Bottom Left</option>
                    <option value="bottom-right">Bottom Right</option>
                  </select>
                </div>

                <div className="control-group">
                  <label>Company Email</label>
                  <input
                    type="email"
                    value={editedPost.companyEmail}
                    onChange={(e) => handleInputChange('companyEmail', e.target.value)}
                    placeholder="hello@company.com"
                  />
                </div>

                <div className="control-group">
                  <label>Company Website</label>
                  <input
                    type="text"
                    value={editedPost.companyWebsite}
                    onChange={(e) => handleInputChange('companyWebsite', e.target.value)}
                    placeholder="www.company.com"
                  />
                </div>

                <div className="section-divider">
                  <span>BACKGROUND IMAGE</span>
                </div>

                <div className="control-group">
                  <label>Background Image Upload</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBackgroundImageUpload}
                    className="file-input"
                  />
                  {backgroundImage && <small style={{color: '#10B981'}}>✓ Background uploaded</small>}
                </div>

                <div className="control-group">
                  <label>Background Opacity: {editedPost.backgroundImageOpacity}</label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={editedPost.backgroundImageOpacity}
                    onChange={(e) => handleInputChange('backgroundImageOpacity', parseFloat(e.target.value))}
                    className="slider"
                  />
                </div>

                <div className="section-divider">
                  <span>CALL TO ACTION</span>
                </div>

                <div className="control-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={editedPost.showCTA}
                      onChange={(e) => handleInputChange('showCTA', e.target.checked)}
                    />
                    <span>Show CTA Button</span>
                  </label>
                </div>

                {editedPost.showCTA && (
                  <>
                    <div className="control-group">
                      <label>CTA Button Text</label>
                      <input
                        type="text"
                        value={editedPost.ctaText}
                        onChange={(e) => handleInputChange('ctaText', e.target.value)}
                        placeholder="Learn More"
                      />
                    </div>

                    <div className="control-row-2">
                      <div className="control-group">
                        <label>Button BG</label>
                        <input
                          type="color"
                          value={editedPost.ctaBackgroundColor}
                          onChange={(e) => handleInputChange('ctaBackgroundColor', e.target.value)}
                        />
                      </div>

                      <div className="control-group">
                        <label>Button Text</label>
                        <input
                          type="color"
                          value={editedPost.ctaTextColor}
                          onChange={(e) => handleInputChange('ctaTextColor', e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="action-buttons">
                  <button className="btn btn-primary" onClick={downloadPost}>
                    📥 Download Post
                  </button>
                  <button className="btn btn-secondary" onClick={savePost}>
                    💾 Save Post
                  </button>
                </div>
              </div>

              <div className="preview-panel">
                <h3>Live Preview</h3>
                <div className="live-preview">
                  <div
                    className="post-preview-advanced"
                    style={{
                      background: editedPost.backgroundColor,
                      color: editedPost.textColor,
                      fontFamily: editedPost.fontFamily,
                      backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      position: 'relative'
                    }}
                  >
                    {backgroundImage && (
                      <div 
                        className="bg-overlay"
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          backgroundColor: editedPost.backgroundColor,
                          opacity: 1 - editedPost.backgroundImageOpacity,
                          zIndex: 1
                        }}
                      />
                    )}

                    {renderVisualStylePreview()}

                    {logoImage && (
                      <img 
                        src={logoImage} 
                        alt="Logo"
                        className={`preview-logo logo-${editedPost.logoPosition}`}
                      />
                    )}

                    <div className="post-content-advanced">
                      <p className="post-text-advanced">
                        {renderPreviewContent()}
                      </p>
                    </div>

                    <div className="company-info">
                      {editedPost.companyEmail && (
                        <div className="info-item">📧 {editedPost.companyEmail}</div>
                      )}
                      {editedPost.companyWebsite && (
                        <div className="info-item">🌐 {editedPost.companyWebsite}</div>
                      )}
                    </div>

                    {editedPost.showCTA && editedPost.ctaText && (
                      <button 
                        className="cta-button-preview"
                        style={{
                          backgroundColor: editedPost.ctaBackgroundColor,
                          color: editedPost.ctaTextColor
                        }}
                      >
                        {editedPost.ctaText}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;