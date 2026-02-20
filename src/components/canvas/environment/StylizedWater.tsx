"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * 스타일화된 물 - 젠신 임팩트 스타일
 * - 청록색 투명 물
 * - 물결 애니메이션
 * - 가장자리 거품 효과
 */

// 물 버텍스 셰이더
const waterVertexShader = /* glsl */ `
uniform float uTime;
uniform float uWaveHeight;
uniform float uWaveFrequency;

varying vec2 vUv;
varying vec3 vWorldPosition;
varying float vWave;

void main() {
    vUv = uv;
    
    vec3 pos = position;
    
    // 물결 효과
    float wave1 = sin(pos.x * uWaveFrequency + uTime * 1.5) * uWaveHeight;
    float wave2 = sin(pos.y * uWaveFrequency * 0.8 + uTime * 1.2) * uWaveHeight * 0.5;
    float wave3 = sin((pos.x + pos.y) * uWaveFrequency * 0.5 + uTime) * uWaveHeight * 0.3;
    
    pos.z += wave1 + wave2 + wave3;
    vWave = (wave1 + wave2 + wave3) / uWaveHeight;
    
    vec4 worldPosition = modelMatrix * vec4(pos, 1.0);
    vWorldPosition = worldPosition.xyz;
    
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
`;

// 물 프래그먼트 셰이더
const waterFragmentShader = /* glsl */ `
uniform float uTime;
uniform vec3 uShallowColor;
uniform vec3 uDeepColor;
uniform vec3 uFoamColor;
uniform float uOpacity;
uniform float uFoamThreshold;

varying vec2 vUv;
varying vec3 vWorldPosition;
varying float vWave;

void main() {
    // 깊이에 따른 색상 변화
    float depth = smoothstep(0.0, 1.0, vUv.y);
    vec3 waterColor = mix(uShallowColor, uDeepColor, depth);
    
    // 물결에 따른 하이라이트
    float highlight = smoothstep(0.3, 0.8, vWave);
    waterColor = mix(waterColor, vec3(1.0), highlight * 0.15);
    
    // 가장자리 거품 (UV 기반)
    float edgeFoam = 1.0 - smoothstep(0.0, 0.1, vUv.x);
    edgeFoam += 1.0 - smoothstep(0.9, 1.0, vUv.x);
    edgeFoam += 1.0 - smoothstep(0.0, 0.1, vUv.y);
    edgeFoam += 1.0 - smoothstep(0.9, 1.0, vUv.y);
    edgeFoam = clamp(edgeFoam, 0.0, 1.0);
    
    // 애니메이션 거품 패턴
    float foamNoise = sin(vUv.x * 20.0 + uTime * 2.0) * sin(vUv.y * 20.0 + uTime * 1.5);
    foamNoise = smoothstep(uFoamThreshold, 1.0, foamNoise);
    
    vec3 finalColor = mix(waterColor, uFoamColor, (edgeFoam + foamNoise * 0.3) * 0.4);
    
    // 투명도 변화
    float alpha = uOpacity - highlight * 0.1;
    
    gl_FragColor = vec4(finalColor, alpha);
}
`;

interface StylizedWaterProps {
    position?: [number, number, number];
    rotation?: [number, number, number];
    size?: [number, number];
    segments?: number;
}

export default function StylizedWater({
    position = [0, 0, 0],
    rotation = [-Math.PI / 2, 0, 0],
    size = [100, 100],
    segments = 64,
}: StylizedWaterProps) {
    const meshRef = useRef<THREE.Mesh>(null);

    const material = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uWaveHeight: { value: 0.3 },
                uWaveFrequency: { value: 0.5 },
                uShallowColor: { value: new THREE.Color("#5fd3bc") },
                uDeepColor: { value: new THREE.Color("#2980b9") },
                uFoamColor: { value: new THREE.Color("#ffffff") },
                uOpacity: { value: 0.85 },
                uFoamThreshold: { value: 0.7 },
            },
            vertexShader: waterVertexShader,
            fragmentShader: waterFragmentShader,
            transparent: true,
            side: THREE.DoubleSide,
        });
    }, []);

    useFrame((state) => {
        if (meshRef.current) {
            (meshRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value =
                state.clock.elapsedTime;
        }
    });

    return (
        <mesh
            ref={meshRef}
            position={position}
            rotation={rotation}
            material={material}
            receiveShadow
        >
            <planeGeometry args={[size[0], size[1], segments, segments]} />
        </mesh>
    );
}
