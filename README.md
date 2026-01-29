# Beautiful Mermaid Editor

A self-hosted, single-page web application for creating and exporting beautiful Mermaid diagrams using the [beautiful-mermaid](https://github.com/lukilabs/beautiful-mermaid) library.

## Features

- ✨ **Beautiful Themes**: 15 carefully curated themes including Tokyo Night, Catppuccin, Nord, Dracula, and more
- 📝 **Live Preview**: Real-time rendering as you type
- 💾 **SVG Export**: One-click export to SVG format
- 📱 **Responsive**: Works on desktop and mobile devices
- 🎨 **Example Diagrams**: Quick-start templates for flowcharts, sequence diagrams, state diagrams, class diagrams, and ER diagrams

## Getting Started

### Installation

1. Install dependencies:
```bash
npm install
```

   **Note:** If `beautiful-mermaid` is not available on npm, you can install it directly from GitHub:
   ```bash
   npm install github:lukilabs/beautiful-mermaid
   ```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to the URL shown (typically `http://localhost:5173`)

### Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory. You can serve these files with any static web server.

### Self-Hosting

The built files in `dist` can be served from:
- Any static file server (nginx, Apache, etc.)
- GitHub Pages
- Netlify, Vercel, or similar platforms
- A simple Python HTTP server: `python -m http.server` in the `dist` directory

## Usage

1. **Enter Mermaid Code**: Type or paste your Mermaid diagram code in the left editor panel
2. **Select Theme**: Choose from 15 beautiful themes using the dropdown
3. **Preview**: See your diagram rendered in real-time on the right
4. **Export**: Click "Export SVG" to download your diagram as an SVG file

## Supported Diagram Types

- Flowcharts (`graph TD`, `graph LR`, etc.)
- Sequence Diagrams (`sequenceDiagram`)
- State Diagrams (`stateDiagram-v2`)
- Class Diagrams (`classDiagram`)
- ER Diagrams (`erDiagram`)

## Example Diagrams

Click any example button to load a template:
- **Flowchart**: Basic decision flow
- **Sequence**: Communication between actors
- **State**: State machine diagram
- **Class**: Object-oriented class relationships
- **ER**: Entity-relationship database diagram

## License

MIT
