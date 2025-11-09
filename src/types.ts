export interface SpriteData {
    id: string;
    name: string;
    category: string;
    path: string;
    image: HTMLImageElement;
    width: number;
    height: number;
}

export interface PlacedSprite {
    id: string;
    spriteData: SpriteData;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    zIndex: number;
}

export interface CanvasState {
    sprites: PlacedSprite[];
    selectedSpriteId: string | null;
    zoom: number;
    panX: number;
    panY: number;
    showGrid: boolean;
}

export interface Point {
    x: number;
    y: number;
}

export type Category = 'buildings' | 'plants' | 'furniture' | 'infrastructure' | 'statues' | 'decorations' | 'terrain';
