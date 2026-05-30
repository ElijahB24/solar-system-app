import {create} from "zustand";

interface SimulationState {

    //all around simulation controls
    isPaused: boolean;
    simSpeed: number; //speed multiplier (1x, 5x, 10x)
    selectedPlanet: string | null; //id of selected planet for info display

    //"what if" scenario controls
    sunMassMultiplier: number; //multiplier for sun mass in gravity calculations
    earthDistanceMultiplier: number; //multiplier for earth's distance from sun, affects all planets proportionally


    //actions
    setPause: (paused: boolean) => void;
    setSimSpeed: (speed: number) => void;
    selectPlanet: (planetId: string | null) => void;
    updateSunMass: (multiplier: number) => void;
    updateEarthDistance: (multiplier: number) => void;
    resetScenario: () => void;
}

export const useSimulationStore = create<SimulationState>()((set) => ({
  isPaused: false,
  simSpeed: 1,
  selectedPlanet: null,
  sunMassMultiplier: 1.0,
  earthDistanceMultiplier: 1.0,

  setPause: (paused: boolean) => set({ isPaused: paused }),
  setSimSpeed: (speed: number) => set({ simSpeed: speed }),
  selectPlanet: (planetId: string | null) => set({ selectedPlanet: planetId }),
  updateSunMass: (multiplier: number) => set({ sunMassMultiplier: multiplier }),
  updateEarthDistance: (multiplier: number) => set({ earthDistanceMultiplier: multiplier }),
  resetScenario: () => set({
    isPaused: false,
    simSpeed: 1,
    selectedPlanet: null,
    sunMassMultiplier: 1.0,
    earthDistanceMultiplier: 1.0,
  }),
}));