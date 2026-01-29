# Beautiful Mermaid - Obsidian Plugin

An Obsidian plugin that renders Mermaid diagrams using the [beautiful-mermaid](https://github.com/lukilabs/beautiful-mermaid) library, providing 15+ beautiful themes instead of the default Mermaid styling.

## Features

- ✨ **15 Beautiful Themes**: Tokyo Night, Catppuccin, Nord, Dracula, GitHub, Solarized, One Dark, and more
- 🎨 **Theme Selection**: Choose your preferred theme in settings
- 🌈 **Transparent Background**: Option to render diagrams with transparent backgrounds
- 🔄 **Auto-refresh**: Diagrams automatically update when you edit the code
- 📱 **Responsive**: Diagrams scale properly in reading and editing modes

## Installation

### From Source

1. Clone or download this repository
2. Navigate to the `obsidian-plugin` directory:
   ```bash
   cd obsidian-plugin
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
   
   **Note:** If `beautiful-mermaid` is not available on npm, install it from GitHub:
   ```bash
   npm install github:lukilabs/beautiful-mermaid
   ```

4. Build the plugin:
   ```bash
   npm run build
   ```

5. Copy the plugin files to your Obsidian vault:
   - Copy the entire `obsidian-plugin` folder to `.obsidian/plugins/beautiful-mermaid/` in your vault
   - Or create a symlink for development

6. Enable the plugin in Obsidian:
   - Go to Settings → Community Plugins
   - Find "Beautiful Mermaid" and enable it

### Manual Installation

1. Download the latest release (or build from source)
2. Extract the files to `.obsidian/plugins/beautiful-mermaid/` in your vault
3. The folder should contain:
   - `main.js`
   - `manifest.json`
   - `styles.css`
4. Enable the plugin in Obsidian settings

## Usage

Use `beautiful-mermaid` code blocks instead of the standard `mermaid` blocks:

````markdown
```beautiful-mermaid
graph TD
  A[Start] --> B{Decision}
  B -->|Yes| C[Process]
  B -->|No| D[End]
  C --> D
```
````

The plugin will render your Mermaid diagrams using the selected beautiful theme.

**Note:** Use `beautiful-mermaid` (not `mermaid`) as the code block type to use this plugin's rendering. Standard `mermaid` blocks will continue to use Obsidian's built-in renderer.

## Settings

Access settings via: **Settings → Beautiful Mermaid**

- **Theme**: Choose from 15 available themes
- **Transparent Background**: Enable/disable transparent backgrounds for diagrams

## Supported Diagram Types

- Flowcharts (`graph TD`, `graph LR`, etc.)
- Sequence Diagrams (`sequenceDiagram`)
- State Diagrams (`stateDiagram-v2`)
- Class Diagrams (`classDiagram`)
- ER Diagrams (`erDiagram`)

## Available Themes

- Zinc Light / Dark
- Tokyo Night / Tokyo Night Storm / Tokyo Night Light
- Catppuccin Mocha / Latte
- Nord / Nord Light
- Dracula
- GitHub Light / Dark
- Solarized Light / Dark
- One Dark

## Development

### Building

```bash
npm run build
```

### Development Mode

```bash
npm run dev
```

This will watch for changes and rebuild automatically.

### Project Structure

```
obsidian-plugin/
├── main.ts          # Main plugin code
├── styles.css       # Plugin styles
├── manifest.json    # Plugin manifest
├── package.json     # Dependencies
├── tsconfig.json    # TypeScript config
└── esbuild.config.mjs # Build configuration
```

## Troubleshooting

### Diagrams not rendering

1. Make sure the plugin is enabled in Settings → Community Plugins
2. Check that you're using the correct code block syntax: ` ```mermaid `
3. Try refreshing the view or restarting Obsidian

### Build errors

If you encounter build errors related to `beautiful-mermaid`:
- Try installing directly from GitHub: `npm install github:lukilabs/beautiful-mermaid`
- Make sure you have Node.js 16+ installed
- Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`

## Attribution

This plugin uses the [beautiful-mermaid](https://github.com/lukilabs/beautiful-mermaid) library by lukilabs for rendering Mermaid diagrams with beautiful themes.

## License

MIT
