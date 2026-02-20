"use client";

import { useMemo } from "react";
import * as THREE from "three";

interface LandmarkProps {
    position: [number, number, number];
    color: string;
}

export function Hanok({ position, color }: LandmarkProps) {
    const roofMaterial = useMemo(() => new THREE.MeshToonMaterial({ color: "#2c3e50" }), []);
    const wallMaterial = useMemo(() => new THREE.MeshToonMaterial({ color: "#f5f0e1" }), []);
    const woodMaterial = useMemo(() => new THREE.MeshToonMaterial({ color: "#8b4513" }), []);
    const stoneMaterial = useMemo(() => new THREE.MeshToonMaterial({ color: "#95a5a6" }), []);

    return (
        <group position={position}>
            <mesh castShadow receiveShadow position={[0, 0.4, 0]} material={stoneMaterial}><boxGeometry args={[9, 0.8, 7]} /></mesh>
            <mesh castShadow receiveShadow position={[0, 0.95, 0]} material={woodMaterial}><boxGeometry args={[8.5, 0.3, 6.5]} /></mesh>
            <mesh castShadow position={[0, 2.3, 0]} material={wallMaterial}><boxGeometry args={[7, 2.5, 5]} /></mesh>
            {[[-3.2, 0], [3.2, 0], [-3.2, -2.2], [3.2, -2.2], [-3.2, 2.2], [3.2, 2.2]].map(([x, z], i) => (
                <mesh key={`pillar-${i}`} castShadow position={[x, 2, z]} material={woodMaterial}><cylinderGeometry args={[0.2, 0.25, 3.2, 8]} /></mesh>
            ))}
            <mesh castShadow position={[0, 4.5, 0]} material={roofMaterial}><boxGeometry args={[10, 0.6, 8]} /></mesh>
            <mesh castShadow position={[0, 4.9, 0]} material={roofMaterial}><boxGeometry args={[9, 0.4, 7]} /></mesh>
            <mesh castShadow position={[0, 5.2, 0]} rotation={[0, Math.PI / 2, 0]} material={roofMaterial}><cylinderGeometry args={[0.25, 0.25, 9, 8]} /></mesh>
            <mesh castShadow position={[0, 4.2, 4.2]} rotation={[Math.PI / 6, 0, 0]} material={roofMaterial}><boxGeometry args={[10.5, 0.3, 1.5]} /></mesh>
            <mesh castShadow position={[0, 4.2, -4.2]} rotation={[-Math.PI / 6, 0, 0]} material={roofMaterial}><boxGeometry args={[10.5, 0.3, 1.5]} /></mesh>
            <mesh position={[0, 1.8, 2.51]} material={woodMaterial}><boxGeometry args={[2, 2.2, 0.1]} /></mesh>
        </group>
    );
}

export function BulletinBoard({ position, color }: LandmarkProps) {
    const woodMaterial = useMemo(() => new THREE.MeshToonMaterial({ color: "#8b4513" }), []);
    const boardMaterial = useMemo(() => new THREE.MeshToonMaterial({ color: "#deb887" }), []);
    const roofMaterial = useMemo(() => new THREE.MeshToonMaterial({ color: "#654321" }), []);

    return (
        <group position={position}>
            <mesh castShadow position={[-1.8, 2, 0]} material={woodMaterial}><cylinderGeometry args={[0.18, 0.22, 4, 8]} /></mesh>
            <mesh castShadow position={[1.8, 2, 0]} material={woodMaterial}><cylinderGeometry args={[0.18, 0.22, 4, 8]} /></mesh>
            <mesh castShadow position={[0, 2.5, 0]} material={boardMaterial}><boxGeometry args={[3.2, 2.2, 0.2]} /></mesh>
            <mesh castShadow position={[0, 2.5, 0.12]} material={woodMaterial}><boxGeometry args={[3.4, 2.4, 0.08]} /></mesh>
            <mesh castShadow position={[0, 4, 0]} material={roofMaterial}><boxGeometry args={[4, 0.3, 1.2]} /></mesh>
            <mesh castShadow position={[0, 4.2, 0]} material={roofMaterial}><boxGeometry args={[3.6, 0.2, 1]} /></mesh>
            {[{ pos: [-0.8, 3, 0.15], size: [0.6, 0.8] }, { pos: [0.6, 3.2, 0.15], size: [0.7, 0.6] }, { pos: [-0.5, 2.1, 0.15], size: [0.8, 0.5] }, { pos: [0.7, 1.9, 0.15], size: [0.5, 0.7] }].map((paper, i) => (
                <mesh key={`paper-${i}`} position={paper.pos as [number, number, number]}><planeGeometry args={paper.size as [number, number]} /><meshBasicMaterial color={["#fff8dc", "#ffe4c4", "#ffefd5", "#faf0e6"][i]} /></mesh>
            ))}
        </group>
    );
}

