#!/bin/bash

# Simple local server for testing the Family Tree App
# Usage: ./serve.sh
# Then open http://localhost:8000 in your browser

echo "Starting Family Tree App server..."
echo "Open your browser and visit: http://localhost:8000"
echo "Press Ctrl+C to stop the server"

# Check if Python is available
if command -v python3 &> /dev/null; then
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    python -m SimpleHTTPServer 8000
else
    echo "Error: Python is required to run this server"
    echo "Please install Python or use any other HTTP server"
    exit 1
fi
