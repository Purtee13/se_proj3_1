#!/usr/bin/env bash

# ==========================================================

# start_all.sh

# Universal startup for Codespaces & local dev

# ==========================================================

# Function to check if port is free

is_port_free() {
! lsof -i:"$1" >/dev/null 2>&1
}

echo "🔹 Making scripts executable..."
chmod +x .devcontainer/post-create.sh .devcontainer/post-start.sh

echo "🔹 Running full setup..."

# Run post-create (migrations + seed)

bash .devcontainer/post-create.sh

# Start servers only if ports are free

if is_port_free 3000; then
echo "🚀 Starting Next.js on port 3000..."
bash -c "pnpm dev &"
else
echo "⚠️ Port 3000 is already in use, skipping Next.js start"
fi

if [ -d "ws-server" ]; then
if is_port_free 4001; then
echo "🚀 Starting WS Server on port 4001..."
bash -c "cd ws-server && pnpm dev &"
else
echo "⚠️ Port 4001 is already in use, skipping WS Server start"
fi
fi

echo "✅ Startup complete!"
echo "Next.js → [http://localhost:3000](http://localhost:3000)"
echo "WS Server → [http://localhost:4001](http://localhost:4001) (if used)"