export function Shrine({ position, color }: LandmarkProps) {
    const stoneMaterial = useMemo(() => new THREE.MeshToonMaterial({ color: "#7f8c8d" }), []);
    const pillowMaterial = useMemo(() => new THREE.MeshToonMaterial({ color: "#bdc3c7" }), []);
    const roofMaterial = useMemo(() => new THREE.MeshToonMaterial({ color: "#34495e" }), []);
    const lanternMaterial = useMemo(() => new THREE.MeshToonMaterial({ color: "#e74c3c" }), []);

    return (
        <group position={position}>
            {[0, 1, 2].map((step) => (
                <mesh key={`step-${step}`} castShadow receiveShadow position={[0, 0.25 + step * 0.4, 2 - step * 0.8]} material={stoneMaterial}><boxGeometry args={[6 - step * 0.5, 0.4, 1.5 - step * 0.3]} /></mesh>
            ))}
            <mesh castShadow receiveShadow position={[0, 1, -1]} material={stoneMaterial}><boxGeometry args={[5, 0.6, 4]} /></mesh>
            <mesh castShadow position={[0, 2.3, -1]} material={pillowMaterial}><boxGeometry args={[4, 2.2, 3]} /></mesh>
            {[[-1.6, 0.5], [1.6, 0.5], [-1.6, -2.3], [1.6, -2.3]].map(([x, z], i) => (
                <mesh key={`shrine-pillar-${i}`} castShadow position={[x, 2.3, z]} material={stoneMaterial}><cylinderGeometry args={[0.15, 0.18, 2.6, 8]} /></mesh>
            ))}
            <mesh castShadow position={[0, 3.8, -1]} material={roofMaterial}><boxGeometry args={[5.5, 0.5, 4.5]} /></mesh>
            <mesh castShadow position={[0, 4.15, -1]} material={roofMaterial}><boxGeometry args={[5, 0.3, 4]} /></mesh>
            <mesh castShadow position={[0, 4.4, -1]} rotation={[0, Math.PI / 2, 0]} material={roofMaterial}><cylinderGeometry args={[0.2, 0.2, 5, 8]} /></mesh>
            {[[-2.5, 1.8, 2], [2.5, 1.8, 2]].map(([x, y, z], i) => (
                <group key={`lantern-${i}`} position={[x, y, z]}>
                    <mesh castShadow material={lanternMaterial}><boxGeometry args={[0.5, 0.8, 0.5]} /></mesh>
                    <mesh position={[0, 0.5, 0]}><coneGeometry args={[0.35, 0.3, 4]} /><meshBasicMaterial color="#2c3e50" /></mesh>
                    <pointLight color="#ff6b6b" intensity={0.5} distance={5} />
                </group>
            ))}
            <mesh castShadow position={[0, 1.5, 0]} material={stoneMaterial}><boxGeometry args={[1.2, 0.4, 0.8]} /></mesh>
        </group>
    );
}

export function Mailbox({ position, color }: LandmarkProps) {
    const postMaterial = useMemo(() => new THREE.MeshToonMaterial({ color: "#8b4513" }), []);
    const boxMaterial = useMemo(() => new THREE.MeshToonMaterial({ color: "#e74c3c" }), []);
    const accentMaterial = useMemo(() => new THREE.MeshToonMaterial({ color: "#c0392b" }), []);
    const stoneMaterial = useMemo(() => new THREE.MeshToonMaterial({ color: "#95a5a6" }), []);

    return (
        <group position={position}>
            <mesh castShadow receiveShadow position={[0, 0.3, 0]} material={stoneMaterial}><cylinderGeometry args={[1.2, 1.4, 0.6, 8]} /></mesh>
            <mesh castShadow position={[0, 2, 0]} material={postMaterial}><cylinderGeometry args={[0.2, 0.25, 3.4, 8]} /></mesh>
            <mesh castShadow position={[0, 3.8, 0]} material={boxMaterial}><cylinderGeometry args={[0.9, 0.9, 1.4, 16]} /></mesh>
            <mesh castShadow position={[0, 4.6, 0]} material={accentMaterial}><sphereGeometry args={[0.92, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} /></mesh>
            <mesh position={[0, 3.9, 0.92]}><boxGeometry args={[0.6, 0.12, 0.1]} /><meshBasicMaterial color="#1a1a1a" /></mesh>
            <mesh position={[0, 3.5, 0.91]}><planeGeometry args={[0.6, 0.3]} /><meshBasicMaterial color="#ffffff" /></mesh>
            <mesh position={[0, 3.2, 0]} material={accentMaterial}><torusGeometry args={[0.91, 0.08, 8, 24]} /></mesh>
            <mesh position={[0, 4.4, 0]} material={accentMaterial}><torusGeometry args={[0.91, 0.08, 8, 24]} /></mesh>
            {[0, Math.PI / 2, Math.PI, Math.PI * 1.5].map((angle, i) => (
                <mesh key={`stone-${i}`} castShadow position={[Math.cos(angle) * 1.8, 0.25, Math.sin(angle) * 1.8]} material={stoneMaterial}><dodecahedronGeometry args={[0.35, 0]} /></mesh>
            ))}
        </group>
    );
}
