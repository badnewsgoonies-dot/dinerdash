import { Category } from './types';

export interface SubcategoryConfig {
    [category: string]: {
        [subcategory: string]: (spriteName: string) => boolean;
    };
}

export const SUBCATEGORIES: SubcategoryConfig = {
    buildings: {
        'Vale': (name) => name.toLowerCase().includes('vale'),
        'Bilibin': (name) => name.toLowerCase().includes('bilibin'),
        'Xian': (name) => name.toLowerCase().includes('xian'),
        'Kalay': (name) => name.toLowerCase().includes('kalay'),
        'Madra': (name) => name.toLowerCase().includes('madra'),
        'Tolbi': (name) => name.toLowerCase().includes('tolbi'),
        'Alhafra': (name) => name.toLowerCase().includes('alhafra'),
        'Contigo': (name) => name.toLowerCase().includes('contigo'),
        'Daila': (name) => name.toLowerCase().includes('daila'),
        'Imil': (name) => name.toLowerCase().includes('imil'),
        'Kibombo': (name) => name.toLowerCase().includes('kibombo'),
        'Lunpa': (name) => name.toLowerCase().includes('lunpa'),
        'Vault': (name) => name.toLowerCase().includes('vault'),
        'Yallam': (name) => name.toLowerCase().includes('yallam'),
    },
    plants: {
        'Trees': (name) => name.toLowerCase().includes('tree'),
        'Bushes & Shrubs': (name) => name.toLowerCase().includes('bush') || name.toLowerCase().includes('shrub'),
        'Cacti': (name) => name.toLowerCase().includes('cactus') || name.toLowerCase().includes('cacti'),
        'Flowers & Other': (name) => name.toLowerCase().includes('flower') || name.toLowerCase().includes('palm') || name.toLowerCase().includes('leaf'),
    },
    furniture: {
        'Beds': (name) => name.toLowerCase().includes('bed') || name.toLowerCase().includes('hammock'),
        'Tables & Desks': (name) => name.toLowerCase().includes('table') || name.toLowerCase().includes('desk'),
        'Chairs & Stools': (name) => name.toLowerCase().includes('chair') || name.toLowerCase().includes('stool'),
        'Bookcases': (name) => name.toLowerCase().includes('bookcase'),
        'Rugs & Carpets': (name) => name.toLowerCase().includes('rug') || name.toLowerCase().includes('mat'),
        'Counters': (name) => name.toLowerCase().includes('counter'),
        'Other Furniture': (name) => !name.toLowerCase().match(/(bed|table|desk|chair|stool|bookcase|rug|mat|counter)/),
    },
    infrastructure: {
        'Wells': (name) => name.toLowerCase().includes('well'),
        'Signs': (name) => name.toLowerCase().includes('sign'),
        'Fences': (name) => name.toLowerCase().includes('fence'),
        'Bridges & Ladders': (name) => name.toLowerCase().includes('bridge') || name.toLowerCase().includes('ladder'),
        'Torches & Lighting': (name) => name.toLowerCase().includes('torch') || name.toLowerCase().includes('lamp') || name.toLowerCase().includes('lantern'),
        'Gates & Doors': (name) => name.toLowerCase().includes('gate') || name.toLowerCase().includes('door'),
        'Other Infrastructure': (name) => !name.toLowerCase().match(/(well|sign|fence|bridge|ladder|torch|lamp|lantern|gate|door)/),
    },
    statues: {
        'Elemental Statues': (name) => name.toLowerCase().includes('jupiter') || name.toLowerCase().includes('mars') || name.toLowerCase().includes('mercury') || name.toLowerCase().includes('venus'),
        'Dragons': (name) => name.toLowerCase().includes('dragon'),
        'Town Monuments': (name) => !name.toLowerCase().match(/(jupiter|mars|mercury|venus|dragon)/),
    },
    decorations: {
        'Barrels & Boxes': (name) => name.toLowerCase().includes('barrel') || name.toLowerCase().includes('box') || name.toLowerCase().includes('crate'),
        'Chests': (name) => name.toLowerCase().includes('chest'),
        'Jars & Bottles': (name) => name.toLowerCase().includes('jar') || name.toLowerCase().includes('bottle') || name.toLowerCase().includes('potion'),
        'Stones': (name) => name.toLowerCase().includes('stone') || name.toLowerCase().includes('boulder') || name.toLowerCase().includes('rock'),
        'Stumps': (name) => name.toLowerCase().includes('stump'),
        'Other Decorations': (name) => !name.toLowerCase().match(/(barrel|box|crate|chest|jar|bottle|potion|stone|boulder|rock|stump)/),
    },
    terrain: {
        'Indoor': (name) => name.toLowerCase().includes('indoor'),
        'Outdoor': (name) => name.toLowerCase().includes('outdoor'),
    }
};
