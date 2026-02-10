#!/bin/bash

echo "🚀 Starting PostCraft - Social Media Post Generator"
echo "=================================================="
echo ""

# Check if we're in the right directory
if [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Error: Please run this script from the social-media-posts directory"
    exit 1
fi

# Start backend
echo "📦 Starting Flask backend..."
cd backend
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate
pip install -r requirements.txt > /dev/null 2>&1
python app.py &
BACKEND_PID=$!
cd ..

echo "✅ Backend started on http://localhost:5000"
echo ""

# Wait a moment for backend to start
sleep 2

# Start frontend
echo "⚛️  Starting React frontend..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "Installing npm packages..."
    npm install
fi

npm run dev &
FRONTEND_PID=$!
cd ..

echo "✅ Frontend started on http://localhost:3000"
echo ""
echo "=================================================="
echo "🎉 PostCraft is running!"
echo ""
echo "Frontend: http://localhost:3000"
echo "Backend:  http://localhost:5000"
echo ""
echo "Press Ctrl+C to stop both servers"
echo "=================================================="

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
