import { SpriteData, Category } from './types';
import { SPRITE_LIST } from './sprite-list-generated';

export class SpriteManager {
    private sprites: Map<string, SpriteData> = new Map();
    private spritesByCategory: Map<Category, SpriteData[]> = new Map();
    private loadedCount: number = 0;
    private totalCount: number = 0;

    constructor() {
        this.initializeCategories();
    }

    private initializeCategories() {
        const categories: Category[] = ['buildings', 'plants', 'furniture', 'infrastructure', 'statues', 'decorations', 'terrain'];
        categories.forEach(cat => this.spritesByCategory.set(cat, []));
    }

    async loadSprites(): Promise<void> {
        // This will load sprite metadata
        // For now, we'll use a curated list of sprites from vale-village
        const spriteList = this.getSpriteList();
        this.totalCount = spriteList.length;

        const loadPromises = spriteList.map(spriteInfo => this.loadSprite(spriteInfo));
        await Promise.all(loadPromises);
    }

    private async loadSprite(info: { name: string, path: string, category: Category }): Promise<void> {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const sprite: SpriteData = {
                    id: `${info.category}-${info.name}`,
                    name: info.name,
                    category: info.category,
                    path: info.path,
                    image: img,
                    width: img.width,
                    height: img.height
                };
                this.sprites.set(sprite.id, sprite);
                this.spritesByCategory.get(info.category as Category)?.push(sprite);
                this.loadedCount++;
                resolve();
            };
            img.onerror = () => {
                console.warn(`Failed to load sprite: ${info.path}`);
                this.loadedCount++;
                resolve(); // Continue even if a sprite fails
            };
            img.src = info.path;
        });
    }

    private getSpriteList(): Array<{ name: string, path: string, category: Category }> {
        return SPRITE_LIST as Array<{ name: string, path: string, category: Category }>;
    }

    getSpriteById(id: string): SpriteData | undefined {
        return this.sprites.get(id);
    }

    getSpritesByCategory(category: Category): SpriteData[] {
        return this.spritesByCategory.get(category) || [];
    }

    getAllSprites(): SpriteData[] {
        return Array.from(this.sprites.values());
    }

    getLoadProgress(): { loaded: number, total: number, percentage: number } {
        return {
            loaded: this.loadedCount,
            total: this.totalCount,
            percentage: this.totalCount > 0 ? (this.loadedCount / this.totalCount) * 100 : 0
        };
    }
}
