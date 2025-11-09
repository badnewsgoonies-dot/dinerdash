# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

DinerDash City Mockup Builder is an interactive TypeScript + HTML5 Canvas application for designing city layouts using sprites from the vale-village project. It provides a drag-and-drop interface where users can browse categorized sprites (buildings, plants, furniture, infrastructure, statues, decorations) and arrange them on a canvas to create visual mockups.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Architecture

### Tech Stack
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **HTML5 Canvas** - Rendering engine for sprite display and manipulation
- **Vanilla JavaScript** - No framework dependencies

### Project Structure
```
dinerdash/
├── src/
│   ├── main.ts          # Application entry point
│   ├── types.ts         # TypeScript type definitions
│   ├── Canvas.ts        # Canvas rendering and interaction manager
│   ├── SpriteManager.ts # Sprite loading and organization
│   ├── UI.ts            # UI controls and event handling
│   └── styles.css       # Application styling
├── assets/              # Imported sprites from vale-village
│   ├── buildings/       # Organized by town (vale, bilibin, xian, etc.)
│   ├── plants/          # Trees, bushes, cacti, flowers
│   ├── furniture/       # Beds, tables, chairs, bookcases
│   ├── infrastructure/  # Wells, signs, fences, bridges
│   ├── statues/         # Elemental statues, monuments
│   └── decorations/     # Barrels, chests, boxes, stones
├── index.html           # Main HTML structure
└── package.json         # Project dependencies
```

### Core Components

**CanvasManager (Canvas.ts)**
- Manages canvas rendering and transformations
- Handles mouse interactions (click, drag, pan, zoom)
- Sprite selection and manipulation
- Grid display
- Export to PNG/JSON

**SpriteManager (SpriteManager.ts)**
- Loads all sprite assets from the assets/ directory
- Organizes sprites by category
- Provides sprite lookup by ID or category
- Tracks loading progress

**UIController (UI.ts)**
- Manages sidebar sprite browser
- Category filtering and search
- Toolbar button actions
- Drag-and-drop from sidebar to canvas
- Keyboard shortcuts

### Key Features

1. **Sprite Browser**: Categorized sidebar with searchable sprites
2. **Drag & Drop**: Drag sprites from sidebar onto canvas, or double-click to add to center
3. **Canvas Manipulation**:
   - Left-click to select/drag sprites
   - Right-click/middle-click/Shift+left-click to pan
   - Mouse wheel to zoom
   - Delete/Backspace to remove selected sprite
4. **Grid Toggle**: Optional grid overlay for alignment
5. **Export**:
   - PNG export: Renders canvas to image file
   - JSON export: Saves layout with sprite positions for later import
6. **Import**: Load previously saved JSON layouts

### Sprite Asset Organization

Sprites are imported from the vale-village project and organized by category:
- **Buildings**: Multiple architectural styles (medieval, Asian, desert, tents)
- **Plants**: Various trees, bushes, cacti, flowers
- **Furniture**: Indoor furnishings (beds, tables, chairs, bookcases)
- **Infrastructure**: Outdoor elements (wells, signs, fences, bridges, torches)
- **Statues**: Elemental statues and monuments
- **Decorations**: Miscellaneous items (barrels, chests, boxes, stones)

### Adding New Sprites

To add more sprites from vale-village:
1. Copy sprite files to appropriate `assets/` subdirectory
2. Add entries to `getSpriteList()` method in `src/SpriteManager.ts`
3. Sprites will automatically appear in the browser on next reload

### Canvas State Management

The canvas maintains state for:
- All placed sprites (position, size, rotation, z-index)
- Current selection
- Zoom level and pan offset
- Grid visibility

State can be serialized to JSON for save/load functionality.

### Keyboard Shortcuts
- **Delete/Backspace**: Remove selected sprite
- **Ctrl+S**: Save layout as JSON
