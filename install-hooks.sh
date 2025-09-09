#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

echo "Installing Git hooks..."

if [ ! -d ".git" ]; then
    echo "Not a Git repository"
    exit 1
fi

if [ ! -d "hooks" ]; then
    echo "hooks/ directory not found"
    exit 1
fi

mkdir -p .git/hooks

if [ -f "hooks/pre-commit" ]; then
    cp hooks/pre-commit .git/hooks/pre-commit
    chmod +x .git/hooks/pre-commit
    echo "Pre-commit hook installed"
else
    echo "hooks/pre-commit not found"
    exit 1
fi

echo "Installation complete"