const fs = require('fs');
const path = require('path');

const categories = {
    'buildings': ['vale', 'bilibin', 'xian', 'contigo', 'tolbi', 'alhafra', 'kalay', 'madra', 'vault', 'yallam', 'kibombo', 'daila', 'imil', 'lunpa'],
    'plants': ['.'],
    'furniture': ['.'],
    'infrastructure': ['.'],
    'statues': ['.'],
    'decorations': ['.'],
    'terrain': ['terrain-curated']  // Use curated selection instead of all tiles
};

const assetsDir = path.join(__dirname, '../assets');
const spriteList = [];

function scanDirectory(category, subdir) {
    let fullPath;

    // Special handling for terrain-curated
    if (subdir === 'terrain-curated') {
        fullPath = path.join(assetsDir, subdir);
    } else {
        fullPath = path.join(assetsDir, category, subdir);
    }

    if (!fs.existsSync(fullPath)) return;

    const files = fs.readdirSync(fullPath);
    files.forEach(file => {
        if (file.endsWith('.gif') || file.endsWith('.png')) {
            const name = file.replace('.gif', '').replace('.png', '').replace(/_/g, ' ').replace(/-/g, ' ');

            let relativePath;
            if (subdir === 'terrain-curated') {
                relativePath = `/assets/terrain-curated/${file}`;
            } else if (subdir === '.') {
                relativePath = `/assets/${category}/${file}`;
            } else {
                relativePath = `/assets/${category}/${subdir}/${file}`;
            }

            spriteList.push({
                name,
                path: relativePath,
                category
            });
        }
    });
}

// Scan all categories
for (const [category, subdirs] of Object.entries(categories)) {
    subdirs.forEach(subdir => scanDirectory(category, subdir));
}

// Generate TypeScript code
const tsCode = `// Auto-generated sprite list
// Run 'node scripts/generate-sprite-list.js' to regenerate

export const SPRITE_LIST = ${JSON.stringify(spriteList, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '../src/sprite-list-generated.ts'), tsCode);

console.log(`Generated ${spriteList.length} sprite entries!`);
console.log('Breakdown by category:');
Object.keys(categories).forEach(cat => {
    const count = spriteList.filter(s => s.category === cat).length;
    console.log(`  ${cat}: ${count}`);
});
