import { create } from 'zustand';

export interface CosmicWarning {
    id: string;
    message: string;
}

// // track custom teleportations via raw id pairings
export interface TeleportMap {
    [key: string]: string | null; // // e.g., earth: "jupiter" means earth is snapped to jupiter
}

export interface SimulationState {
    isPaused: boolean;
    simSpeed: number;
    isEditing: boolean;
    warnings: CosmicWarning[];
    selectedPlanet: string | null;
    resetCounter: number;
    teleports: TeleportMap;
    
    toggleEditMode: () => void;
    addWarning: (message: string) => void;
    removeWarning: (id: string) => void;
    selectPlanet: (id: string | null) => void;
    teleportObject: (objectId: string, targetId: string | null) => void;
    exitAndReset: () => void;
}

export const useSimulationStore = create<SimulationState>((set) => ({
    isPaused: false,
    simSpeed: 1,
    isEditing: false,
    warnings: [],
    selectedPlanet: null,
    resetCounter: 0,
    teleports: {},

    toggleEditMode: () => set((state) => ({ isEditing: !state.isEditing })),
    
    addWarning: (message) => set((state) => ({
        warnings: [...state.warnings, { id: Math.random().toString(36).substring(7), message }]
    })),
    
    removeWarning: (id) => set((state) => ({
        warnings: state.warnings.filter((w) => w.id !== id)
    })),

    selectPlanet: (id) => set({ selectedPlanet: id }),

    // // maps out new positions via id targeting keys
    teleportObject: (objectId, targetId) => set((state) => ({
        teleports: { ...state.teleports, [objectId]: targetId }
    })),

    // // purges the entire teleport map instantly to force perfect mathematical track snapping
    exitAndReset: () => set((state) => ({
        isEditing: false,
        warnings: [],
        selectedPlanet: null,
        teleports: {},
        resetCounter: state.resetCounter + 1
    }))
}));