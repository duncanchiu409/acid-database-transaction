#!/bin/bash

# Check for Node.js
if command -v node &> /dev/null; then
    echo "Node.js is installed, version: $(node -v)"
else
    echo "Node.js is not installed. Installing Node.js..."

    # Check the operating system and install Node.js accordingly
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # For Ubuntu/Debian
        sudo apt update
        sudo apt install -y nodejs npm
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # For macOS
        brew install node
    else
        echo "Unsupported OS. Please install Node.js manually."
        exit 1
    fi
fi

# Check for pnpm
if command -v npm &> /dev/null; then
    echo "npm is installed, version: $(npm -v)"
else
    echo "npm is not installed. Installing npm..."
    sudo apt install -y npm
fi

# Check if dependencies have been installed
if [ -d "node_modules" ]; then
    echo "npm install has been run before."
else
    echo "npm install has not been run. Installing dependencies..."
    npm install
fi

# Compile the TypeScript code
npx tsc

# Delete the database file
if [ -f "user.db" ]; then
    rm user.db
fi

# Run the compiled code
node dist/index.js