#!/bin/bash

# Genrec Website Startup Script

echo "🚀 Starting Genrec Website..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install --legacy-peer-deps
fi

# Build the React app if build folder doesn't exist
if [ ! -d "build" ]; then
    echo "🔨 Building React app..."
    npm run build
fi

# Start the production server
echo "🌟 Starting production server on http://localhost:5000"
npm start
