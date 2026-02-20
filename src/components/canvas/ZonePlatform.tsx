"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { useCharacterStore } from "@/stores/characterStore";
import { useGameStore } from "@/stores/gameStore";
import type { PortfolioZone } from "@/lib/portfolioData";

interface ZonePlatformProps {
    zone: PortfolioZone;
}

// 랜드마크별 상호작용 반경
const INTERACTION_RADIUS: Record<string, number> = {
    hanok: 8,
    bulletin: 6,
    shrine: 7,
    mailbox: 5,
    cherryblossom: 8,
};

export default function ZonePlatform({ zone }: ZonePlatformProps) {
    const groupRef = useRef<THREE.Group>(null);
    const [isNear, setIsNear] = useState(false);
    const characterPosition = useCharacterStore((state) => state.position);
    const { setCurrentZone, openModal } = useGameStore();

    const interactionRadius = INTERACTION_RADIUS[zone.landmark] || 6;

    useFrame(() => {
        if (!groupRef.current) return;
        const distance = Math.sqrt(
            Math.pow(characterPosition[0] - zone.position[0], 2) +
            Math.pow(characterPosition[2] - zone.position[2], 2)
        );
        const nowNear = distance < interactionRadius;
        if (nowNear !== isNear) {
            setIsNear(nowNear);
            setCurrentZone(nowNear ? zone.id : null);
        }
    });

    const handleClick = () => {
        if (isNear) {
            // zone.id를 적절한 타입으로 매핑
            const typeMap: Record<string, "about" | "project" | "skill" | "contact"> = {
                about: "about",
                project: "project",
                insight: "skill",
                contact: "contact",
            };
            openModal({
                title: zone.title,
                description: zone.description,
                type: typeMap[zone.id] || "about",
            });
        }
    };

    // 랜드마크 위에 떠있는 라벨 높이
    const labelHeight: Record<string, number> = {
        hanok: 6,
        bulletin: 5,
        shrine: 5,
        mailbox: 4.5,
        cherryblossom: 15,
    };

    return (
        <group ref={groupRef} position={zone.position} onClick={handleClick}>
            {/* 바닥 발광 표시 */}
            <mesh receiveShadow position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[interactionRadius, 32]} />
                <meshStandardMaterial
                    color={zone.color}
                    transparent
                    opacity={0.15}
                />
            </mesh>

            {/* 상호작용 가능 시 발광 링 */}
            {isNear && (
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
                    <ringGeometry args={[interactionRadius - 0.5, interactionRadius, 32]} />
                    <meshStandardMaterial
                        color={zone.color}
                        emissive={zone.color}
                        emissiveIntensity={0.6}
                        transparent
                        opacity={0.7}
                    />
                </mesh>
            )}

            {/* 떠있는 라벨 */}
            <Html
                position={[0, labelHeight[zone.landmark] || 5, 0]}
                center
                distanceFactor={15}
            >
                <div
                    className="px-3 py-1.5 rounded-lg text-center select-none shadow-lg backdrop-blur-sm"
                    style={{
                        backgroundColor: `${zone.color}ee`,
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "14px",
                        whiteSpace: "nowrap",
                        border: "2px solid white",
                    }}
                >
                    {zone.title}
                </div>
            </Html>

            {/* 상호작용 프롬프트 */}
            {isNear && (
                <Html position={[0, (labelHeight[zone.landmark] || 5) + 1.5, 0]} center>
                    <div className="bg-black/80 text-white px-4 py-2 rounded-full text-center whitespace-nowrap animate-bounce shadow-lg">
                        <p className="text-sm font-bold">🎯 E키 또는 클릭</p>
                    </div>
                </Html>
            )}
        </group>
    );
}
