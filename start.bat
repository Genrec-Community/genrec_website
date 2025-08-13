@echo off
REM Genrec Website Startup Script for Windows

echo 🚀 Starting Genrec Website...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 16+ first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm first.
    pause
    exit /b 1
)

REM Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install --legacy-peer-deps
)

REM Build the React app if build folder doesn't exist
if not exist "build" (
    echo 🔨 Building React app...
    npm run build
)

REM Start the production server
echo 🌟 Starting production server on http://localhost:5000
npm start
