"use client";

import { useMemo, useEffect, useRef } from "react";
import { Instance, Instances } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PORTFOLIO_ZONES, MAP_CONFIG } from "@/lib/portfolioData";
import { useGameStore } from "@/stores/gameStore";
import CherryBlossomTree from "./CherryBlossomTree";
import { Hanok, BulletinBoard, Shrine, Mailbox } from "./KoreanLandmarks";
import GradientSky from "./environment/GradientSky";
import StylizedWater from "./environment/StylizedWater";

const TOON_COLORS = {
    grass: { base: "#7bb369", shadow: "#4a7c3f", highlight: "#a8e090" },
    path: { base: "#d4a574", shadow: "#a67c52" },
    tree: {
        trunk: "#8d5524", trunkShadow: "#5c351a",
        pink: "#ffb6c1", pinkShadow: "#db7093",
        green: "#55efc4", greenShadow: "#00b894",
        autumn: "#e17055", autumnShadow: "#b33939",
    },
    rock: { base: "#a0a0a0", shadow: "#6d6d6d" },
    mountain: { base: "#7f8c8d", shadow: "#566573", snow: "#ecf0f1" },
};

const isRiver = (x: number, z: number): boolean => {
    const distanceToRiver = Math.abs(x + z) / Math.sqrt(2);
    return distanceToRiver < MAP_CONFIG.riverWidth / 2;
};

const isPath = (x: number, z: number): boolean => {
    if (x * x + z * z < 900) return true;
    for (const zone of PORTFOLIO_ZONES) {
        const dx = x - zone.position[0];
        const dz = z - zone.position[2];
        if (dx * dx + dz * dz < 225) return true;
    }
    return false;
};

function StylizedTerrain() {
    const grassMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                uColorTop: { value: new THREE.Color(TOON_COLORS.grass.highlight) },
                uColorMid: { value: new THREE.Color(TOON_COLORS.grass.base) },
                uColorBottom: { value: new THREE.Color(TOON_COLORS.grass.shadow) },
                uLightDir: { value: new THREE.Vector3(1, 1, 0.5).normalize() },
            },
            vertexShader: `
                varying vec2 vUv;
                varying vec3 vNormal;
                varying vec3 vWorldPos;
                void main() {
                    vUv = uv;
                    vNormal = normalize(normalMatrix * normal);
                    vec4 worldPos = modelMatrix * vec4(position, 1.0);
                    vWorldPos = worldPos.xyz;
                    gl_Position = projectionMatrix * viewMatrix * worldPos;
                }
            `,
            fragmentShader: `
                uniform vec3 uColorTop;
                uniform vec3 uColorMid;
                uniform vec3 uColorBottom;
                uniform vec3 uLightDir;
                varying vec2 vUv;
                varying vec3 vNormal;
                varying vec3 vWorldPos;
                void main() {
                    float NdotL = dot(vNormal, uLightDir);
                    float lightFactor = smoothstep(-0.2, 0.5, NdotL);
                    float distFromCenter = length(vWorldPos.xz) / 125.0;
                    distFromCenter = clamp(distFromCenter, 0.0, 1.0);
                    vec3 baseColor = mix(uColorMid, uColorBottom, distFromCenter * 0.3);
                    baseColor = mix(uColorBottom, baseColor, lightFactor);
                    float highlight = smoothstep(0.7, 1.0, NdotL);
                    baseColor = mix(baseColor, uColorTop, highlight * 0.3);
                    gl_FragColor = vec4(baseColor, 1.0);
                }
            `,
        });
    }, []);

    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow material={grassMaterial}>
            <planeGeometry args={[MAP_CONFIG.size, MAP_CONFIG.size, 1, 1]} />
        </mesh>
    );
}

