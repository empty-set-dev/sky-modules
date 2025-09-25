#!/bin/bash

# Find Universal Components Script
# Usage: ./find-universal.sh [--simple] [--save]

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Check if we should use simple mode
if [[ " $* " == *" --simple "* ]]; then
    SCRIPT="$PROJECT_ROOT/list-universal-components.ts"
    echo "🔍 Running simple universal components finder..."
else
    SCRIPT="$PROJECT_ROOT/find-universal-annotations.ts"
    echo "🔍 Running detailed universal components finder..."
fi

# Try different TypeScript runners
if command -v tsx &> /dev/null; then
    npx tsx "$SCRIPT" "$@"
elif command -v ts-node &> /dev/null; then
    npx ts-node "$SCRIPT" "$@"
elif node -e "require('tsx')" 2>/dev/null; then
    npx tsx "$SCRIPT" "$@"
elif node -e "require('ts-node')" 2>/dev/null; then
    npx ts-node "$SCRIPT" "$@"
else
    echo "❌ TypeScript runner not found. Please install tsx or ts-node:"
    echo "   npm install -g tsx"
    echo "   or"
    echo "   npm install -g ts-node"
    exit 1
fi