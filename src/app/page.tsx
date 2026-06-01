'use client';

import SolarSystemCanvas from '@/components/scene/SolarSystemCanvas';
import { useSimulationStore } from '@/store/useSimulationStore';
import { PLANETS } from '@/data/planets';
import { useState } from 'react';

export default function Home() {
    const { isEditing, toggleEditMode, exitAndReset, warnings, removeWarning, selectedPlanet, selectPlanet, teleportObject, addWarning } = useSimulationStore();

    const [movingObj, setMovingObj] = useState<string>('sun');
    const [targetObj, setTargetObj] = useState<string>('');

    const activePlanetData = PLANETS.find((p) => p.id === selectedPlanet);
    const activeMoonData = !activePlanetData 
        ? PLANETS.flatMap(p => p.natural_sat || []).find(m => m.id === selectedPlanet)
        : null;

    // // handles selection execution and fires clean id parameters directly to the api endpoint
    const handleTeleportSubmit = async () => {
        if (!targetObj || movingObj === targetObj) return;

        teleportObject(movingObj, targetObj);

        try {
            const res = await fetch('/api/cosmic-analyzer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    movedObjectId: movingObj,
                    targetObjectId: targetObj
                })
            });
            const data = await res.json();
            addWarning(data.summary);
        } catch {
            addWarning(`CRITICAL SHIFT: ${movingObj} snapped out of orbit boundary.`);
        }
    };

    return (
        <main className="relative w-full h-screen overflow-hidden select-none">
            <SolarSystemCanvas />

            {/* // top left dashboard controller and dropdown console */}
            <div className="absolute top-4 left-4 z-50 flex flex-col gap-3 bg-zinc-950/95 border border-zinc-800 p-4 rounded-xl shadow-2xl backdrop-blur max-w-sm text-white w-80">
                <div>
                    <h1 className="text-md font-bold tracking-tight">Cosmic Control Deck</h1>
                </div>

                <div className="flex flex-col gap-2">
                    <button
                        onClick={toggleEditMode}
                        className={`w-full px-4 py-2 text-xs font-semibold rounded-lg border transition ${
                            isEditing 
                                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 hover:bg-amber-500/30' 
                                : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800'
                        }`}
                    >
                        {isEditing ? '🔒 Stop Alterations' : '🛠️ Edit Celestial Positions'}
                    </button>

                    <button
                        onClick={exitAndReset}
                        className="w-full px-3 py-2 text-xs font-medium bg-red-950/50 border border-red-800/60 text-red-400 rounded-lg hover:bg-red-900/40 transition"
                    >
                        Reset Matrix
                    </button>
                </div>

                {/* // rendering dropdown choices when editing status is true */}
                {isEditing && (
                    <div className="flex flex-col gap-3 border-t border-zinc-800/80 pt-3 mt-1 animate-in fade-in duration-200">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500">Teleport Controller</span>
                        
                        <div className="flex flex-col gap-1">
                            <label htmlFor="moving-object-select" className="text-[10px] text-zinc-400">Select Object:</label>
                            <select
                                id="moving-object-select"
                                value={movingObj}
                                onChange={(e) => setMovingObj(e.target.value)}
                                className="bg-zinc-900 border border-zinc-700 rounded p-1.5 text-xs text-white outline-none focus:border-amber-500"
                            >
                                <option value="sun">Sun</option>
                                {PLANETS.filter(p => p.id !== 'sun').map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1">
                            <label htmlFor="target-object-select" className="text-[10px] text-zinc-400">Move Next To:</label>
                            <select
                              id="target-object-select"
                              value={targetObj}
                              onChange={(e) => setTargetObj(e.target.value)}
                              className="bg-zinc-900 border border-zinc-700 rounded p-1.5 text-xs text-white outline-none focus:border-amber-500"
                            >
                              <option value="">-- Choose Target --</option>
                              <option value="sun" disabled={movingObj === 'sun'}>Sun</option>
                              
                              {/* // added p.id !== 'sun' to prevent the duplicate key clash */}
                              {PLANETS.filter(p => p.id !== 'sun' && p.id !== movingObj).map(p => (
                                  <option key={p.id} value={p.id}>{p.name}</option>
                              ))}
                            </select>
                        </div>

                        <button
                            onClick={handleTeleportSubmit}
                            disabled={!targetObj}
                            className="w-full mt-1 bg-amber-500 text-black text-xs font-bold py-1.5 rounded hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
                        >
                            Execute Teleportation
                        </button>
                    </div>
                )}
            </div>

            {/* // displays your custom planet.ts descriptions and facts array when clicked */}
            {selectedPlanet && (activePlanetData || activeMoonData || selectedPlanet === 'sun') && (
                <div className="absolute top-4 right-4 z-50 bg-zinc-950/95 border border-zinc-800 p-5 rounded-xl text-white w-80 shadow-2xl backdrop-blur max-h-[85vh] overflow-y-auto">
                    <div className="flex justify-between items-start mb-3">
                        <h2 className="text-xl font-black tracking-tight uppercase text-amber-400">
                            {selectedPlanet === 'sun' ? 'The Sun' : (activePlanetData?.name || activeMoonData?.name)}
                        </h2>
                        <button onClick={() => selectPlanet(null)} className="text-zinc-500 hover:text-zinc-200 text-xs font-bold">✕ Close</button>
                    </div>
                    
                    <div className="flex flex-col gap-4 text-xs border-t border-zinc-800/80 pt-3">
                        {selectedPlanet === 'sun' ? (
                            <>
                                <p className="text-zinc-300 leading-relaxed">The luminous heart of our celestial canvas. Keeps all orbiting tracks mathematically bound to the core layout matrix.</p>
                            </>
                        ) : (
                            <>
                                {(activePlanetData?.description || activeMoonData?.description) && (
                                    <p className="text-zinc-300 leading-relaxed italic">{activePlanetData?.description || activeMoonData?.description}</p>
                                )}
                                {(activePlanetData?.facts || activeMoonData?.facts) && (
                                    <div className="flex flex-col gap-2 border-t border-zinc-900 pt-3">
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500/80">Cosmological Logs</span>
                                        <ul className="flex flex-col gap-2 text-zinc-400 list-none pl-0">
                                            {(activePlanetData?.facts || activeMoonData?.facts)?.map((fact, index) => (
                                                <li key={index} className="leading-relaxed pl-3 relative before:content-['•'] before:absolute before:left-0 before:text-amber-500">{fact}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* // bottom right ai warnings deck block container */}
            <div className="absolute bottom-6 right-6 z-50 flex flex-col gap-3 max-w-md w-full pointer-events-none">
                {warnings.map((warn) => (
                    <div key={warn.id} className="pointer-events-auto flex items-start gap-3 bg-red-950/95 border-2 border-red-600/80 p-4 rounded-xl shadow-xl text-white backdrop-blur">
                        <div className="flex-1">
                            <span className="block text-xs font-black uppercase tracking-wider text-red-500 mb-0.5">⚠️ Gravitational Alteration Fault</span>
                            <p className="text-xs leading-relaxed text-zinc-200">{warn.message}</p>
                        </div>
                        <button onClick={() => removeWarning(warn.id)} className="text-zinc-500 hover:text-red-400 text-sm font-bold px-1">✕</button>
                    </div>
                ))}
            </div>
        </main>
    );
}