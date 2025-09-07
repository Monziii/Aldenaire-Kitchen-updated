#!/bin/bash

# Aldenaire Kitchen - Start Script
# This script starts both the PHP backend and React frontend

echo "🍽️  Starting Aldenaire Kitchen..."
echo "=================================="

# Check if PHP is installed
if ! command -v php &> /dev/null; then
    echo "❌ PHP is not installed. Please install PHP first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ All required software is installed."

# Start PHP Backend
echo ""
echo "🚀 Starting PHP Backend on http://localhost:8000"
echo "   Press Ctrl+C to stop the PHP server"
echo ""

# Start PHP server in background
php -S localhost:8000 &
PHP_PID=$!

# Wait a moment for PHP to start
sleep 2

# Check if PHP server started successfully
if curl -s http://localhost:8000 > /dev/null; then
    echo "✅ PHP Backend is running on http://localhost:8000"
else
    echo "❌ Failed to start PHP Backend"
    kill $PHP_PID 2>/dev/null
    exit 1
fi

# Start React Frontend
echo ""
echo "⚛️  Starting React Frontend on http://localhost:3000"
echo "   Press Ctrl+C to stop both servers"
echo ""

# Change to React directory and start
cd react-aldenaire

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing React dependencies..."
    npm install
fi

# Start React in background
npm start &
REACT_PID=$!

# Wait a moment for React to start
sleep 5

# Check if React started successfully
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ React Frontend is running on http://localhost:3000"
else
    echo "❌ Failed to start React Frontend"
    kill $PHP_PID $REACT_PID 2>/dev/null
    exit 1
fi

echo ""
echo "🎉 Aldenaire Kitchen is now running!"
echo "=================================="
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:8000"
echo "📊 Test DB:  http://localhost:8000/test_db.php"
echo ""
echo "📋 Available API Endpoints:"
echo "   • Menu:     http://localhost:8000/api/menu.php"
echo "   • Reviews:  http://localhost:8000/api/reviews.php"
echo "   • Contact:  http://localhost:8000/api/contact.php"
echo "   • Orders:   http://localhost:8000/api/orders.php"
echo ""
echo "Press Ctrl+C to stop all servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $PHP_PID $REACT_PID 2>/dev/null
    echo "✅ Servers stopped."
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Keep script running
wait 