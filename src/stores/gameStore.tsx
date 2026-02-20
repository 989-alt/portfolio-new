import { create } from 'zustand';

interface Obstacle {
    x: number;
    z: number;
    r: number; // radius
}

interface GameState {
    currentZone: string | null;
    setCurrentZone: (zone: string | null) => void;

    interactModal: {
        isOpen: boolean;
        title: string;
        description: string;
        type: "about" | "skill" | "project" | "contact";
    } | null;
    openModal: (data: NonNullable<GameState["interactModal"]>) => void;
    closeModal: () => void;

    // 장애물 시스템
    obstacles: Obstacle[];
    addObstacle: (obstacle: Obstacle) => void;
    clearObstacles: () => void; // 월드 언마운트 시 초기화
}

export const useGameStore = create<GameState>((set) => ({
    currentZone: null,
    setCurrentZone: (zone) => set({ currentZone: zone }),

    interactModal: null,
    openModal: (data) => set({ interactModal: { ...data, isOpen: true } }),
    closeModal: () => set({ interactModal: null }),

    obstacles: [],
    addObstacle: (obs) => set((state) => ({ obstacles: [...state.obstacles, obs] })),
    clearObstacles: () => set({ obstacles: [] }),
}));
