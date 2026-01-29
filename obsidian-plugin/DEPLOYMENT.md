# Deployment Guide

This guide explains how to deploy the Beautiful Mermaid Obsidian plugin.

## Prerequisites

- Node.js 16+ installed
- npm or yarn package manager
- Access to your Obsidian vault

## Building for Deployment

1. **Install Dependencies**

   ```bash
   cd obsidian-plugin
   npm install
   ```

   If `beautiful-mermaid` is not on npm, install from GitHub:
   ```bash
   npm install github:lukilabs/beautiful-mermaid
   ```

2. **Build the Plugin**

   ```bash
   npm run build
   ```

   This will create:
   - `main.js` - The compiled plugin code
   - `main.js.map` - Source map (optional, for debugging)

3. **Verify Build Output**

   After building, you should have these files:
   - `main.js`
   - `manifest.json`
   - `styles.css`

## Installation Methods

### Method 1: Manual Installation (Recommended for Testing)

1. Copy the plugin folder to your Obsidian vault:
   ```
   .obsidian/plugins/beautiful-mermaid/
   ```

2. The folder structure should be:
   ```
   .obsidian/plugins/beautiful-mermaid/
   ├── main.js
   ├── manifest.json
   ├── styles.css
   ```

3. Restart Obsidian or reload the app

4. Enable the plugin:
   - Settings → Community Plugins
   - Find "Beautiful Mermaid"
   - Toggle it on

### Method 2: Development Symlink (For Development)

1. Create a symlink from your vault to the plugin directory:
   ```bash
   ln -s /path/to/beautiful-mermaid/obsidian-plugin ~/.obsidian/plugins/beautiful-mermaid
   ```

2. Build and watch for changes:
   ```bash
   npm run dev
   ```

3. Changes will automatically rebuild

### Method 3: Publishing to Community Plugins

To publish to the Obsidian Community Plugins repository:

1. **Create a GitHub Release**
   - Tag the release with version number (e.g., `v1.0.0`)
   - Upload the built files as release assets:
     - `main.js`
     - `manifest.json`
     - `styles.css`

2. **Submit to Obsidian**
   - Follow the [Obsidian Plugin Publishing Guide](https://github.com/obsidianmd/obsidian-releases)
   - Create a pull request to the `obsidian-releases` repository
   - Include your plugin information

3. **Required Files for Submission**
   - `main.js` (compiled)
   - `manifest.json`
   - `styles.css`
   - `README.md` (optional but recommended)

## Version Management

The plugin uses semantic versioning. To bump the version:

1. Update `version` in `manifest.json`
2. Update `version` in `package.json`
3. Create a git tag: `git tag v1.0.0`
4. Build and test
5. Create a release

## Testing Before Deployment

1. **Test in Development Mode**
   ```bash
   npm run dev
   ```

2. **Test Different Themes**
   - Create Mermaid diagrams
   - Switch themes in settings
   - Verify all themes render correctly

3. **Test Different Diagram Types**
   - Flowcharts
   - Sequence diagrams
   - State diagrams
   - Class diagrams
   - ER diagrams

4. **Test Error Handling**
   - Try invalid Mermaid syntax
   - Verify error messages display correctly

## Troubleshooting

### Build Fails

- Check Node.js version: `node --version` (should be 16+)
- Clear node_modules: `rm -rf node_modules && npm install`
- Check for TypeScript errors: `npm run build` will show them

### Plugin Doesn't Load

- Verify all files are in the correct location
- Check `manifest.json` syntax is valid JSON
- Check Obsidian console for errors (Ctrl+Shift+I)

### Diagrams Don't Render

- Verify plugin is enabled
- Check browser console for errors
- Try refreshing the view
- Verify `beautiful-mermaid` dependency is installed

## Distribution

### For Personal Use

Simply copy the built files to your vault's plugins folder.

### For Sharing

Create a zip file containing:
- `main.js`
- `manifest.json`
- `styles.css`
- `README.md` (optional)

Users can extract this to their `.obsidian/plugins/beautiful-mermaid/` folder.

### For Community Plugins

Follow the official Obsidian plugin submission process.
