import { create } from 'zustand';
import { PLANETS } from '@/data/planets';

export interface CosmicWarning { id: string; message: string; }
export interface TeleportMap { [key: string]: string | null; }

export interface SimulationState {
    isPaused: boolean;
    simSpeed: number;
    isEditing: boolean;
    warnings: CosmicWarning[];
    selectedPlanet: string | null;
    resetCounter: number;
    teleports: TeleportMap;
    // New: Track current parent IDs
    parents: Record<string, string | null>;
    
    toggleEditMode: () => void;
    addWarning: (message: string) => void;
    removeWarning: (id: string) => void;
    selectPlanet: (id: string | null) => void;
    teleportObject: (objectId: string, targetId: string | null) => void;
    setParent: (planetId: string, parentId: string | null) => void;
    resetPlanets: () => void;
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
    // Initialize parents from the PLANETS data
    parents: PLANETS.reduce((acc, p) => ({ ...acc, [p.id]: p.parentId }), {}),

    toggleEditMode: () => set((state) => ({ isEditing: !state.isEditing })),
    addWarning: (message) => set((state) => ({
        warnings: [...state.warnings, { id: Math.random().toString(36).substring(7), message }]
    })),
    removeWarning: (id) => set((state) => ({
        warnings: state.warnings.filter((w) => w.id !== id)
    })),
    selectPlanet: (id) => set({ selectedPlanet: id }),
    teleportObject: (objectId, targetId) => set((state) => ({
        teleports: { ...state.teleports, [objectId]: targetId }
    })),
    
    setParent: (planetId, parentId) => set((state) => ({
        parents: { ...state.parents, [planetId]: parentId }
    })),

    resetPlanets: () => set({
        parents: PLANETS.reduce((acc, p) => ({ ...acc, [p.id]: p.parentId }), {}),
        teleports: {}
    }),

    exitAndReset: () => set((state) => ({
        isEditing: false,
        warnings: [],
        selectedPlanet: null,
        teleports: {},
        parents: PLANETS.reduce((acc, p) => ({ ...acc, [p.id]: p.parentId }), {}),
        resetCounter: state.resetCounter + 1
    }))
}));