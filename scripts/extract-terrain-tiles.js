const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

// Tile extraction configuration
const TILE_SIZE = 16; // Most Golden Sun tiles are 16x16
const SPRITE_SHEETS = [
    {
        file: 'assets/sprite-sheets/12-terrain-outdoor.png',
        category: 'terrain',
        prefix: 'outdoor'
    },
    {
        file: 'assets/sprite-sheets/13-terrain-indoor.png',
        category: 'terrain',
        prefix: 'indoor'
    }
];

async function extractTiles() {
    const outputDir = path.join(__dirname, '../assets/terrain');

    // Create terrain directory if it doesn't exist
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    let totalTilesExtracted = 0;

    for (const sheet of SPRITE_SHEETS) {
        const sheetPath = path.join(__dirname, '..', sheet.file);

        if (!fs.existsSync(sheetPath)) {
            console.log(`⚠️  Sprite sheet not found: ${sheet.file}`);
            continue;
        }

        console.log(`\n📄 Processing: ${sheet.file}`);

        try {
            const image = await loadImage(sheetPath);
            const width = image.width;
            const height = image.height;

            const tilesX = Math.floor(width / TILE_SIZE);
            const tilesY = Math.floor(height / TILE_SIZE);

            console.log(`   Size: ${width}x${height} pixels`);
            console.log(`   Grid: ${tilesX}x${tilesY} tiles (${tilesX * tilesY} total)`);

            let extracted = 0;

            for (let y = 0; y < tilesY; y++) {
                for (let x = 0; x < tilesX; x++) {
                    // Create a canvas for this tile
                    const canvas = createCanvas(TILE_SIZE, TILE_SIZE);
                    const ctx = canvas.getContext('2d');

                    // Draw the tile portion
                    ctx.drawImage(
                        image,
                        x * TILE_SIZE, y * TILE_SIZE,  // Source position
                        TILE_SIZE, TILE_SIZE,          // Source size
                        0, 0,                           // Dest position
                        TILE_SIZE, TILE_SIZE           // Dest size
                    );

                    // Check if tile is mostly transparent/empty
                    const imageData = ctx.getImageData(0, 0, TILE_SIZE, TILE_SIZE);
                    const pixels = imageData.data;
                    let nonTransparentPixels = 0;

                    for (let i = 3; i < pixels.length; i += 4) {
                        if (pixels[i] > 10) { // Alpha > 10
                            nonTransparentPixels++;
                        }
                    }

                    // Skip mostly empty tiles
                    if (nonTransparentPixels < 10) {
                        continue;
                    }

                    // Save the tile
                    const tileName = `${sheet.prefix}-tile-${String(y).padStart(2, '0')}-${String(x).padStart(2, '0')}.png`;
                    const tilePath = path.join(outputDir, tileName);

                    const buffer = canvas.toBuffer('image/png');
                    fs.writeFileSync(tilePath, buffer);

                    extracted++;
                    totalTilesExtracted++;
                }
            }

            console.log(`   ✅ Extracted ${extracted} non-empty tiles`);

        } catch (error) {
            console.error(`   ❌ Error processing ${sheet.file}:`, error.message);
        }
    }

    console.log(`\n🎉 Total tiles extracted: ${totalTilesExtracted}`);
    console.log(`📁 Saved to: assets/terrain/`);
    console.log(`\n✅ Next steps:`);
    console.log(`   1. Run: node scripts/generate-sprite-list.js`);
    console.log(`   2. Refresh your browser to see terrain tiles!`);
}

extractTiles().catch(console.error);
