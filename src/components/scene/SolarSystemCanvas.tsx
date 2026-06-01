'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { PLANETS, PlanetData } from '@/data/planets';
import { useSimulationStore } from '@/store/useSimulationStore';

function OrbitLine({ radius }: { radius: number }) {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= 128; i++) {
        const theta = (i / 128) * Math.PI * 2;
        points.push(new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius));
    }
    return (
        <primitive 
            object={new THREE.Line(
                new THREE.BufferGeometry().setFromPoints(points), 
                new THREE.LineBasicMaterial({ color: '#ffffff', opacity: 0.12, transparent: true })
            )} 
        />
    );
}

function PlanetRings({ radius, isUranus }: { radius: number, isUranus: boolean }) {
    const thickness = isUranus ? 0.15 : 0.8;
    return (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[radius * 1.2, radius * (1.2 + thickness), 64]} />
            <meshStandardMaterial 
                color="#c4a470" 
                side={THREE.DoubleSide} 
                transparent 
                opacity={0.65} 
                roughness={0.6}
            />
        </mesh>
    );
}

function PlanetMesh({ planet }: { planet: PlanetData }) {
    const groupRef = useRef<THREE.Group>(null);
    const texture = useTexture(planet.texturePath);
    const { isPaused, simSpeed, resetCounter, selectPlanet, teleports } = useSimulationStore();
    const angleRef = useRef<number>(Math.random() * 10);
    const { scene } = useThree();

    useEffect(() => {
        if (groupRef.current) {
            const initialAngle = Math.random() * 10;
            angleRef.current = initialAngle;
            groupRef.current.position.set(Math.cos(initialAngle) * planet.semiMajorAxis, 0, Math.sin(initialAngle) * planet.semiMajorAxis);
        }
    }, [resetCounter, planet.semiMajorAxis]);

    useFrame((state, delta) => {
        if (isPaused || !groupRef.current) return;

        const targetId = teleports[planet.id];
        if (targetId) {
            const targetMesh = scene.getObjectByName(targetId);
            if (targetMesh) {
                const targetWorldPos = new THREE.Vector3();
                targetMesh.getWorldPosition(targetWorldPos);

                //get radius of the target planet to calculate a good distance
                const targetPlanet = PLANETS.find(p => p.id === targetId);
                const targetRadius = targetPlanet ? targetPlanet.radius : 0;

                //set position to target radius + some buffer distance to prevent overlap
                const bufferDistance = targetRadius + planet.radius + 2.5;

                groupRef.current.position.set(targetWorldPos.x + bufferDistance, targetWorldPos.y, targetWorldPos.z);
                return;
            }
        }

        angleRef.current += planet.speed * simSpeed * Math.min(delta, 0.1);
        const x = Math.cos(angleRef.current) * planet.semiMajorAxis;
        const z = Math.sin(angleRef.current) * planet.semiMajorAxis;

        // If this planet orbits a parent, offset its position by the parent's world position
        if (planet.parentId) {
            const parentMesh = scene.getObjectByName(planet.parentId);
            if (parentMesh) {
                const parentPos = new THREE.Vector3();
                parentMesh.getWorldPosition(parentPos);
                groupRef.current.position.set(parentPos.x + x, parentPos.y, parentPos.z + z);
            }
        } else {
            groupRef.current.position.set(x, 0, z);
        }
    });

    return (
        <group ref={groupRef} name={planet.id}>
            <mesh onClick={(e) => { e.stopPropagation(); selectPlanet(planet.id); }}>
                <sphereGeometry args={[planet.radius, 32, 32]} />
                <meshStandardMaterial map={texture} roughness={0.8} />
            </mesh>
            {planet.hasRings && <PlanetRings radius={planet.radius} isUranus={planet.id === 'uranus'} />}
        </group>
    );
}

function SpaceBackground() {
    const bgTexture = useTexture('/textures/stars+milkway.jpg');
    return (
        <mesh>
            <sphereGeometry args={[500, 60, 40]} />
            <meshBasicMaterial map={bgTexture} side={THREE.BackSide} />
        </mesh>
    );
}

function CentralSun() {
    const sunData = PLANETS.find(p => p.id === 'sun');
    const sunTexture = useTexture(sunData?.texturePath || '/textures/sun.jpg');
    const { selectPlanet } = useSimulationStore();

    return (
        <mesh onClick={(e) => { e.stopPropagation(); selectPlanet('sun'); }}>
            <sphereGeometry args={[sunData?.radius || 3.5, 32, 32]} />
            <meshBasicMaterial map={sunTexture} />
        </mesh>
    );
}

function CameraRig() {
    const selectedPlanet = useSimulationStore((state) => state.selectedPlanet);
    const targetPosition = useRef(new THREE.Vector3());
    const lookAtPosition = useRef(new THREE.Vector3());

    useFrame((state) => {
        if (!selectedPlanet) return;
        const targetMesh = state.scene.getObjectByName(selectedPlanet);
        if (targetMesh) {
            const worldPos = new THREE.Vector3();
            targetMesh.getWorldPosition(worldPos);
            const offset = selectedPlanet === 'sun' ? 22 : 8;
            targetPosition.current.set(worldPos.x, worldPos.y + 3.5, worldPos.z + offset);
            lookAtPosition.current.copy(worldPos);
        }
        state.camera.position.lerp(targetPosition.current, 0.05);
        state.camera.lookAt(lookAtPosition.current);
    });
    return null;
}

export default function SolarSystemCanvas() {
    return (
        <div className="w-full h-screen bg-black">
            <Canvas camera={{ position: [0, 35, 60], fov: 60 }}>
                <SpaceBackground />
                <ambientLight intensity={0.7} />
                <pointLight position={[0, 0, 0]} intensity={3.0} />
                <CameraRig />
                
                {PLANETS.map((planet) => (
                    <group key={planet.id}>
                        {planet.id !== 'sun' && <OrbitLine radius={planet.semiMajorAxis} />}
                        <PlanetMesh planet={planet} />
                    </group>
                ))}
                <OrbitControls makeDefault />
            </Canvas>
        </div>
    );
}