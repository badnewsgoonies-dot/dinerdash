const fs = require('fs');
const path = require('path');

// Instead of showing all 2584 tiles, let's curate a useful selection
// We'll sample every Nth tile to get variety without overwhelming the browser

const SAMPLE_RATE = 8; // Show every 8th tile = ~323 terrain tiles instead of 2584
const terrainDir = path.join(__dirname, '../assets/terrain');
const curatedDir = path.join(__dirname, '../assets/terrain-curated');

// Create curated directory
if (!fs.existsSync(curatedDir)) {
    fs.mkdirSync(curatedDir, { recursive: true });
}

// Get all terrain files
const allFiles = fs.readdirSync(terrainDir)
    .filter(f => f.endsWith('.png'))
    .sort();

console.log(`📊 Total terrain tiles: ${allFiles.length}`);

// Sample tiles
const outdoorFiles = allFiles.filter(f => f.startsWith('outdoor-'));
const indoorFiles = allFiles.filter(f => f.startsWith('indoor-'));

console.log(`   Outdoor: ${outdoorFiles.length}`);
console.log(`   Indoor: ${indoorFiles.length}`);

// Copy every Nth file
let copied = 0;

outdoorFiles.forEach((file, index) => {
    if (index % SAMPLE_RATE === 0) {
        const src = path.join(terrainDir, file);
        const dest = path.join(curatedDir, file);
        fs.copyFileSync(src, dest);
        copied++;
    }
});

indoorFiles.forEach((file, index) => {
    if (index % SAMPLE_RATE === 0) {
        const src = path.join(terrainDir, file);
        const dest = path.join(curatedDir, file);
        fs.copyFileSync(src, dest);
        copied++;
    }
});

console.log(`\n✅ Curated ${copied} tiles (every ${SAMPLE_RATE}th tile)`);
console.log(`📁 Saved to: assets/terrain-curated/`);
console.log(`\n💡 This gives you variety without overwhelming the browser!`);
console.log(`   All ${allFiles.length} tiles are still available in assets/terrain/`);
