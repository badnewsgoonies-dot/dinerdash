import { SpriteManager } from './SpriteManager';
import { CanvasManager } from './Canvas';
import { PlacedSprite, Category } from './types';
import { SUBCATEGORIES } from './subcategories';

export class UIController {
    private spriteManager: SpriteManager;
    private canvasManager: CanvasManager;
    private currentCategory: Category | null = null;
    private currentSubcategory: string = 'All';

    constructor(spriteManager: SpriteManager, canvasManager: CanvasManager) {
        this.spriteManager = spriteManager;
        this.canvasManager = canvasManager;
        this.setupUI();
    }

    private setupUI() {
        this.setupCategoryButtons();
        this.setupFlyoutPanel();
        this.setupToolbarButtons();
        this.setupSearch();
        this.setupKeyboardShortcuts();
    }

    private setupCategoryButtons() {
        const categoryButtons = document.querySelectorAll('.category-button');
        console.log('Found category buttons:', categoryButtons.length);
        categoryButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.getAttribute('data-category') as Category;
                console.log('Opening flyout for category:', category);
                this.openFlyout(category);
            });
        });
    }

    private setupFlyoutPanel() {
        const closeFlyout = document.getElementById('closeFlyout');
        closeFlyout?.addEventListener('click', () => {
            this.closeFlyout();
        });

        // Close flyout when clicking outside
        document.addEventListener('click', (e) => {
            const flyout = document.getElementById('flyoutPanel');
            const sidebar = document.getElementById('sidebar');
            const target = e.target as HTMLElement;

            if (flyout?.classList.contains('open') &&
                !flyout.contains(target) &&
                !sidebar?.contains(target)) {
                this.closeFlyout();
            }
        });
    }

    private openFlyout(category: Category) {
        this.currentCategory = category;
        this.currentSubcategory = 'All';

        const flyout = document.getElementById('flyoutPanel');
        const title = document.getElementById('flyoutTitle');

        // Update title
        const categoryNames: { [key in Category]: string } = {
            buildings: 'Buildings',
            plants: 'Plants & Trees',
            furniture: 'Furniture',
            infrastructure: 'Infrastructure',
            statues: 'Statues & Monuments',
            decorations: 'Decorations',
            terrain: 'Terrain & Ground'
        };

        if (title) {
            title.textContent = categoryNames[category];
        }

        // Populate subcategories
        this.populateSubcategories(category);

        // Populate sprites
        this.populateFlyoutSprites(category, 'All');

        // Show flyout
        flyout?.classList.add('open');

        // Mark active category
        document.querySelectorAll('.category-button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`)?.classList.add('active');
    }

    private closeFlyout() {
        const flyout = document.getElementById('flyoutPanel');
        flyout?.classList.remove('open');
        document.querySelectorAll('.category-button').forEach(btn => {
            btn.classList.remove('active');
        });
        this.currentCategory = null;
    }

    private populateSubcategories(category: Category) {
        const container = document.getElementById('flyoutSubcategories');
        if (!container) return;

        container.innerHTML = '';

        // Add "All" subcategory
        const allBtn = document.createElement('button');
        allBtn.className = 'subcategory-btn active';
        allBtn.textContent = 'All';
        allBtn.addEventListener('click', () => {
            this.selectSubcategory('All');
        });
        container.appendChild(allBtn);

        // Add category-specific subcategories
        const subcategories = SUBCATEGORIES[category];
        if (subcategories) {
            Object.keys(subcategories).forEach(subcatName => {
                const btn = document.createElement('button');
                btn.className = 'subcategory-btn';
                btn.textContent = subcatName;
                btn.addEventListener('click', () => {
                    this.selectSubcategory(subcatName);
                });
                container.appendChild(btn);
            });
        }
    }

    private selectSubcategory(subcategory: string) {
        this.currentSubcategory = subcategory;

        // Update active state
        document.querySelectorAll('.subcategory-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.textContent === subcategory) {
                btn.classList.add('active');
            }
        });

        // Refresh sprites
        if (this.currentCategory) {
            this.populateFlyoutSprites(this.currentCategory, subcategory);
        }
    }

    private populateFlyoutSprites(category: Category, subcategory: string) {
        const container = document.getElementById('flyoutContent');
        if (!container) {
            console.error('Flyout content container not found!');
            return;
        }

        container.innerHTML = '';

        let sprites = this.spriteManager.getSpritesByCategory(category);
        console.log(`Loading ${sprites.length} sprites for category:`, category);

        // Filter by subcategory
        if (subcategory !== 'All' && SUBCATEGORIES[category]?.[subcategory]) {
            const filter = SUBCATEGORIES[category][subcategory];
            sprites = sprites.filter(sprite => filter(sprite.name));
            console.log(`Filtered to ${sprites.length} sprites for subcategory:`, subcategory);
        }

        if (sprites.length === 0) {
            container.innerHTML = '<div class="loading">No sprites in this subcategory</div>';
            return;
        }

        sprites.forEach(sprite => {
            const item = this.createSpriteItem(sprite);
            container.appendChild(item);
        });

        console.log(`Populated flyout with ${sprites.length} sprites`);
    }

    private setupToolbarButtons() {
        // Clear brush button
        document.getElementById('clearBrushBtn')?.addEventListener('click', () => {
            this.canvasManager.clearBrush();
            document.querySelectorAll('.sprite-item').forEach(el => el.classList.remove('brush-selected'));
        });

        // Clear canvas button
        document.getElementById('clearBtn')?.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear the canvas?')) {
                this.canvasManager.clearCanvas();
            }
        });

        // Export PNG button
        document.getElementById('exportPngBtn')?.addEventListener('click', () => {
            const dataUrl = this.canvasManager.exportToPNG();
            const link = document.createElement('a');
            link.download = `mockup-${Date.now()}.png`;
            link.href = dataUrl;
            link.click();
        });

        // Export JSON button
        document.getElementById('exportJsonBtn')?.addEventListener('click', () => {
            const json = this.canvasManager.exportToJSON();
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `layout-${Date.now()}.json`;
            link.href = url;
            link.click();
            URL.revokeObjectURL(url);
        });

        // Import JSON button
        const importBtn = document.getElementById('importJsonBtn');
        const importInput = document.getElementById('importJsonInput') as HTMLInputElement;

        importBtn?.addEventListener('click', () => {
            importInput?.click();
        });

        importInput?.addEventListener('change', (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    const json = event.target?.result as string;
                    this.canvasManager.importFromJSON(json, this.spriteManager);
                };
                reader.readAsText(file);
            }
        });

        // Grid toggle
        document.getElementById('gridToggle')?.addEventListener('change', (e) => {
            this.canvasManager.toggleGrid();
        });

        // Canvas size selector
        document.getElementById('canvasSizeSelect')?.addEventListener('change', (e) => {
            const value = (e.target as HTMLSelectElement).value;

            if (value === 'custom') {
                const width = prompt('Enter canvas width:', '800');
                const height = prompt('Enter canvas height:', '600');

                if (width && height) {
                    const w = parseInt(width);
                    const h = parseInt(height);
                    if (!isNaN(w) && !isNaN(h) && w > 0 && h > 0) {
                        this.canvasManager.setCanvasSize(w, h);
                    }
                }
            } else {
                const [width, height] = value.split(',').map(Number);
                this.canvasManager.setCanvasSize(width, height);
            }
        });
    }

    private setupSearch() {
        const searchInput = document.getElementById('searchInput') as HTMLInputElement;
        searchInput?.addEventListener('input', (e) => {
            const query = (e.target as HTMLInputElement).value.toLowerCase();
            this.filterSprites(query);
        });
    }

    private setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // ESC key - clear brush
            if (e.key === 'Escape') {
                e.preventDefault();
                this.canvasManager.clearBrush();
                document.querySelectorAll('.sprite-item').forEach(el => el.classList.remove('brush-selected'));
            }

            // Delete key - remove selected sprite
            if (e.key === 'Delete' || e.key === 'Backspace') {
                if (document.activeElement?.tagName !== 'INPUT') {
                    e.preventDefault();
                    this.canvasManager.deleteSelectedSprite();
                }
            }

            // Ctrl+Z - Undo (TODO: implement undo/redo)
            if (e.ctrlKey && e.key === 'z') {
                e.preventDefault();
                // TODO: Implement undo
            }

            // Ctrl+S - Save
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                document.getElementById('exportJsonBtn')?.click();
            }
        });
    }


    private createSpriteItem(sprite: any): HTMLElement {
        const item = document.createElement('div');
        item.className = 'sprite-item';
        item.dataset.spriteId = sprite.id;

        const img = document.createElement('img');
        img.src = sprite.path;
        img.alt = sprite.name;

        const name = document.createElement('div');
        name.className = 'sprite-name';
        name.textContent = sprite.name;

        item.appendChild(img);
        item.appendChild(name);

        // Click to set as brush (attach to cursor)
        item.addEventListener('click', () => {
            this.canvasManager.setBrushSprite(sprite);
            // Visual feedback - highlight selected sprite
            document.querySelectorAll('.sprite-item').forEach(el => el.classList.remove('brush-selected'));
            item.classList.add('brush-selected');
        });

        return item;
    }

    setupCanvasDrop() {
        const canvas = document.getElementById('mockupCanvas');

        canvas?.addEventListener('dragover', (e) => {
            e.preventDefault();
            if ((e as DragEvent).dataTransfer) {
                (e as DragEvent).dataTransfer!.dropEffect = 'copy';
            }
        });

        canvas?.addEventListener('drop', (e) => {
            e.preventDefault();
            const dataTransfer = (e as DragEvent).dataTransfer;
            const spriteId = dataTransfer?.getData('spriteId');

            if (spriteId) {
                const sprite = this.spriteManager.getSpriteById(spriteId);
                if (sprite) {
                    const rect = canvas.getBoundingClientRect();
                    const x = (e as MouseEvent).clientX - rect.left;
                    const y = (e as MouseEvent).clientY - rect.top;
                    this.addSpriteToCanvas(sprite, { x, y });
                }
            }
        });
    }

    private addSpriteToCanvas(spriteData: any, position: { x: number, y: number }) {
        const placedSprite: PlacedSprite = {
            id: `placed-${Date.now()}-${Math.random()}`,
            spriteData,
            x: position.x,
            y: position.y,
            width: spriteData.width,
            height: spriteData.height,
            rotation: 0,
            zIndex: Date.now()
        };

        this.canvasManager.addSprite(placedSprite);
    }

    private filterSprites(query: string) {
        const allItems = document.querySelectorAll('.sprite-item');

        allItems.forEach(item => {
            const name = item.querySelector('.sprite-name')?.textContent?.toLowerCase() || '';
            const match = name.includes(query);
            (item as HTMLElement).style.display = match ? 'flex' : 'none';
        });

        // Show/hide empty categories
        document.querySelectorAll('.category').forEach(category => {
            const content = category.querySelector('.category-content');
            const visibleItems = content?.querySelectorAll('.sprite-item:not([style*="display: none"])');
            if (visibleItems && visibleItems.length === 0 && query) {
                (category as HTMLElement).style.display = 'none';
            } else {
                (category as HTMLElement).style.display = 'block';
            }
        });
    }

    refreshSpriteLibrary() {
        // No longer needed with flyout panel
        // Sprites are loaded on-demand when flyout opens
    }
}