function ForestTrees({ count = 350 }) {
    const addObstacle = useGameStore((state) => state.addObstacle);

    const data = useMemo(() => {
        const items = [];
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * MAP_CONFIG.size * 0.85;
            const z = (Math.random() - 0.5) * MAP_CONFIG.size * 0.85;
            if (isPath(x, z)) continue;
            if (isRiver(x, z)) continue;
            const distFromCenter = Math.sqrt(x * x + z * z);
            let type: "pink" | "green" | "autumn";
            if (distFromCenter < 50) {
                type = Math.random() > 0.2 ? "pink" : "green";
            } else {
                const rand = Math.random();
                type = rand < 0.4 ? "pink" : rand < 0.75 ? "green" : "autumn";
            }
            items.push({ position: [x, 0, z] as [number, number, number], scale: 0.9 + Math.random() * 0.5, type });
        }
        return items;
    }, [count]);

    useEffect(() => {
        data.forEach((d) => addObstacle({ x: d.position[0], z: d.position[2], r: 0.6 }));
    }, [data, addObstacle]);

    const trunkMaterial = useMemo(() => new THREE.MeshToonMaterial({ color: TOON_COLORS.tree.trunk }), []);
    const pinkMaterial = useMemo(() => new THREE.MeshToonMaterial({ color: TOON_COLORS.tree.pink }), []);
    const greenMaterial = useMemo(() => new THREE.MeshToonMaterial({ color: TOON_COLORS.tree.green }), []);
    const autumnMaterial = useMemo(() => new THREE.MeshToonMaterial({ color: TOON_COLORS.tree.autumn }), []);

    return (
        <group>
            <Instances range={1000} castShadow receiveShadow material={trunkMaterial}>
                <cylinderGeometry args={[0.2, 0.4, 2.5, 8]} />
                {data.map((d, i) => (
                    <Instance key={`trunk-${i}`} position={[d.position[0], 1.25 * d.scale, d.position[2]]} scale={[d.scale, d.scale, d.scale]} />
                ))}
            </Instances>
            <Instances range={1000} castShadow receiveShadow material={pinkMaterial}>
                <dodecahedronGeometry args={[2, 1]} />
                {data.filter((d) => d.type === "pink").map((d, i) => (
                    <Instance key={`pink-${i}`} position={[d.position[0], 3.5 * d.scale, d.position[2]]} scale={[d.scale * 0.9, d.scale, d.scale * 0.9]} />
                ))}
            </Instances>
            <Instances range={1000} castShadow receiveShadow material={greenMaterial}>
                <dodecahedronGeometry args={[2, 1]} />
                {data.filter((d) => d.type === "green").map((d, i) => (
                    <Instance key={`green-${i}`} position={[d.position[0], 3.5 * d.scale, d.position[2]]} scale={[d.scale * 0.9, d.scale, d.scale * 0.9]} />
                ))}
            </Instances>
            <Instances range={1000} castShadow receiveShadow material={autumnMaterial}>
                <dodecahedronGeometry args={[2, 1]} />
                {data.filter((d) => d.type === "autumn").map((d, i) => (
                    <Instance key={`autumn-${i}`} position={[d.position[0], 3.5 * d.scale, d.position[2]]} scale={[d.scale * 0.9, d.scale, d.scale * 0.9]} />
                ))}
            </Instances>
        </group>
    );
}

function KoreanLandmarks() {
    const addObstacle = useGameStore((state) => state.addObstacle);
    useEffect(() => {
        PORTFOLIO_ZONES.forEach((zone) => addObstacle({ x: zone.position[0], z: zone.position[2], r: 5 }));
    }, [addObstacle]);

    return (
        <group>
            {PORTFOLIO_ZONES.map((zone) => {
                switch (zone.landmark) {
                    case "hanok": return <Hanok key={zone.id} position={zone.position} color={zone.color} />;
                    case "bulletin": return <BulletinBoard key={zone.id} position={zone.position} color={zone.color} />;
                    case "shrine": return <Shrine key={zone.id} position={zone.position} color={zone.color} />;
                    case "mailbox": return <Mailbox key={zone.id} position={zone.position} color={zone.color} />;
                    default: return null;
                }
            })}
        </group>
    );
}

