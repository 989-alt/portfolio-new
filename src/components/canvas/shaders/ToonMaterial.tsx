"use client";

import { shaderMaterial } from "@react-three/drei";
import { extend, ReactThreeFiber } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Toon Shader Material - 젠신 임팩트 스타일 셀 셰이딩
 * 특징:
 * - 2~3단계 음영 밴딩
 * - Rim light 효과
 * - 그라디언트 색상 지원
 */

// Vertex Shader
const vertexShader = /* glsl */ `
varying vec3 vNormal;
varying vec3 vViewDir;
varying vec2 vUv;
varying vec3 vWorldPosition;

void main() {
    vUv = uv;
    vNormal = normalize(normalMatrix * normal);
    
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    vViewDir = normalize(cameraPosition - worldPosition.xyz);
    
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
`;

// Fragment Shader
const fragmentShader = /* glsl */ `
uniform vec3 uColor;
uniform vec3 uShadowColor;
uniform vec3 uHighlightColor;
uniform vec3 uRimColor;
uniform float uRimPower;
uniform float uRimIntensity;
uniform vec3 uLightDirection;
uniform float uShadowThreshold;
uniform float uShadowSmoothness;
uniform float uGradientOffset;

varying vec3 vNormal;
varying vec3 vViewDir;
varying vec2 vUv;
varying vec3 vWorldPosition;

void main() {
    // 기본 조명 계산
    vec3 lightDir = normalize(uLightDirection);
    float NdotL = dot(vNormal, lightDir);
    
    // 셀 셰이딩 밴딩 (부드러운 전환)
    float shadowFactor = smoothstep(
        uShadowThreshold - uShadowSmoothness,
        uShadowThreshold + uShadowSmoothness,
        NdotL
    );
    
    // 하이라이트 영역
    float highlightFactor = smoothstep(0.6, 0.8, NdotL);
    
    // 색상 믹싱
    vec3 baseColor = mix(uShadowColor, uColor, shadowFactor);
    baseColor = mix(baseColor, uHighlightColor, highlightFactor * 0.3);
    
    // 높이 기반 그라디언트 (잔디/지형용)
    float heightGradient = smoothstep(-10.0, 30.0, vWorldPosition.y + uGradientOffset);
    baseColor = mix(baseColor * 0.9, baseColor * 1.1, heightGradient);
    
    // Rim Light (역광 효과)
    float rimDot = 1.0 - max(0.0, dot(vViewDir, vNormal));
    float rimFactor = pow(rimDot, uRimPower) * uRimIntensity;
    vec3 rimLight = uRimColor * rimFactor;
    
    // 최종 색상
    vec3 finalColor = baseColor + rimLight;
    
    gl_FragColor = vec4(finalColor, 1.0);
}
`;

// ToonMaterial 정의
const ToonMaterialImpl = shaderMaterial(
    {
        uColor: new THREE.Color("#7bb369"),
        uShadowColor: new THREE.Color("#4a7c3f"),
        uHighlightColor: new THREE.Color("#a8e090"),
        uRimColor: new THREE.Color("#ffffff"),
        uRimPower: 3.0,
        uRimIntensity: 0.4,
        uLightDirection: new THREE.Vector3(1, 1, 0.5).normalize(),
        uShadowThreshold: 0.1,
        uShadowSmoothness: 0.1,
        uGradientOffset: 0.0,
    },
    vertexShader,
    fragmentShader
);

// Extend for R3F
extend({ ToonMaterial: ToonMaterialImpl });

// TypeScript 타입 확장
import { ThreeElement } from "@react-three/fiber";

declare global {
    namespace JSX {
        interface IntrinsicElements {
            toonMaterial: ThreeElement<typeof THREE.ShaderMaterial> & {
                uColor?: THREE.Color | string;
                uShadowColor?: THREE.Color | string;
                uHighlightColor?: THREE.Color | string;
                uRimColor?: THREE.Color | string;
                uRimPower?: number;
                uRimIntensity?: number;
                uLightDirection?: THREE.Vector3;
                uShadowThreshold?: number;
                uShadowSmoothness?: number;
                uGradientOffset?: number;
            };
        }
    }
}

// 프리셋 색상 팔레트
export const TOON_PRESETS = {
    grass: {
        uColor: new THREE.Color("#7bb369"),
        uShadowColor: new THREE.Color("#4a7c3f"),
        uHighlightColor: new THREE.Color("#a8e090"),
    },
    water: {
        uColor: new THREE.Color("#4facfe"),
        uShadowColor: new THREE.Color("#2980b9"),
        uHighlightColor: new THREE.Color("#74b9ff"),
    },
    rock: {
        uColor: new THREE.Color("#95a5a6"),
        uShadowColor: new THREE.Color("#636e72"),
        uHighlightColor: new THREE.Color("#b2bec3"),
    },
    wood: {
        uColor: new THREE.Color("#a0522d"),
        uShadowColor: new THREE.Color("#6b3510"),
        uHighlightColor: new THREE.Color("#cd853f"),
    },
    cherryBlossom: {
        uColor: new THREE.Color("#ffb6c1"),
        uShadowColor: new THREE.Color("#db7093"),
        uHighlightColor: new THREE.Color("#ffc0cb"),
    },
    autumn: {
        uColor: new THREE.Color("#e17055"),
        uShadowColor: new THREE.Color("#b33939"),
        uHighlightColor: new THREE.Color("#fab1a0"),
    },
};

export { ToonMaterialImpl as ToonMaterial };
