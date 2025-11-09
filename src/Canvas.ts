import { CanvasState, PlacedSprite, Point } from './types';

export class CanvasManager {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private state: CanvasState;
    private isDragging: boolean = false;
    private dragOffset: Point = { x: 0, y: 0 };
    private isPanning: boolean = false;
    private lastPanPoint: Point = { x: 0, y: 0 };

    // Brush mode properties
    private currentBrushSprite: any = null;
    private isPainting: boolean = false;
    private lastPaintedBounds: { x: number, y: number, width: number, height: number } | null = null;
    private currentMousePos: Point | null = null;
    private gridSize: number = 32;

    // Resize properties
    private isResizing: boolean = false;
    private resizeHandle: string | null = null;
    private resizeStartPoint: Point = { x: 0, y: 0 };
    private resizeStartSize: { width: number, height: number } = { width: 0, height: 0 };
    private resizeStartPos: Point = { x: 0, y: 0 };
    private originalAspectRatio: number = 1;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;
        this.state = {
            sprites: [],
            selectedSpriteId: null,
            zoom: 1,
            panX: 0,
            panY: 0,
            showGrid: true
        };

        this.setupEventListeners();
    }

    private setupEventListeners() {
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.canvas.addEventListener('wheel', this.handleWheel.bind(this));
        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
        this.canvas.addEventListener('mouseleave', () => {
            this.currentMousePos = null;
            this.render();
        });
    }

    // Brush mode methods
    setBrushSprite(sprite: any) {
        this.currentBrushSprite = sprite;
        this.canvas.style.cursor = sprite ? 'crosshair' : 'default';
        this.render();
    }

    clearBrush() {
        this.currentBrushSprite = null;
        this.canvas.style.cursor = 'default';
        this.render();
    }

    getBrushSprite() {
        return this.currentBrushSprite;
    }

    private snapToGrid(point: Point): Point {
        return {
            x: Math.floor(point.x / this.gridSize) * this.gridSize,
            y: Math.floor(point.y / this.gridSize) * this.gridSize
        };
    }

    private placeSpriteAtPoint(point: Point) {
        if (!this.currentBrushSprite) return;

        const snapped = this.snapToGrid(point);
        const spriteWidth = this.currentBrushSprite.width;
        const spriteHeight = this.currentBrushSprite.height;

        // Check if we already painted at this position OR if it would overlap with last placed sprite
        if (this.lastPaintedBounds) {
            // Check for overlap using AABB (Axis-Aligned Bounding Box) collision
            const wouldOverlap = !(
                snapped.x >= this.lastPaintedBounds.x + this.lastPaintedBounds.width ||
                snapped.x + spriteWidth <= this.lastPaintedBounds.x ||
                snapped.y >= this.lastPaintedBounds.y + this.lastPaintedBounds.height ||
                snapped.y + spriteHeight <= this.lastPaintedBounds.y
            );

            if (wouldOverlap) {
                return; // Don't place if it would overlap
            }
        }

        const placedSprite: PlacedSprite = {
            id: `placed-${Date.now()}-${Math.random()}`,
            spriteData: this.currentBrushSprite,
            x: snapped.x,
            y: snapped.y,
            width: spriteWidth,
            height: spriteHeight,
            rotation: 0,
            zIndex: Date.now()
        };

        this.state.sprites.push(placedSprite);

        // Store the full bounds of the painted sprite
        this.lastPaintedBounds = {
            x: snapped.x,
            y: snapped.y,
            width: spriteWidth,
            height: spriteHeight
        };

        this.render();
    }

    private resizeSprite(sprite: PlacedSprite, point: Point) {
        const dx = point.x - this.resizeStartPoint.x;
        const dy = point.y - this.resizeStartPoint.y;

        // Calculate new dimensions based on handle
        let newWidth = this.resizeStartSize.width;
        let newHeight = this.resizeStartSize.height;
        let newX = this.resizeStartPos.x;
        let newY = this.resizeStartPos.y;

        switch (this.resizeHandle) {
            case 'se': // bottom-right
                newWidth = this.resizeStartSize.width + dx;
                break;
            case 'sw': // bottom-left
                newWidth = this.resizeStartSize.width - dx;
                newX = this.resizeStartPos.x + dx;
                break;
            case 'ne': // top-right
                newWidth = this.resizeStartSize.width + dx;
                newY = this.resizeStartPos.y + dy;
                break;
            case 'nw': // top-left
                newWidth = this.resizeStartSize.width - dx;
                newX = this.resizeStartPos.x + dx;
                newY = this.resizeStartPos.y + dy;
                break;
        }

        // Maintain aspect ratio
        newHeight = newWidth / this.originalAspectRatio;

        // Adjust Y position for top handles
        if (this.resizeHandle === 'ne' || this.resizeHandle === 'nw') {
            const heightDiff = newHeight - this.resizeStartSize.height;
            newY = this.resizeStartPos.y - heightDiff;
        }

        // Prevent negative sizes
        if (newWidth < 10 || newHeight < 10) {
            return;
        }

        sprite.width = newWidth;
        sprite.height = newHeight;
        sprite.x = newX;
        sprite.y = newY;
    }

    private handleMouseDown(e: MouseEvent) {
        const point = this.getCanvasPoint(e);

        if (e.button === 2 || e.button === 1 || (e.button === 0 && e.shiftKey)) {
            // Right click or middle click or shift+left click = pan
            this.isPanning = true;
            this.lastPanPoint = { x: e.clientX, y: e.clientY };
            this.canvas.classList.add('grabbing');
            return;
        }

        // If brush mode is active, start painting
        if (this.currentBrushSprite) {
            this.isPainting = true;
            this.lastPaintedBounds = null;
            this.placeSpriteAtPoint(point);
            return;
        }

        // Check if clicking on a sprite (only in selection mode, not brush mode)
        const clickedSprite = this.findSpriteAtPoint(point);

        if (clickedSprite) {
            this.state.selectedSpriteId = clickedSprite.id;

            // Check if clicking on a resize handle
            const handle = this.getResizeHandle(point, clickedSprite);
            if (handle) {
                this.isResizing = true;
                this.resizeHandle = handle;
                this.resizeStartPoint = point;
                this.resizeStartSize = { width: clickedSprite.width, height: clickedSprite.height };
                this.resizeStartPos = { x: clickedSprite.x, y: clickedSprite.y };
                this.originalAspectRatio = clickedSprite.width / clickedSprite.height;
            } else {
                this.isDragging = true;
                this.dragOffset = {
                    x: point.x - clickedSprite.x,
                    y: point.y - clickedSprite.y
                };
            }
        } else {
            this.state.selectedSpriteId = null;
        }

        this.render();
    }

    private handleMouseMove(e: MouseEvent) {
        const point = this.getCanvasPoint(e);
        this.currentMousePos = point;

        if (this.isPanning) {
            const dx = e.clientX - this.lastPanPoint.x;
            const dy = e.clientY - this.lastPanPoint.y;
            this.state.panX += dx;
            this.state.panY += dy;
            this.lastPanPoint = { x: e.clientX, y: e.clientY };
            this.render();
            return;
        }

        // If painting, place sprites along the path
        if (this.isPainting && this.currentBrushSprite) {
            this.placeSpriteAtPoint(point);
            return;
        }

        // Handle resizing
        if (this.isResizing && this.state.selectedSpriteId) {
            const sprite = this.state.sprites.find(s => s.id === this.state.selectedSpriteId);
            if (sprite) {
                this.resizeSprite(sprite, point);
                this.render();
            }
            return;
        }

        if (this.isDragging && this.state.selectedSpriteId) {
            const sprite = this.state.sprites.find(s => s.id === this.state.selectedSpriteId);
            if (sprite) {
                sprite.x = point.x - this.dragOffset.x;
                sprite.y = point.y - this.dragOffset.y;
                this.render();
            }
            return;
        }

        // Update cursor based on hover (only when not in brush mode)
        if (!this.currentBrushSprite) {
            const hoveredSprite = this.findSpriteAtPoint(point);
            if (hoveredSprite && this.state.selectedSpriteId === hoveredSprite.id) {
                const handle = this.getResizeHandle(point, hoveredSprite);
                if (handle) {
                    // Set resize cursor based on handle
                    const cursorMap: { [key: string]: string } = {
                        'nw': 'nwse-resize',
                        'ne': 'nesw-resize',
                        'sw': 'nesw-resize',
                        'se': 'nwse-resize'
                    };
                    this.canvas.style.cursor = cursorMap[handle];
                } else {
                    this.canvas.style.cursor = 'move';
                }
            } else if (hoveredSprite) {
                this.canvas.style.cursor = 'pointer';
            } else {
                this.canvas.style.cursor = 'default';
            }
        }

        // Always render to show brush preview
        this.render();

        // Update status bar
        const hoveredSprite = this.findSpriteAtPoint(point);
        this.updateStatusBar(point, hoveredSprite);
    }

    private handleMouseUp() {
        this.isDragging = false;
        this.isPanning = false;
        this.isPainting = false;
        this.isResizing = false;
        this.resizeHandle = null;
        this.lastPaintedBounds = null;
        this.canvas.classList.remove('grabbing');
    }

    private handleWheel(e: WheelEvent) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        this.state.zoom = Math.max(0.1, Math.min(5, this.state.zoom * delta));
        this.render();
        this.updateZoomDisplay();
    }

    private getCanvasPoint(e: MouseEvent): Point {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left - this.state.panX) / this.state.zoom,
            y: (e.clientY - rect.top - this.state.panY) / this.state.zoom
        };
    }

    private findSpriteAtPoint(point: Point): PlacedSprite | null {
        // Search from top to bottom (reverse order = highest z-index first)
        for (let i = this.state.sprites.length - 1; i >= 0; i--) {
            const sprite = this.state.sprites[i];
            if (point.x >= sprite.x && point.x <= sprite.x + sprite.width &&
                point.y >= sprite.y && point.y <= sprite.y + sprite.height) {
                return sprite;
            }
        }
        return null;
    }

    private getResizeHandle(point: Point, sprite: PlacedSprite): string | null {
        const handleSize = 8 / this.state.zoom;
        const handles = {
            'nw': { x: sprite.x, y: sprite.y },
            'ne': { x: sprite.x + sprite.width, y: sprite.y },
            'sw': { x: sprite.x, y: sprite.y + sprite.height },
            'se': { x: sprite.x + sprite.width, y: sprite.y + sprite.height }
        };

        for (const [handle, pos] of Object.entries(handles)) {
            if (Math.abs(point.x - pos.x) <= handleSize &&
                Math.abs(point.y - pos.y) <= handleSize) {
                return handle;
            }
        }

        return null;
    }

    private updateStatusBar(point: Point, hoveredSprite: PlacedSprite | null) {
        const coordsEl = document.getElementById('mouseCoords');
        const infoEl = document.getElementById('selectedInfo');

        if (coordsEl) {
            coordsEl.textContent = `X: ${Math.floor(point.x)}, Y: ${Math.floor(point.y)}`;
        }

        if (infoEl) {
            if (hoveredSprite) {
                infoEl.textContent = `${hoveredSprite.spriteData.name} (${hoveredSprite.width}x${hoveredSprite.height})`;
            } else if (this.state.selectedSpriteId) {
                const selected = this.state.sprites.find(s => s.id === this.state.selectedSpriteId);
                if (selected) {
                    infoEl.textContent = `Selected: ${selected.spriteData.name}`;
                }
            } else {
                infoEl.textContent = '';
            }
        }
    }

    private updateZoomDisplay() {
        const zoomEl = document.getElementById('zoomLevel');
        if (zoomEl) {
            zoomEl.textContent = `${Math.round(this.state.zoom * 100)}%`;
        }
    }

    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Save context state
        this.ctx.save();

        // Apply transformations
        this.ctx.translate(this.state.panX, this.state.panY);
        this.ctx.scale(this.state.zoom, this.state.zoom);

        // Draw grid
        if (this.state.showGrid) {
            this.drawGrid();
        }

        // Draw all sprites
        this.state.sprites.forEach(sprite => {
            this.drawSprite(sprite, sprite.id === this.state.selectedSpriteId);
        });

        // Draw brush preview
        if (this.currentBrushSprite && this.currentMousePos) {
            this.drawBrushPreview(this.currentMousePos);
        }

        // Restore context state
        this.ctx.restore();
    }

    private drawBrushPreview(mousePos: Point) {
        if (!this.currentBrushSprite) return;

        const snapped = this.snapToGrid(mousePos);

        this.ctx.save();
        this.ctx.globalAlpha = 0.5;
        this.ctx.drawImage(
            this.currentBrushSprite.image,
            snapped.x,
            snapped.y,
            this.currentBrushSprite.width,
            this.currentBrushSprite.height
        );

        // Draw outline to show placement area
        this.ctx.globalAlpha = 1;
        this.ctx.strokeStyle = '#00ff00';
        this.ctx.lineWidth = 2 / this.state.zoom;
        this.ctx.strokeRect(
            snapped.x,
            snapped.y,
            this.currentBrushSprite.width,
            this.currentBrushSprite.height
        );

        this.ctx.restore();
    }

    private drawGrid() {
        const gridSize = 32;
        const width = this.canvas.width / this.state.zoom;
        const height = this.canvas.height / this.state.zoom;

        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1 / this.state.zoom;

        for (let x = 0; x < width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, height);
            this.ctx.stroke();
        }

        for (let y = 0; y < height; y += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(width, y);
            this.ctx.stroke();
        }
    }

    private drawSprite(sprite: PlacedSprite, isSelected: boolean) {
        this.ctx.save();

        // Draw the sprite image
        this.ctx.drawImage(
            sprite.spriteData.image,
            sprite.x,
            sprite.y,
            sprite.width,
            sprite.height
        );

        // Draw selection outline
        if (isSelected) {
            this.ctx.strokeStyle = '#007acc';
            this.ctx.lineWidth = 2 / this.state.zoom;
            this.ctx.strokeRect(sprite.x, sprite.y, sprite.width, sprite.height);

            // Draw resize handles
            const handleSize = 8 / this.state.zoom;
            this.ctx.fillStyle = '#007acc';
            this.ctx.fillRect(sprite.x - handleSize / 2, sprite.y - handleSize / 2, handleSize, handleSize);
            this.ctx.fillRect(sprite.x + sprite.width - handleSize / 2, sprite.y - handleSize / 2, handleSize, handleSize);
            this.ctx.fillRect(sprite.x - handleSize / 2, sprite.y + sprite.height - handleSize / 2, handleSize, handleSize);
            this.ctx.fillRect(sprite.x + sprite.width - handleSize / 2, sprite.y + sprite.height - handleSize / 2, handleSize, handleSize);
        }

        this.ctx.restore();
    }

    addSprite(sprite: PlacedSprite) {
        this.state.sprites.push(sprite);
        this.render();
    }

    deleteSelectedSprite() {
        if (this.state.selectedSpriteId) {
            this.state.sprites = this.state.sprites.filter(s => s.id !== this.state.selectedSpriteId);
            this.state.selectedSpriteId = null;
            this.render();
        }
    }

    clearCanvas() {
        this.state.sprites = [];
        this.state.selectedSpriteId = null;
        this.render();
    }

    toggleGrid() {
        this.state.showGrid = !this.state.showGrid;
        this.render();
    }

    exportToPNG(): string {
        // Create a temporary canvas without grid and selection
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = this.canvas.width;
        tempCanvas.height = this.canvas.height;
        const tempCtx = tempCanvas.getContext('2d')!;

        // Draw all sprites without selection indicators
        this.state.sprites.forEach(sprite => {
            tempCtx.drawImage(
                sprite.spriteData.image,
                sprite.x,
                sprite.y,
                sprite.width,
                sprite.height
            );
        });

        return tempCanvas.toDataURL('image/png');
    }

    exportToJSON(): string {
        const exportData = {
            version: '1.0',
            sprites: this.state.sprites.map(sprite => ({
                spriteId: sprite.spriteData.id,
                x: sprite.x,
                y: sprite.y,
                width: sprite.width,
                height: sprite.height,
                rotation: sprite.rotation,
                zIndex: sprite.zIndex
            }))
        };
        return JSON.stringify(exportData, null, 2);
    }

    importFromJSON(json: string, spriteManager: any) {
        try {
            const data = JSON.parse(json);
            this.state.sprites = [];

            data.sprites.forEach((spriteInfo: any, index: number) => {
                const spriteData = spriteManager.getSpriteById(spriteInfo.spriteId);
                if (spriteData) {
                    this.state.sprites.push({
                        id: `placed-${Date.now()}-${index}`,
                        spriteData,
                        x: spriteInfo.x,
                        y: spriteInfo.y,
                        width: spriteInfo.width,
                        height: spriteInfo.height,
                        rotation: spriteInfo.rotation || 0,
                        zIndex: spriteInfo.zIndex || index
                    });
                }
            });

            this.render();
        } catch (error) {
            console.error('Failed to import JSON:', error);
            alert('Failed to import layout. Please check the file format.');
        }
    }

    getState(): CanvasState {
        return this.state;
    }

    setCanvasSize(width: number, height: number) {
        this.canvas.width = width;
        this.canvas.height = height;
        this.render();
    }

    getCanvasSize(): { width: number, height: number } {
        return {
            width: this.canvas.width,
            height: this.canvas.height
        };
    }
}