function DirtPaths() {
    const pathMaterial = useMemo(() => new THREE.MeshToonMaterial({ color: TOON_COLORS.path.base }), []);
    return (
        <group>
            <mesh receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} material={pathMaterial}>
                <circleGeometry args={[22, 32]} />
            </mesh>
            {PORTFOLIO_ZONES.map((zone) => {
                const angle = Math.atan2(zone.position[2], zone.position[0]);
                const distance = Math.sqrt(zone.position[0] ** 2 + zone.position[2] ** 2);
                return (
                    <mesh key={`path-${zone.id}`} receiveShadow rotation={[-Math.PI / 2, 0, -angle]} position={[zone.position[0] / 2, 0.01, zone.position[2] / 2]} material={pathMaterial}>
                        <planeGeometry args={[distance, MAP_CONFIG.pathWidth + 2]} />
                    </mesh>
                );
            })}
            {PORTFOLIO_ZONES.map((zone) => (
                <mesh key={`zone-ground-${zone.id}`} receiveShadow rotation={[-Math.PI / 2, 0, 0]} position={[zone.position[0], 0.01, zone.position[2]]} material={pathMaterial}>
                    <circleGeometry args={[12, 24]} />
                </mesh>
            ))}
        </group>
    );
}

function Mountains() {
    const mountains = useMemo(() => {
        const items = [];
        const mapHalf = MAP_CONFIG.size / 2;
        for (let i = 0; i < 20; i++) {
            const angle = (i / 20) * Math.PI * 2;
            const radius = mapHalf + 30 + Math.random() * 40;
            items.push({
                position: [Math.cos(angle) * radius, 0, Math.sin(angle) * radius] as [number, number, number],
                scale: 20 + Math.random() * 25,
                height: 40 + Math.random() * 50,
                hasSnow: Math.random() > 0.5,
            });
        }
        return items;
    }, []);

    const mountainMaterial = useMemo(() => new THREE.MeshToonMaterial({ color: TOON_COLORS.mountain.base }), []);
    const snowMaterial = useMemo(() => new THREE.MeshToonMaterial({ color: TOON_COLORS.mountain.snow }), []);

    return (
        <group>
            {mountains.map((m, i) => (
                <group key={`mountain-${i}`} position={[m.position[0], m.height / 2, m.position[2]]}>
                    <mesh castShadow material={mountainMaterial}><coneGeometry args={[m.scale, m.height, 6]} /></mesh>
                    {m.hasSnow && <mesh position={[0, m.height * 0.35, 0]} material={snowMaterial}><coneGeometry args={[m.scale * 0.4, m.height * 0.3, 6]} /></mesh>}
                </group>
            ))}
        </group>
    );
}

function DiagonalRiver() {
    return (
        <group>
            <StylizedWater position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 4]} size={[200, 18]} segments={32} />
            <StoneBridge position={[-25, 0.5, -25]} rotation={[0, Math.PI / 4, 0]} />
            <StoneBridge position={[25, 0.5, 25]} rotation={[0, Math.PI / 4, 0]} />
        </group>
    );
}

function StoneBridge({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
    const bridgeMaterial = useMemo(() => new THREE.MeshToonMaterial({ color: TOON_COLORS.rock.base }), []);
    return (
        <group position={position} rotation={rotation}>
            <mesh castShadow receiveShadow material={bridgeMaterial}><boxGeometry args={[22, 0.6, 6]} /></mesh>
            {[-8, 0, 8].map((x, i) => (<mesh key={i} castShadow position={[x, -1.2, 0]} material={bridgeMaterial}><cylinderGeometry args={[0.7, 0.9, 2.4, 8]} /></mesh>))}
            <mesh castShadow position={[0, 0.9, 2.7]} material={bridgeMaterial}><boxGeometry args={[20, 0.5, 0.3]} /></mesh>
            <mesh castShadow position={[0, 0.9, -2.7]} material={bridgeMaterial}><boxGeometry args={[20, 0.5, 0.3]} /></mesh>
        </group>
    );
}

export default function World() {
    const clearObstacles = useGameStore((state) => state.clearObstacles);
    useEffect(() => { clearObstacles(); }, [clearObstacles]);

    return (
        <group>
            <GradientSky />
            <StylizedTerrain />
            <DirtPaths />
            <DiagonalRiver />
            <CherryBlossomTree />
            <KoreanLandmarks />
            <ForestTrees count={MAP_CONFIG.forestDensity} />
            <Mountains />
        </group>
    );
}
