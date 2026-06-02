'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';
import { PLANETS } from '@/data/planets';
import { useSimulationStore } from '@/store/useSimulationStore';
import { PlanetMesh } from './PlanetMesh'; // Updated Import Path

function OrbitLine({ radius }: { radius: number }) {
    const points = Array.from({ length: 129 }, (_, i) => {
        const theta = (i / 128) * Math.PI * 2;
        return new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius);
    });
    return (
        <primitive object={new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), new THREE.LineBasicMaterial({ color: '#ffffff', opacity: 0.12, transparent: true }))} />
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