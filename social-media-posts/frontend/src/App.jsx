import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const App = () => {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [editedPost, setEditedPost] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [notification, setNotification] = useState('');
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
      // Fallback data if backend is not running
      setTemplates([
        {
          id: 1,
          style: "minimalist",
          title: "Minimalist Quote",
          content: "Design is not just what it looks like. Design is how it works.",
          author: "Steve Jobs",
          backgroundColor: "#FAFAFA",
          textColor: "#1A1A1A",
          accentColor: "#E5E5E5",
          fontFamily: "Georgia, serif",
          layout: "centered"
        },
        {
          id: 2,
          style: "vibrant",
          title: "Vibrant Announcement",
          content: "🚀 Exciting News! We're launching something amazing next week.",
          author: "",
          backgroundColor: "#FF6B6B",
          textColor: "#FFFFFF",
          accentColor: "#FFE66D",
          fontFamily: "Arial, sans-serif",
          layout: "bold"
        },
        {
          id: 3,
          style: "gradient",
          title: "Gradient Inspiration",
          content: "Believe you can and you're halfway there.",
          author: "Theodore Roosevelt",
          backgroundColor: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          textColor: "#FFFFFF",
          accentColor: "#FFD700",
          fontFamily: "Helvetica, sans-serif",
          layout: "overlay"
        }
      ]);
    }
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setEditedPost({ ...template });
    setShowEditor(true);
  };

  const handleInputChange = (field, value) => {
    setEditedPost(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const downloadPost = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = 1080;
    canvas.height = 1080;

    // Draw background
    if (editedPost.backgroundColor.startsWith('linear-gradient')) {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#667eea');
      gradient.addColorStop(1, '#764ba2');
      ctx.fillStyle = gradient;
    } else {
      ctx.fillStyle = editedPost.backgroundColor;
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw accent decoration
    ctx.fillStyle = editedPost.accentColor;
    ctx.fillRect(0, 0, 20, canvas.height);
    ctx.fillRect(canvas.width - 20, 0, 20, canvas.height);

    // Draw content
    ctx.fillStyle = editedPost.textColor;
    ctx.font = `bold 48px ${editedPost.fontFamily}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Word wrap
    const maxWidth = canvas.width - 200;
    const words = editedPost.content.split(' ');
    let line = '';
    let y = canvas.height / 2 - 100;
    const lineHeight = 70;

    for (let word of words) {
      const testLine = line + word + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && line !== '') {
        ctx.fillText(line, canvas.width / 2, y);
        line = word + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, canvas.width / 2, y);

    // Draw author
    if (editedPost.author) {
      ctx.font = `italic 32px ${editedPost.fontFamily}`;
      ctx.fillText(`— ${editedPost.author}`, canvas.width / 2, y + 100);
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
          <p className="tagline">Create stunning social media posts in seconds</p>
        </div>
      </header>

      <main className="main-content">
        {!showEditor ? (
          <div className="templates-grid">
            <h2 className="section-title">Choose Your Template</h2>
            <div className="grid">
              {templates.map((template, index) => (
                <div
                  key={template.id}
                  className="template-card"
                  style={{
                    animationDelay: `${index * 0.1}s`
                  }}
                  onClick={() => handleTemplateSelect(template)}
                >
                  <div
                    className="template-preview"
                    style={{
                      background: template.backgroundColor,
                      color: template.textColor,
                      fontFamily: template.fontFamily,
                    }}
                  >
                    <div className="preview-content">
                      <p className="preview-text">
                        {template.content.substring(0, 60)}
                        {template.content.length > 60 ? '...' : ''}
                      </p>
                      {template.author && (
                        <p className="preview-author">— {template.author}</p>
                      )}
                    </div>
                    <div 
                      className="accent-bar" 
                      style={{ backgroundColor: template.accentColor }}
                    />
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
              <h2>Edit Your Post</h2>
            </div>

            <div className="editor-layout">
              <div className="editor-controls">
                <div className="control-group">
                  <label>Content</label>
                  <textarea
                    value={editedPost.content}
                    onChange={(e) => handleInputChange('content', e.target.value)}
                    rows={5}
                    placeholder="Enter your message..."
                  />
                </div>

                <div className="control-group">
                  <label>Author (optional)</label>
                  <input
                    type="text"
                    value={editedPost.author}
                    onChange={(e) => handleInputChange('author', e.target.value)}
                    placeholder="Author name"
                  />
                </div>

                <div className="control-row">
                  <div className="control-group">
                    <label>Background Color</label>
                    <input
                      type="color"
                      value={editedPost.backgroundColor.startsWith('#') ? editedPost.backgroundColor : '#667eea'}
                      onChange={(e) => handleInputChange('backgroundColor', e.target.value)}
                    />
                  </div>

                  <div className="control-group">
                    <label>Text Color</label>
                    <input
                      type="color"
                      value={editedPost.textColor}
                      onChange={(e) => handleInputChange('textColor', e.target.value)}
                    />
                  </div>

                  <div className="control-group">
                    <label>Accent Color</label>
                    <input
                      type="color"
                      value={editedPost.accentColor}
                      onChange={(e) => handleInputChange('accentColor', e.target.value)}
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
                    <option value="Courier New, monospace">Courier New</option>
                    <option value="system-ui, sans-serif">System UI</option>
                    <option value="Trebuchet MS, sans-serif">Trebuchet MS</option>
                    <option value="Impact, sans-serif">Impact</option>
                    <option value="Palatino, serif">Palatino</option>
                  </select>
                </div>

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
                    className="post-preview"
                    style={{
                      background: editedPost.backgroundColor,
                      color: editedPost.textColor,
                      fontFamily: editedPost.fontFamily,
                    }}
                  >
                    <div 
                      className="accent-line accent-left" 
                      style={{ backgroundColor: editedPost.accentColor }}
                    />
                    <div 
                      className="accent-line accent-right" 
                      style={{ backgroundColor: editedPost.accentColor }}
                    />
                    <div className="post-content">
                      <p className="post-text">{editedPost.content}</p>
                      {editedPost.author && (
                        <p className="post-author">— {editedPost.author}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="footer">
        <p>Built with React & Flask • Made with ❤️</p>
      </footer>
    </div>
  );
};

export default App;
