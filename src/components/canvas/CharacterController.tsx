"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useKeyboardStore } from "@/hooks/useKeyboardControls";
import { useCharacterStore } from "@/stores/characterStore";
import { useGameStore } from "@/stores/gameStore";
import Avatar from "./Avatar";

interface CharacterControllerProps {
    position?: [number, number, number];
}

export default function CharacterController({ position = [0, 0, 0] }: CharacterControllerProps) {
    const groupRef = useRef<THREE.Group>(null);
    const bodyRef = useRef<THREE.Group>(null);
    const velocityRef = useRef({ x: 0, y: 0, z: 0 });
    const tiltRef = useRef({ x: 0, z: 0 });

    const { setPosition, setAnimationState, setRotation } = useCharacterStore();
    const obstacles = useGameStore((state) => state.obstacles);

    useEffect(() => {
        setPosition(position);
    }, [position, setPosition]);

    useFrame((state, delta) => {
        if (!groupRef.current || !bodyRef.current) return;

        const keyboard = useKeyboardStore.getState();
        const isRunning = keyboard.shift;
        const speed = isRunning ? 10 : 6;
        const jumpForce = 8;

        // 이동 입력
        let moveX = 0;
        let moveZ = 0;

        if (keyboard.forward) moveZ -= 1;
        if (keyboard.backward) moveZ += 1;
        if (keyboard.left) moveX -= 1;
        if (keyboard.right) moveX += 1;

        const length = Math.sqrt(moveX * moveX + moveZ * moveZ);
        if (length > 0) {
            moveX /= length;
            moveZ /= length;
        }

        const targetVelX = moveX * speed;
        const targetVelZ = moveZ * speed;

        velocityRef.current.x = THREE.MathUtils.lerp(velocityRef.current.x, targetVelX, delta * 8);
        velocityRef.current.z = THREE.MathUtils.lerp(velocityRef.current.z, targetVelZ, delta * 8);

        if (keyboard.jump && groupRef.current.position.y <= 0.1) {
            velocityRef.current.y = jumpForce;
        }
        velocityRef.current.y -= 25 * delta;

        // 예상 위치
        let nextX = groupRef.current.position.x + velocityRef.current.x * delta;
        let nextZ = groupRef.current.position.z + velocityRef.current.z * delta;

        // 충돌 체크
        const playerRadius = 0.5;
        let collided = false;

        for (const obs of obstacles) {
            const dx = nextX - obs.x;
            const dz = nextZ - obs.z;
            const distSq = dx * dx + dz * dz;
            const minDist = obs.r + playerRadius;

            if (distSq < minDist * minDist) {
                // X축 체크
                const dxX = (groupRef.current.position.x + velocityRef.current.x * delta) - obs.x;
                const dzX = groupRef.current.position.z - obs.z;
                if (dxX * dxX + dzX * dzX < minDist * minDist) velocityRef.current.x = 0;

                // Z축 체크
                const dxZ = groupRef.current.position.x - obs.x;
                const dzZ = (groupRef.current.position.z + velocityRef.current.z * delta) - obs.z;
                if (dxZ * dxZ + dzZ * dzZ < minDist * minDist) velocityRef.current.z = 0;

                collided = true;
            }
        }

        // 위치 적용
        groupRef.current.position.x += velocityRef.current.x * delta;
        groupRef.current.position.z += velocityRef.current.z * delta;
        groupRef.current.position.y += velocityRef.current.y * delta;

        // 바닥 충돌
        if (groupRef.current.position.y < 0) {
            groupRef.current.position.y = 0;
            velocityRef.current.y = 0;
        }

        // 회전
        if (length > 0) {
            const targetRotation = Math.atan2(moveX, moveZ);
            let rotDiff = targetRotation - groupRef.current.rotation.y;
            while (rotDiff > Math.PI) rotDiff -= Math.PI * 2;
            while (rotDiff < -Math.PI) rotDiff += Math.PI * 2;
            groupRef.current.rotation.y += rotDiff * delta * 15;
            setRotation([0, groupRef.current.rotation.y, 0]);
        }

        // 틸팅
        const leanForward = length > 0 ? 0.15 : 0;
        tiltRef.current.x = THREE.MathUtils.lerp(tiltRef.current.x, leanForward, delta * 5);
        if (groupRef.current.position.y > 0.1) tiltRef.current.x = -0.1;

        let targetBank = 0;
        if (keyboard.left) targetBank = 0.2;
        if (keyboard.right) targetBank = -0.2;
        tiltRef.current.z = THREE.MathUtils.lerp(tiltRef.current.z, targetBank, delta * 5);

        bodyRef.current.rotation.x = tiltRef.current.x;
        bodyRef.current.rotation.z = tiltRef.current.z;

        // 상태 업데이트
        const pos = groupRef.current.position;
        setPosition([pos.x, pos.y, pos.z]);

        if (pos.y > 0.1) setAnimationState("jump");
        else if (length > 0) setAnimationState(isRunning ? "run" : "walk");
        else setAnimationState("idle");
    });

    return (
        <group ref={groupRef} position={position}>
            <group ref={bodyRef}>
                <Avatar />
            </group>
            {/* 그림자 제거됨 */}
        </group>
    );
}
