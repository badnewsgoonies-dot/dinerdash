# Terrain & Ground Tiles Guide

## Overview

Vale-village includes comprehensive terrain sprite sheets with ground tiles, paths, roads, and floor textures. These are currently available as sprite sheets that need to be extracted into individual tiles.

## Available Terrain Sprite Sheets

### 1. Outdoor Terrain (12-terrain-outdoor.png)
- **Location**: `assets/sprite-sheets/12-terrain-outdoor.png`
- **Tile Count**: 144 sprites
- **Contents**:
  - Grass tiles (various shades)
  - Dirt paths
  - Stone roads
  - Water edges and shores
  - Sand and desert ground
  - Forest floor
  - Mountain terrain
  - Bridge planks
  - Fence sections

### 2. Indoor Terrain (13-terrain-indoor.png)
- **Location**: `assets/sprite-sheets/13-terrain-indoor.png`
- **Tile Count**: 241 sprites
- **Contents**:
  - Wooden floors (various patterns)
  - Stone floors
  - Carpet and rugs
  - Tile floors
  - Wall sections
  - Doorways
  - Stairs
  - Windows

## How to Use Terrain Tiles

### Option 1: View the Sprite Sheets
Open `terrain-reference.html` in your browser to see all available sprite sheets:
```
http://localhost:5173/terrain-reference.html
```

### Option 2: Extract Individual Tiles

1. **Open the sprite sheet** in an image editor (Photoshop, GIMP, Aseprite, etc.)
2. **Identify the tiles you want** - most tiles are 16x16 or 32x32 pixels
3. **Extract and save** individual tiles to `assets/terrain/`
4. **Regenerate the sprite list**:
   ```bash
   node scripts/generate-sprite-list.js
   ```
5. **Reload the app** - your new terrain tiles will appear in the browser!

### Option 3: Use Sprite Sheets Directly

For advanced users, you can:
1. Load the sprite sheet as a single image
2. Use sprite coordinates to select specific tiles
3. Render tiles programmatically in the canvas

## Tile Dimensions

Most terrain tiles in Golden Sun sprites are:
- **16x16 pixels** - Small ground tiles
- **32x32 pixels** - Standard terrain tiles
- **Custom sizes** - Special terrain features

## Adding Terrain to Your Mockup Builder

### Step 1: Create Terrain Category

Edit `src/types.ts` to add 'terrain' category:
```typescript
export type Category = 'buildings' | 'plants' | 'furniture' | 'infrastructure' | 'statues' | 'decorations' | 'terrain';
```

### Step 2: Extract Tiles

Use an image editor to extract individual tiles from the sprite sheets.

### Step 3: Add to Assets

Save extracted tiles to `assets/terrain/`:
```
assets/terrain/
  ├── grass-01.gif
  ├── dirt-path-01.gif
  ├── stone-road-01.gif
  ├── water-edge-01.gif
  └── ...
```

### Step 4: Update Sprite List

```bash
node scripts/generate-sprite-list.js
```

### Step 5: Update UI

Add terrain category to `index.html`:
```html
<div class="category" data-category="terrain">
    <h3>Terrain & Ground</h3>
    <div class="category-content" id="terrain-content"></div>
</div>
```

## Common Terrain Patterns

### Creating Roads
Use stone and dirt path tiles in sequence to create roads through your city.

### Creating Grass Areas
Grass tiles can be repeated to create parks and green spaces.

### Creating Water Features
Water edge tiles can create ponds, rivers, or coastlines.

### Creating Indoor Floors
Wooden and stone floor tiles can create interior room layouts.

## Recommended Tools for Tile Extraction

- **Aseprite** - Best for pixel art and sprite extraction
- **GIMP** - Free and powerful image editor
- **Photoshop** - Industry standard
- **Paint.NET** - Lightweight and free

## Current Status

✅ Sprite sheets imported to `assets/sprite-sheets/`
✅ 543 individual sprites loaded
⏳ Terrain tiles ready to be extracted
⏳ Terrain category ready to be added

## Quick Start

1. Open `terrain-reference.html` to browse available tiles
2. Extract tiles you need
3. Run the sprite list generator
4. Start building with terrain!
