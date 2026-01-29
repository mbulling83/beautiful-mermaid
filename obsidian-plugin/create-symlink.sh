#!/bin/bash

# Script to create a symlink for the Beautiful Mermaid Obsidian plugin
# This links the plugin directory to your Obsidian vault's plugins folder

# Get the absolute path to the plugin directory
PLUGIN_DIR="$(cd "$(dirname "$0")" && pwd)"
PLUGIN_NAME="beautiful-mermaid"

# Common Obsidian vault locations (uncomment and modify as needed)
# For macOS:
# VAULT_PATH="$HOME/Documents/Obsidian Vault"
# VAULT_PATH="$HOME/Obsidian"
# VAULT_PATH="$HOME/vault"

# For Linux:
# VAULT_PATH="$HOME/Documents/Obsidian"
# VAULT_PATH="$HOME/.obsidian"

# For Windows (WSL):
# VAULT_PATH="/mnt/c/Users/YourName/Documents/Obsidian Vault"

# If you passed a vault path as an argument, use it
if [ -n "$1" ]; then
    VAULT_PATH="$1"
else
    echo "Usage: ./create-symlink.sh <path-to-obsidian-vault>"
    echo ""
    echo "Example: ./create-symlink.sh ~/Documents/MyVault"
    echo ""
    echo "Please provide the path to your Obsidian vault:"
    read -r VAULT_PATH
fi

# Expand tilde and resolve to absolute path
VAULT_PATH=$(eval echo "$VAULT_PATH")
VAULT_PATH=$(cd "$VAULT_PATH" 2>/dev/null && pwd)

if [ ! -d "$VAULT_PATH" ]; then
    echo "Error: Vault path does not exist: $VAULT_PATH"
    exit 1
fi

# Create .obsidian/plugins directory if it doesn't exist
PLUGINS_DIR="$VAULT_PATH/.obsidian/plugins"
mkdir -p "$PLUGINS_DIR"

# Target symlink path
SYMLINK_PATH="$PLUGINS_DIR/$PLUGIN_NAME"

# Remove existing symlink or directory if it exists
if [ -L "$SYMLINK_PATH" ]; then
    echo "Removing existing symlink..."
    rm "$SYMLINK_PATH"
elif [ -d "$SYMLINK_PATH" ]; then
    echo "Warning: $SYMLINK_PATH already exists as a directory."
    echo "Do you want to remove it and create a symlink? (y/n)"
    read -r response
    if [ "$response" = "y" ] || [ "$response" = "Y" ]; then
        rm -rf "$SYMLINK_PATH"
    else
        echo "Aborted."
        exit 1
    fi
fi

# Create the symlink
echo "Creating symlink..."
echo "  From: $PLUGIN_DIR"
echo "  To:   $SYMLINK_PATH"

ln -s "$PLUGIN_DIR" "$SYMLINK_PATH"

if [ $? -eq 0 ]; then
    echo ""
    echo "✓ Symlink created successfully!"
    echo ""
    echo "Next steps:"
    echo "1. Restart Obsidian or reload the app"
    echo "2. Go to Settings → Community Plugins"
    echo "3. Enable 'Beautiful Mermaid'"
    echo ""
    echo "To build the plugin, run: npm run build"
    echo "To watch for changes during development: npm run dev"
else
    echo "Error: Failed to create symlink"
    exit 1
fi
