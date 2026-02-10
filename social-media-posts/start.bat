@echo off
echo Starting PostCraft - Social Media Post Generator
echo ==================================================
echo.

REM Check if we're in the right directory
if not exist "backend" (
    echo Error: Please run this script from the social-media-posts directory
    exit /b 1
)
if not exist "frontend" (
    echo Error: Please run this script from the social-media-posts directory
    exit /b 1
)

REM Start backend
echo Starting Flask backend...
cd backend
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

call venv\Scripts\activate.bat
pip install -r requirements.txt >nul 2>&1
start /b python app.py
cd ..

echo Backend started on http://localhost:5000
echo.

REM Wait for backend to start
timeout /t 2 /nobreak >nul

REM Start frontend
echo Starting React frontend...
cd frontend
if not exist "node_modules" (
    echo Installing npm packages...
    call npm install
)

start /b npm run dev
cd ..

echo Frontend started on http://localhost:3000
echo.
echo ==================================================
echo PostCraft is running!
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo.
echo Press Ctrl+C to stop both servers
echo ==================================================

pause
