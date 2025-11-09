import { SpriteManager } from './SpriteManager';
import { CanvasManager } from './Canvas';
import { UIController } from './UI';

class MockupBuilder {
    private spriteManager: SpriteManager;
    private canvasManager: CanvasManager;
    private uiController: UIController;

    constructor() {
        this.spriteManager = new SpriteManager();

        const canvas = document.getElementById('mockupCanvas') as HTMLCanvasElement;
        if (!canvas) {
            throw new Error('Canvas element not found');
        }

        this.canvasManager = new CanvasManager(canvas);
        this.uiController = new UIController(this.spriteManager, this.canvasManager);

        this.initialize();
    }

    private async initialize() {
        console.log('Initializing Mockup Builder...');

        try {
            // Load sprites
            await this.spriteManager.loadSprites();
            console.log('Sprites loaded successfully');

            // Refresh UI with loaded sprites
            this.uiController.refreshSpriteLibrary();

            // Setup canvas drop zone
            this.uiController.setupCanvasDrop();

            // Create sample city
            this.createSampleCity();

            // Initial render
            this.canvasManager.render();

            console.log('Mockup Builder ready!');
        } catch (error) {
            console.error('Failed to initialize Mockup Builder:', error);
            alert('Failed to load sprites. Please check the console for details.');
        }
    }

    private createSampleCity() {
        // Town center with main buildings
        this.addSprite('buildings-Vale Sanctum', 450, 80, 128, 128);
        this.addSprite('statues-Venus Statue', 480, 50, 64, 80);

        // Main street buildings
        this.addSprite('buildings-Vale Inn', 400, 200, 96, 96);
        this.addSprite('buildings-Vale Shop', 520, 200, 96, 96);
        this.addSprite('buildings-Vale House 1', 300, 200, 64, 64);
        this.addSprite('buildings-Vale House 2', 640, 200, 64, 64);

        // Residential area
        this.addSprite('buildings-Garets House', 300, 300, 80, 80);
        this.addSprite('buildings-Bilibin House 1', 750, 200, 64, 64);
        this.addSprite('buildings-Bilibin House 2', 640, 300, 64, 64);
        this.addSprite('buildings-Bilibin Inn', 850, 200, 96, 96);

        // Cultural district
        this.addSprite('buildings-Xian Dojo', 750, 320, 112, 96);
        this.addSprite('statues-Dragon', 900, 320, 64, 64);
        this.addSprite('buildings-McCoys Palace', 500, 350, 120, 120);

        // Nomad camp
        this.addSprite('buildings-Contigo Tent', 200, 350, 64, 64);
        this.addSprite('buildings-Contigo House', 150, 280, 64, 64);

        // Trees and landscaping
        this.addSprite('plants-Tree', 250, 150, 48, 64);
        this.addSprite('plants-Tree 1', 700, 150, 48, 64);
        this.addSprite('plants-Tree 2', 600, 90, 48, 64);
        this.addSprite('plants-Tree', 350, 400, 48, 64);
        this.addSprite('plants-Tree 1', 950, 250, 48, 64);

        // Palm trees for exotic touch
        this.addSprite('plants-Palm Tree', 950, 250, 48, 64);
        this.addSprite('plants-Palm Tree 2', 180, 320, 48, 64);

        // Bushes and flowers
        this.addSprite('plants-Bush', 380, 170, 32, 32);
        this.addSprite('plants-Bush 2', 620, 170, 32, 32);
        this.addSprite('plants-Shrub', 280, 280, 32, 32);
        this.addSprite('plants-Shrub', 720, 280, 32, 32);
        this.addSprite('plants-Flowers', 480, 220, 32, 32);
        this.addSprite('plants-Flowers', 820, 280, 32, 32);

        // Cacti near tent
        this.addSprite('plants-Cactus 1', 220, 420, 32, 48);
        this.addSprite('plants-Cactus 2', 260, 410, 32, 48);

        // Infrastructure
        this.addSprite('infrastructure-Well', 500, 350, 48, 48);
        this.addSprite('infrastructure-Well 2', 800, 380, 48, 48);
        this.addSprite('infrastructure-Sign', 350, 180, 24, 32);
        this.addSprite('infrastructure-Sign 2', 560, 180, 24, 32);
        this.addSprite('infrastructure-Torch', 420, 210, 16, 32);
        this.addSprite('infrastructure-Torch', 540, 210, 16, 32);

        // Fence line
        for (let i = 0; i < 6; i++) {
            this.addSprite('infrastructure-Fence Horizontal', 200 + (i * 32), 420, 32, 16);
        }

        // More statues
        this.addSprite('statues-Jupiter Statue', 650, 380, 64, 80);
        this.addSprite('statues-Mars Statue', 350, 480, 64, 80);

        // Market items and decorations
        this.addSprite('decorations-Barrel', 390, 240, 24, 24);
        this.addSprite('decorations-Barrel', 510, 240, 24, 24);
        this.addSprite('decorations-Barrel', 820, 240, 24, 24);
        this.addSprite('decorations-Chest', 550, 240, 32, 24);
        this.addSprite('decorations-Chest Open', 450, 320, 32, 24);
        this.addSprite('decorations-Box', 370, 240, 24, 24);
        this.addSprite('decorations-Box', 490, 240, 24, 24);
        this.addSprite('decorations-Jar', 530, 250, 16, 24);

        // Natural decorations
        this.addSprite('decorations-Stone', 320, 120, 24, 24);
        this.addSprite('decorations-Stone', 680, 120, 24, 24);
        this.addSprite('decorations-Stump', 220, 200, 32, 32);
        this.addSprite('decorations-Stump', 780, 450, 32, 32);
    }

    private addSprite(spriteId: string, x: number, y: number, width: number, height: number) {
        const spriteData = this.spriteManager.getSpriteById(spriteId);
        if (spriteData) {
            this.canvasManager.addSprite({
                id: `placed-${Date.now()}-${Math.random()}`,
                spriteData,
                x,
                y,
                width,
                height,
                rotation: 0,
                zIndex: Date.now()
            });
        }
    }
}

// Start the application when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new MockupBuilder());
} else {
    new MockupBuilder();
}
