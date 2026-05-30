'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';
import { PLANETS, PlanetData } from '@/data/planets';
import { useSimulationStore } from '@/store/useSimulationStore';

//componnt for individual planets
function PlantMesh({ planet }: { planet: PlanetData }) {
    const meshRef = useRef<THREE.Mesh>(null);
    const ringRef = useRef<THREE.Mesh>(null);
    const texture = useTexture(planet.texturePath);

    //load Saturn's rings (no other planets has rings)
    const ringTexture = planet.hasRings ? useTexture('/textures/saturn-ring.png') : null;
    
    //
    const {isPaused, simSpeed, earthDistanceMultiplier, selectPlanet} = useSimulationStore();
    const angleRef = useRef(Math.random() * 10); //randomize starting pos

    useFrame((state, delta) => {
        if (isPaused || !meshRef.current) return;

        //calculate interactive distance modifier (for 'what if' scenarios)
        let distance = planet.semiMajorAxis;
        if (planet.id == 'earth') distance *= earthDistanceMultiplier;

        //update oribit pos
        angleRef.current += planet.speed * simSpeed * delta;
        meshRef.current.position.x = Math.cos(angleRef.current) * distance;
        meshRef.current.position.z = Math.sin(angleRef.current) * distance;

        //spin planet on its axis
        meshRef.current.rotation.y += 0.01 * simSpeed;
    });

    return (
        <group ref = {meshRef}>
            {/* The Core Planet Sphere */}
            <mesh onClick={(e) => {
                e.stopPropagation(); //prevent click from reaching canvas
                selectPlanet(planet.id);
            }}>
                <sphereGeometry args={[planet.radius, 32, 32]} />
                <meshStandardMaterial map={texture} roughness={0.8} />
            </mesh>

            {/* Render Saturn's Rings if flagged */}
            {planet.hasRings && ringTexture && (
                <mesh ref={ringRef} rotation ={[Math.PI / 2.5, 0, 0]}>
                    <ringGeometry args={[planet.radius *1.4, planet.radius * 2.3, 64]}/>
                    <meshStandardMaterial map={ringTexture} side={THREE.DoubleSide} transparent={true} opacity={0.8} />
                </mesh>
            )}
            </group>
        );
        }
        //component for the whole canvas
        function SpaceBackground() {
            const bgTexture = useTexture('/textures/stars+milkway.jpg');
            return (
                <mesh>
                    <sphereGeometry args={[500, 60, 40]} />
                    <meshBasicMaterial map={bgTexture} side={THREE.BackSide} />
                </mesh>
            );
        }

        //main scene export
        export default function SolarSystemCanvas() {
            return (
                <div className="w-full h-screen bg-black">
                    <Canvas camera={{position: [0, 20, 35], fov: 60}}>
                        {/* Immersive background space wrap */}
                        <SpaceBackground />

                        {/* Ambient baseline lighting + Central Solar point-light radiating from the center */}
                        <ambientLight intensity = {0.3} />
                        <pointLight position={[0, 0, 0]} intensity={2.5} distance={100} decay={1} />


                        {/* The Center Sun Mesh */}
                        <mesh position={[0, 0, 0]}>
                            <sphereGeometry args={[3.5, 32, 32]} />
                            <meshBasicMaterial color = '#ffcc00' />
                        </mesh>
                
                        {/* Map through planet data to render each one */}
                        {PLANETS.map((planet) => (
                            <PlantMesh key={planet.id} planet={planet} />
                        ))}

                        <OrbitControls enableDamping dampingFactor={0.05} maxDistance={120} minDistance={5} />
                    </Canvas>
                </div>
            );
        }
    