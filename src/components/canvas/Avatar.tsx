"use client";

import React, { useEffect, useRef, useState } from "react";
import { useFBX, useAnimations } from "@react-three/drei";
import { Group, AnimationClip, LoopRepeat } from "three";
import { useCharacterStore } from "@/stores/characterStore";
import { useControls } from "leva";
import * as THREE from "three";

// Mixamo -> CC Bone Mapping
const MIXAMO_TO_CC: { [key: string]: string } = {
    Hips: "CC_Base_Hip",
    Spine: "CC_Base_Waist",
    Spine1: "CC_Base_Spine01",
    Spine2: "CC_Base_Spine02",
    Neck: "CC_Base_NeckTwist01",
    Head: "CC_Base_Head",

    LeftUpLeg: "CC_Base_L_Thigh",
    LeftLeg: "CC_Base_L_Calf",
    LeftFoot: "CC_Base_L_Foot",
    LeftToeBase: "CC_Base_L_ToeBase",

    RightUpLeg: "CC_Base_R_Thigh",
    RightLeg: "CC_Base_R_Calf",
    RightFoot: "CC_Base_R_Foot",
    RightToeBase: "CC_Base_R_ToeBase",

    LeftShoulder: "CC_Base_L_Clavicle",
    LeftArm: "CC_Base_L_Upperarm",
    LeftForeArm: "CC_Base_L_Forearm",
    LeftHand: "CC_Base_L_Hand",

    RightShoulder: "CC_Base_R_Clavicle",
    RightArm: "CC_Base_R_Upperarm",
    RightForeArm: "CC_Base_R_Forearm",
    RightHand: "CC_Base_R_Hand",
};

export default function Avatar() {
    const group = useRef<Group>(null);
    const { animationState } = useCharacterStore();

    const character = useFBX("/models/character.fbx");
    const idle = useFBX("/models/Idle.fbx");
    const walk = useFBX("/models/Walking.fbx");
    const run = useFBX("/models/Running.fbx");
    const jump = useFBX("/models/Jumping.fbx");

    const [clips, setClips] = useState<AnimationClip[]>([]);

    // 요청받은 고정값 반영 (0, 0, 0, 0.02, 0.3)
    const { rotX, rotY, rotZ, scale, posY } = useControls("Avatar", {
        rotX: { value: 0, min: -3.14, max: 3.14, step: 0.01 },
        rotY: { value: 0, min: -3.14, max: 3.14, step: 0.01 },
        rotZ: { value: 0, min: -3.14, max: 3.14, step: 0.01 },
        scale: { value: 0.02, step: 0.001 },
        posY: { value: 1.0, step: 0.1 },
    });

    useEffect(() => {
        if (!character || !idle || !walk || !run || !jump) return;

        const modelBones = new Set<string>();
        character.traverse((obj) => {
            if (obj.type === "Bone") modelBones.add(obj.name);
        });

        const processClip = (fbx: THREE.Group, name: string) => {
            const clip = fbx.animations[0];
            if (!clip) return null;

            const newClip = clip.clone();
            newClip.name = name;

            const newTracks: THREE.KeyframeTrack[] = [];

            newClip.tracks.forEach((track) => {
                // Root Motion 제거 로직 (In-Place 만들기)
                // Hips의 Position 트랙을 제거하면 캐릭터가 제자리에서 움직임
                if (track.name.includes("Hips.position") || track.name.includes("Hip.position")) {
                    return; // 트랙 제거
                }

                const parts = track.name.split(".");
                const prop = parts.pop();
                let boneName = parts.join(".");
                const cleanName = boneName.replace(/mixamorig:?|Character:?/gi, "");

                let targetBone = MIXAMO_TO_CC[cleanName];

                if (!targetBone && modelBones.has(cleanName)) targetBone = cleanName;
                if (!targetBone) {
                    for (const realBone of modelBones) {
                        if (realBone.endsWith(cleanName)) {
                            targetBone = realBone;
                            break;
                        }
                    }
                }

                if (targetBone && modelBones.has(targetBone)) {
                    track.name = `${targetBone}.${prop}`;
                    newTracks.push(track);
                }
            });

            newClip.tracks = newTracks;
            return newClip;
        };

        const newClips = [
            processClip(idle, "idle"),
            processClip(walk, "walk"),
            processClip(run, "run"),
            processClip(jump, "jump"),
        ].filter((c): c is AnimationClip => c !== null);

        setClips(newClips);
    }, [character, idle, walk, run, jump]);

    const { actions } = useAnimations(clips, group);

    useEffect(() => {
        const action = actions[animationState];
        if (action) {
            if (animationState === "jump") {
                action.reset().fadeIn(0.1).setLoop(LoopRepeat, 1).play();
                action.clampWhenFinished = true;
            } else {
                action.reset().fadeIn(0.2).play();
            }
            return () => {
                action.fadeOut(0.2);
            };
        }
    }, [animationState, actions]);

    useEffect(() => {
        character.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                mesh.castShadow = true;
                mesh.receiveShadow = true;

                // 기존 재질이 배열일 수도 있고 단일일 수도 있음
                // Tripo AI 등에서 생성된 모델의 재질 쉐이더 오류 방지를 위해 표준 재질로 교체
                const oldMaterial = mesh.material;
                if (oldMaterial) {
                    // 단일 재질이라고 가정하고 처리 (대부분의 캐릭터 모델)
                    // 배열인 경우 첫번째만 처리하거나 반복문 필요하지만, 보통 캐릭터는 단일 텍스처 사용
                    const mat = Array.isArray(oldMaterial) ? oldMaterial[0] : oldMaterial;

                    // 기존 텍스처(map)가 있다면 유지
                    const map = "map" in mat ? (mat as THREE.MeshStandardMaterial).map : null;

                    mesh.material = new THREE.MeshStandardMaterial({
                        map: map,
                        roughness: 0.6,
                        metalness: 0.1,
                        // 필요한 경우 색상도 유지할 수 있음
                        // color: (mat as THREE.MeshStandardMaterial).color,
                    });

                    // 텍스처 색공간 보정 (필요시)
                    if (map) {
                        map.colorSpace = THREE.SRGBColorSpace;
                    }
                }
            }
        });
    }, [character]);

    return (
        <group ref={group} dispose={null}>
            <group
                position={[0, posY, 0]}
                rotation={[rotX, rotY, rotZ]}
                scale={[scale, scale, scale]}
            >
                <primitive object={character} />
            </group>
        </group>
    );
}
