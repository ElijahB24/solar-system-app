'use client';

import SolarSystemCanvas from '@/components/scene/SolarSystemCanvas';
import { useSimulationStore } from '@/store/useSimulationStore';
import { PLANETS } from '@/data/planets';

export default function Home() {
  //pull variables using your exact updated names from your store
  const { selectedPlanet, selectPlanet } = useSimulationStore();
  
  //find data on the clicked planet matching the current selected planet ID string
  const selectedPlanetData = PLANETS.find(p => p.id === selectedPlanet);

  return (
    <main className="relative w-screen h-screen overflow-hidden">
      {/* Fullscreen 3D webGL engine */}
      <div className="absolute inset-0 z-0">
        <SolarSystemCanvas />
      </div>

      {/* UI floating HUD overlay */}
      <div className="absolute inset-0 pointer-events-none z-10 flex justify-between p-6">
        
        {/* Left sidebar: static structural placeholder for global dashboard controls */}
        <div className="pointer-events-auto bg-black/60 backdrop-blur-md border border-white/10 w-80 h-fit rounded-xl p-6 text-white flex flex-col gap-4">
          <h1 className="text-xl font-bold tracking-wider">ORBITAL SIMULATOR</h1>
          <p className="text-xs text-neutral-400">Status: Running simulation engine v1.0</p>
          {/* Your partner can inject buttons tied to setPause and sliders safely here */}
        </div>

        {/* Right sidebar: context aware planet educational readout profile card */}
        {selectedPlanetData && (
          <div className="pointer-events-auto bg-black/60 backdrop-blur-md border border-white/10 w-96 h-fit rounded-xl p-6 text-white flex flex-col gap-4 self-end">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">{selectedPlanetData.name}</h2>
              <button 
                onClick={() => selectPlanet(null)} 
                className="text-sm text-neutral-400 hover:text-white transition"
              >
                ✕ Close
              </button>
            </div>
            <p className="text-sm text-neutral-300 leading-relaxed">{selectedPlanetData.description}</p>
            <div className="border-t border-white/10 pt-4 flex flex-col gap-2">
              <h3 className="text-xs font-semibold uppercase text-neutral-400 tracking-wider">Fast Facts</h3>
              <ul className="list-disc pl-4 text-xs text-neutral-300 space-y-2">
                {selectedPlanetData.facts.map((fact, index) => (
                  <li key={index}>{fact}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
