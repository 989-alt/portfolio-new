"use client";

import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useCharacterStore } from "@/stores/characterStore";
import { useGameStore } from "@/stores/gameStore";
import { HOME_ZONE } from "@/lib/portfolioData";

export default function CherryBlossomTree() {
    const groupRef = useRef<THREE.Group>(null);
    const leavesRef = useRef<THREE.Group>(null);
    const [isNear, setIsNear] = useState(false);

    const characterPosition = useCharacterStore((state) => state.position);
    const { setCurrentZone, openModal } = useGameStore();

    const trunkMaterial = useMemo(() => new THREE.MeshToonMaterial({ color: "#6b4423" }), []);
    const blossomMaterial = useMemo(() => new THREE.MeshToonMaterial({ color: "#ffb6c1" }), []);
    const blossomDarkMaterial = useMemo(() => new THREE.MeshToonMaterial({ color: "#ff91a4" }), []);
    const blossomLightMaterial = useMemo(() => new THREE.MeshToonMaterial({ color: "#ffd1dc" }), []);

    useFrame((state) => {
        if (!groupRef.current || !leavesRef.current) return;
        const time = state.clock.elapsedTime;
        leavesRef.current.rotation.y = Math.sin(time * 0.3) * 0.03;
        leavesRef.current.position.y = 8 + Math.sin(time * 0.5) * 0.1;

        const dx = characterPosition[0] - HOME_ZONE.position[0];
        const dz = characterPosition[2] - HOME_ZONE.position[2];
        const distance = Math.sqrt(dx * dx + dz * dz);
        const nowNear = distance < 10;

        if (nowNear !== isNear) {
            setIsNear(nowNear);
            setCurrentZone(nowNear ? "home" : null);
        }
    });

    const handleClick = () => {
        if (isNear) {
            openModal({ isOpen: true, title: HOME_ZONE.title, description: HOME_ZONE.description, type: "about" });
        }
    };

    return (
        <group ref={groupRef} position={HOME_ZONE.position} onClick={handleClick}>
            <mesh castShadow position={[0, 3, 0]} material={trunkMaterial}><cylinderGeometry args={[1.2, 2, 6, 12]} /></mesh>
            <mesh castShadow position={[0, 6.5, 0]} material={trunkMaterial}><cylinderGeometry args={[0.8, 1.2, 1.5, 12]} /></mesh>
            <mesh castShadow position={[2, 5.5, 0]} rotation={[0, 0, Math.PI / 4]} material={trunkMaterial}><cylinderGeometry args={[0.25, 0.5, 4, 8]} /></mesh>
            <mesh castShadow position={[-2, 5, 1]} rotation={[Math.PI / 6, 0, -Math.PI / 4]} material={trunkMaterial}><cylinderGeometry args={[0.25, 0.5, 4, 8]} /></mesh>
            <mesh castShadow position={[0, 5.5, -2]} rotation={[-Math.PI / 4, 0, 0]} material={trunkMaterial}><cylinderGeometry args={[0.25, 0.5, 3.5, 8]} /></mesh>

            <group ref={leavesRef} position={[0, 8, 0]}>
                <mesh castShadow position={[0, 2, 0]} material={blossomMaterial}><dodecahedronGeometry args={[5, 1]} /></mesh>
                <mesh castShadow position={[3, 0, 2]} material={blossomDarkMaterial}><dodecahedronGeometry args={[3.5, 1]} /></mesh>
                <mesh castShadow position={[-3, 1, 1]} material={blossomLightMaterial}><dodecahedronGeometry args={[3.5, 1]} /></mesh>
                <mesh castShadow position={[1, -1, -3]} material={blossomMaterial}><dodecahedronGeometry args={[3, 1]} /></mesh>
                <mesh castShadow position={[-2, 0, -2]} material={blossomDarkMaterial}><dodecahedronGeometry args={[3, 1]} /></mesh>
                <mesh castShadow position={[4, 2, 0]} material={blossomLightMaterial}><dodecahedronGeometry args={[2, 1]} /></mesh>
                <mesh castShadow position={[-4, 1.5, -1]} material={blossomMaterial}><dodecahedronGeometry args={[2, 1]} /></mesh>
                <mesh castShadow position={[0, 3.5, 2]} material={blossomLightMaterial}><dodecahedronGeometry args={[2.5, 1]} /></mesh>
                <mesh castShadow position={[2, 3, -2]} material={blossomDarkMaterial}><dodecahedronGeometry args={[2, 1]} /></mesh>
            </group>

            <mesh receiveShadow position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <ringGeometry args={[8, 10, 32]} />
                <meshStandardMaterial color="#ffb6c1" transparent opacity={0.25} emissive="#ffb6c1" emissiveIntensity={0.2} />
            </mesh>
            <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[6, 32]} />
                <meshStandardMaterial color="#ffd1dc" transparent opacity={0.15} />
            </mesh>

            {isNear && (
                <Html position={[0, 16, 0]} center>
                    <div className="bg-gradient-to-r from-pink-500 to-rose-400 text-white px-5 py-2.5 rounded-full text-center whitespace-nowrap animate-bounce shadow-lg">
                        <p className="text-sm font-bold">🌸 E키: 환영 인사</p>
                    </div>
                </Html>
            )}

            <Html position={[0, 18, 0]} center distanceFactor={20}>
                <div className="px-4 py-2 rounded-xl text-center select-none shadow-xl backdrop-blur-sm"
                    style={{ background: "linear-gradient(135deg, #ffb6c1 0%, #ff91a4 100%)", color: "white", fontWeight: "bold", fontSize: "16px", whiteSpace: "nowrap", border: "2px solid white" }}>
                    🌸 환영합니다
                </div>
            </Html>
        </group>
    );
}
