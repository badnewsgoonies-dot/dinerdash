# DinerDash City Mockup Builder

An interactive web-based tool for designing and visualizing city layouts using sprites from the vale-village project.

## Features

- **Drag & Drop Interface**: Easily place sprites on the canvas
- **Categorized Sprite Library**: Browse sprites by type (buildings, plants, furniture, etc.)
- **Interactive Canvas**:
  - Zoom and pan to explore your design
  - Select and move placed sprites
  - Optional grid overlay for precise alignment
- **Multiple Architectural Styles**: Mix and match buildings from different towns (Vale, Bilibin, Xian, Contigo, etc.)
- **Export Options**: Save your mockups as PNG images or JSON layouts
- **Import Layouts**: Load previously saved designs

## Getting Started

### Installation

```bash
npm install
```

### Running the Application

```bash
npm run dev
```

Then open your browser to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## How to Use

### Adding Sprites to Canvas

1. **Drag & Drop**: Click and drag any sprite from the sidebar onto the canvas
2. **Double-Click**: Double-click a sprite in the sidebar to add it to the center of the canvas

### Canvas Controls

- **Select Sprite**: Left-click on any placed sprite
- **Move Sprite**: Click and drag a selected sprite
- **Pan View**: Right-click and drag, or middle-click and drag, or Shift+left-click and drag
- **Zoom**: Use mouse wheel to zoom in/out
- **Delete Sprite**: Select a sprite and press Delete or Backspace

### Toolbar Features

- **Clear**: Remove all sprites from the canvas
- **Export PNG**: Download your mockup as an image
- **Save Layout**: Export your design as a JSON file
- **Load Layout**: Import a previously saved JSON layout
- **Show Grid**: Toggle grid overlay on/off

### Keyboard Shortcuts

- `Delete` / `Backspace`: Remove selected sprite
- `Ctrl + S`: Save layout as JSON

## Sprite Categories

- **Buildings**: Various architectural styles from different towns
- **Plants & Trees**: Natural elements for landscaping
- **Furniture**: Indoor furnishings and decorations
- **Infrastructure**: Wells, signs, fences, bridges, and more
- **Statues & Monuments**: Decorative statues and landmarks
- **Decorations**: Miscellaneous items like barrels, chests, boxes

## Adding More Sprites

To expand the sprite library:

1. Copy sprite files from vale-village to the appropriate `assets/` subdirectory
2. Update `src/SpriteManager.ts` by adding entries to the `getSpriteList()` method
3. Refresh the application

## Tech Stack

- TypeScript
- HTML5 Canvas
- Vite
- Vanilla JavaScript (no frameworks)

## Project Structure

```
dinerdash/
├── src/
│   ├── main.ts          # Entry point
│   ├── Canvas.ts        # Canvas rendering engine
│   ├── SpriteManager.ts # Sprite loading and management
│   ├── UI.ts            # User interface controls
│   ├── types.ts         # TypeScript definitions
│   └── styles.css       # Styling
├── assets/              # Sprite files organized by category
├── index.html           # Main HTML file
└── package.json         # Dependencies
```

## Tips

- Start with buildings to establish your city layout
- Use the grid to align structures precisely
- Layer decorations and plants to add depth
- Experiment with different architectural styles
- Save your work frequently using the "Save Layout" button
- Zoom out to see the full composition

## License

MIT
