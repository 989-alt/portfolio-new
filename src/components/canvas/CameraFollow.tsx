"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import * as THREE from "three";
import { useCharacterStore } from "@/stores/characterStore";

// 카메라 설정
const CAMERA_CONFIG = {
    distance: 8, // 캐릭터로부터의 거리
    height: 5, // 높이
    damping: 0.05, // 부드러움 (0~1, 낮을수록 부드러움)
    lookAtHeight: 1, // 바라보는 높이 오프셋
    fov: 60,
};

export default function CameraFollow() {
    const cameraRef = useRef<THREE.PerspectiveCamera>(null);
    const currentPosition = useRef(new THREE.Vector3(0, CAMERA_CONFIG.height, CAMERA_CONFIG.distance));
    const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));

    const position = useCharacterStore((state) => state.position);

    useFrame(() => {
        if (!cameraRef.current) return;

        // 목표 카메라 위치 (캐릭터 뒤쪽 상단)
        const targetPosition = new THREE.Vector3(
            position[0],
            position[1] + CAMERA_CONFIG.height,
            position[2] + CAMERA_CONFIG.distance
        );

        // 목표 바라보는 위치
        const targetLookAt = new THREE.Vector3(
            position[0],
            position[1] + CAMERA_CONFIG.lookAtHeight,
            position[2]
        );

        // 부드러운 보간 (Lerp)
        currentPosition.current.lerp(targetPosition, CAMERA_CONFIG.damping);
        currentLookAt.current.lerp(targetLookAt, CAMERA_CONFIG.damping);

        // 카메라 적용
        cameraRef.current.position.copy(currentPosition.current);
        cameraRef.current.lookAt(currentLookAt.current);
    });

    return (
        <PerspectiveCamera
            ref={cameraRef}
            makeDefault
            fov={CAMERA_CONFIG.fov}
            near={0.1}
            far={1000}
            position={[0, CAMERA_CONFIG.height, CAMERA_CONFIG.distance]}
        />
    );
}
