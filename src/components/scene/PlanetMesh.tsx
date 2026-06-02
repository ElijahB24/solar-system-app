'use client';

import { useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';
import { PLANETS, PlanetData } from '@/data/planets';
import { useSimulationStore } from '@/store/useSimulationStore';

function PlanetRings({ radius, isUranus }: { radius: number, isUranus: boolean }) {
    const thickness = isUranus ? 0.15 : 0.8;
    return (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[radius * 1.2, radius * (1.2 + thickness), 64]} />
            <meshStandardMaterial color="#c4a470" side={THREE.DoubleSide} transparent opacity={0.65} roughness={0.6} />
        </mesh>
    );
}

export function PlanetMesh({ planet }: { planet: PlanetData }) {
    const groupRef = useRef<THREE.Group>(null);
    const texture = useTexture(planet.texturePath);
    const { isPaused, simSpeed, teleports, parents, setParent, selectPlanet } = useSimulationStore();
    const angleRef = useRef<number>(Math.random() * 10);
    const { scene } = useThree();

    useFrame((state, delta) => {
        if (isPaused || !groupRef.current) return;

        const targetId = teleports[planet.id];
        const currentParent = parents[planet.id];

        if (targetId) {
            const targetMesh = scene.getObjectByName(targetId);
            if (targetMesh) {
                const targetWorldPos = new THREE.Vector3();
                targetMesh.getWorldPosition(targetWorldPos);

                const targetData = PLANETS.find(p => p.id === targetId);
                const safeDistance = (targetData ? targetData.radius : 1) + planet.radius + 3.0;

                const direction = new THREE.Vector3().subVectors(groupRef.current.position, targetWorldPos).normalize();

                const targetPos = targetWorldPos.clone().add(direction.multiplyScalar(safeDistance));

                groupRef.current.position.lerp(targetPos, 0.01);

                const distance = groupRef.current.position.distanceTo(targetPos);
                if (distance < 0.5 && currentParent !== targetId) {
                    setParent(planet.id, targetId);
                }
                return;
            }
        }

        angleRef.current += planet.speed * simSpeed * Math.min(delta, 0.1);
        const x = Math.cos(angleRef.current) * planet.semiMajorAxis;
        const z = Math.sin(angleRef.current) * planet.semiMajorAxis;

        if (currentParent) {
            const parentMesh = scene.getObjectByName(currentParent);
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