"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function River() {
    const waterRef = useRef<THREE.Mesh>(null);

    // 강물 UV 애니메이션
    useFrame((state) => {
        if (waterRef.current) {
            const material = waterRef.current.material as THREE.MeshStandardMaterial;
            if (material.map) {
                material.map.offset.x = state.clock.elapsedTime * 0.05;
            }
        }
    });

    // 강 경로 정의 (S자 곡선으로 대각선 횡단)
    const riverShape = useMemo(() => {
        const shape = new THREE.Shape();
        const halfWidth = 7.5; // 강 폭의 절반

        // 시작점 (남서쪽)
        shape.moveTo(-100 - halfWidth, 100);

        // S자 곡선으로 북동쪽까지
        shape.bezierCurveTo(
            -50 - halfWidth, 50,   // 컨트롤 포인트 1
            -20 - halfWidth, 20,   // 컨트롤 포인트 2
            0 - halfWidth, 0       // 중간점
        );
        shape.bezierCurveTo(
            20 - halfWidth, -20,   // 컨트롤 포인트 3
            50 - halfWidth, -50,   // 컨트롤 포인트 4
            100 - halfWidth, -100  // 끝점 (북동쪽)
        );

        // 반대쪽 강둑
        shape.lineTo(100 + halfWidth, -100);
        shape.bezierCurveTo(
            50 + halfWidth, -50,
            20 + halfWidth, -20,
            0 + halfWidth, 0
        );
        shape.bezierCurveTo(
            -20 + halfWidth, 20,
            -50 + halfWidth, 50,
            -100 + halfWidth, 100
        );
        shape.closePath();

        return shape;
    }, []);

    return (
        <group>
            {/* 강물 */}
            <mesh
                ref={waterRef}
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, 0.1, 0]}
                receiveShadow
            >
                <shapeGeometry args={[riverShape]} />
                <meshStandardMaterial
                    color="#4facfe"
                    transparent
                    opacity={0.75}
                    roughness={0.1}
                    metalness={0.3}
                />
            </mesh>

            {/* 강둑 (어두운 색) */}
            <mesh
                rotation={[-Math.PI / 2, 0, 0]}
                position={[0, 0.05, 0]}
                receiveShadow
            >
                <shapeGeometry args={[riverShape]} />
                <meshStandardMaterial color="#3d7ea6" />
            </mesh>

            {/* 돌다리 1 - 북쪽 (S1과 S2 연결) */}
            <StoneBridge position={[-25, 0.3, -25]} rotation={[0, Math.PI / 4, 0]} />

            {/* 돌다리 2 - 남쪽 (S3과 S4 연결) */}
            <StoneBridge position={[25, 0.3, 25]} rotation={[0, Math.PI / 4, 0]} />

            {/* 폭포 - 강 중간 */}
            <Waterfall position={[0, 0, 0]} />
        </group>
    );
}

// 돌다리 컴포넌트
function StoneBridge({
    position,
    rotation,
}: {
    position: [number, number, number];
    rotation: [number, number, number];
}) {
    return (
        <group position={position} rotation={rotation}>
            {/* 다리 판 */}
            <mesh castShadow receiveShadow>
                <boxGeometry args={[20, 0.5, 5]} />
                <meshStandardMaterial color="#95a5a6" roughness={0.9} />
            </mesh>

            {/* 다리 기둥들 */}
            {[-7, 0, 7].map((x, i) => (
                <mesh key={`pillar-${i}`} castShadow position={[x, -1, 0]}>
                    <cylinderGeometry args={[0.6, 0.8, 2, 8]} />
                    <meshStandardMaterial color="#7f8c8d" roughness={0.9} />
                </mesh>
            ))}

            {/* 난간 */}
            <mesh castShadow position={[0, 0.8, 2.2]}>
                <boxGeometry args={[18, 0.6, 0.3]} />
                <meshStandardMaterial color="#a0a0a0" roughness={0.8} />
            </mesh>
            <mesh castShadow position={[0, 0.8, -2.2]}>
                <boxGeometry args={[18, 0.6, 0.3]} />
                <meshStandardMaterial color="#a0a0a0" roughness={0.8} />
            </mesh>
        </group>
    );
}

// 폭포 컴포넌트
function Waterfall({ position }: { position: [number, number, number] }) {
    const waterfallRef = useRef<THREE.Mesh>(null);

    // 폭포 물 애니메이션
    useFrame((state) => {
        if (waterfallRef.current) {
            const material = waterfallRef.current.material as THREE.MeshStandardMaterial;
            material.opacity = 0.6 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
        }
    });

    return (
        <group position={position}>
            {/* 바위 */}
            <mesh castShadow position={[0, 3, 0]}>
                <dodecahedronGeometry args={[5, 0]} />
                <meshStandardMaterial color="#636e72" roughness={0.95} />
            </mesh>
            <mesh castShadow position={[3, 1.5, 2]}>
                <dodecahedronGeometry args={[2.5, 0]} />
                <meshStandardMaterial color="#7d8a8a" roughness={0.95} />
            </mesh>
            <mesh castShadow position={[-2, 1, -2]}>
                <dodecahedronGeometry args={[2, 0]} />
                <meshStandardMaterial color="#6b7b7b" roughness={0.95} />
            </mesh>

            {/* 폭포 물줄기 */}
            <mesh ref={waterfallRef} position={[-2, 2, 3]}>
                <planeGeometry args={[2, 4]} />
                <meshStandardMaterial
                    color="#87ceeb"
                    transparent
                    opacity={0.7}
                    side={THREE.DoubleSide}
                    emissive="#4facfe"
                    emissiveIntensity={0.1}
                />
            </mesh>

            {/* 물보라 효과 */}
            <mesh position={[-2, 0.5, 4]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[2, 16]} />
                <meshStandardMaterial
                    color="#ffffff"
                    transparent
                    opacity={0.3}
                />
            </mesh>
        </group>
    );
}
