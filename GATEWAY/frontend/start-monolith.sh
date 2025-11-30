#!/bin/bash

# Start Axiom Monolith
echo "🚀 Starting Axiom Monolith..."

# Check for MongoDB
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start it with 'sudo systemctl start mongod' or similar."
    # Optional: try to start it? No, better to warn.
fi

# Check for Redis
if ! pgrep -x "redis-server" > /dev/null; then
    echo "⚠️  Redis is not running. Please start it with 'redis-server' or similar."
fi

cd backend/monolith

if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

echo "Starting server..."
npm start
