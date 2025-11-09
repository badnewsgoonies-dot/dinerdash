# Terrain Tiles - What You Have Now

## ✅ Problem Solved!

The browser was struggling to load **2,584 terrain tiles** at once. I've created a **curated selection of 323 tiles** that gives you variety without freezing the browser!

## 📊 Current Terrain Setup

### In Your Mockup Builder (http://localhost:5173)
- **323 curated terrain tiles** in the "Terrain & Ground" category
- Sampled every 8th tile from both indoor and outdoor terrain
- Fast loading, smooth performance
- Still gives you great variety for:
  - Grass patterns
  - Dirt and stone paths
  - Water edges
  - Floor tiles
  - Wall sections
  - Stairs and doorways

### Full Collection Available
All **2,584 original terrain tiles** are still saved in:
- `assets/terrain/` - Complete collection (2,584 tiles)
- `assets/terrain-curated/` - Curated selection (323 tiles) ← Currently shown in app

## 🎨 What's in the Curated Selection

**Outdoor Terrain (~119 tiles):**
- Grass tiles (various shades)
- Dirt paths
- Stone roads
- Water edges
- Sand and desert ground
- Rocky terrain

**Indoor Terrain (~204 tiles):**
- Wooden floor patterns
- Stone floors
- Carpet tiles
- Wall sections
- Doorways
- Stairs

## 🔧 Want More Terrain Tiles?

### Option 1: Adjust the Sample Rate
Edit `scripts/curate-terrain-tiles.js` and change:
```javascript
const SAMPLE_RATE = 8; // Lower number = more tiles (4 = ~646 tiles, 2 = ~1292 tiles)
```

Then run:
```bash
node scripts/curate-terrain-tiles.js
node scripts/generate-sprite-list.js
```

### Option 2: Use All Terrain Tiles (Not Recommended)
If you really want all 2,584 tiles (warning: may freeze browser):
```javascript
// In scripts/generate-sprite-list.js, change:
'terrain': ['.']  // This loads all tiles from assets/terrain/
```

### Option 3: Hand-Pick Specific Tiles
1. Browse `assets/terrain/` folder
2. Copy your favorite tiles to `assets/terrain-curated/`
3. Run `node scripts/generate-sprite-list.js`

## 📈 Total Sprite Count

| Category | Count |
|----------|-------|
| Buildings | 79 |
| Plants | 47 |
| Furniture | 103 |
| Infrastructure | 143 |
| Statues | 27 |
| Decorations | 144 |
| **Terrain (Curated)** | **323** |
| **TOTAL** | **866** |

This is the optimal balance between variety and performance!

## 💡 Using Terrain Tiles in Your Mockup

1. **Create ground layers first** - Place terrain tiles before buildings
2. **Use repeating patterns** - Drag multiple tiles to create roads/paths
3. **Layer strategically** - Buildings should be on top of terrain
4. **Mix terrain types** - Combine grass + stone paths for variety

## 🚀 Your Browser

The terrain tiles should now be visible in the "Terrain & Ground" category at http://localhost:5173!

If you still see a blank category:
1. Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R)
2. Check browser console (F12) for any errors
3. Make sure you're scrolled to the bottom of the sidebar to see the terrain category
