"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * 젠신 임팩트 스타일 그라디언트 스카이 + 구름
 * - 그라디언트 반구 하늘
 * - 애니메이션 구름 레이어
 * - 태양 후광 효과
 */

// 구름 버텍스 셰이더
const cloudVertexShader = /* glsl */ `
varying vec2 vUv;
varying float vFog;

void main() {
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    vFog = smoothstep(100.0, 300.0, -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
}
`;

// 구름 프래그먼트 셰이더
const cloudFragmentShader = /* glsl */ `
uniform float uTime;
uniform vec3 uCloudColor;
uniform float uOpacity;

varying vec2 vUv;
varying float vFog;

// Simplex noise function
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
}

void main() {
    vec2 uv = vUv * 3.0;
    
    // 움직이는 구름 노이즈
    float noise1 = snoise(uv + uTime * 0.02);
    float noise2 = snoise(uv * 2.0 - uTime * 0.03) * 0.5;
    float noise3 = snoise(uv * 4.0 + uTime * 0.01) * 0.25;
    
    float cloudNoise = (noise1 + noise2 + noise3) * 0.5 + 0.5;
    cloudNoise = smoothstep(0.4, 0.7, cloudNoise);
    
    // 가장자리 페이드
    float edgeFade = 1.0 - smoothstep(0.3, 0.5, abs(vUv.x - 0.5));
    edgeFade *= 1.0 - smoothstep(0.3, 0.5, abs(vUv.y - 0.5));
    
    float alpha = cloudNoise * edgeFade * uOpacity * (1.0 - vFog);
    
    gl_FragColor = vec4(uCloudColor, alpha);
}
`;

export default function GradientSky() {
    const cloudRef = useRef<THREE.Mesh>(null);

    // 스카이 그라디언트 머티리얼
    const skyMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                uTopColor: { value: new THREE.Color("#87ceeb") },
                uMiddleColor: { value: new THREE.Color("#b4e4ff") },
                uBottomColor: { value: new THREE.Color("#e0f4ff") },
            },
            vertexShader: `
                varying vec3 vWorldPosition;
                void main() {
                    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
                    vWorldPosition = worldPosition.xyz;
                    gl_Position = projectionMatrix * viewMatrix * worldPosition;
                }
            `,
            fragmentShader: `
                uniform vec3 uTopColor;
                uniform vec3 uMiddleColor;
                uniform vec3 uBottomColor;
                varying vec3 vWorldPosition;
                
                void main() {
                    float h = normalize(vWorldPosition).y;
                    vec3 color;
                    if (h > 0.0) {
                        color = mix(uMiddleColor, uTopColor, h);
                    } else {
                        color = mix(uMiddleColor, uBottomColor, -h);
                    }
                    gl_FragColor = vec4(color, 1.0);
                }
            `,
            side: THREE.BackSide,
        });
    }, []);

    // 구름 머티리얼
    const cloudMaterial = useMemo(() => {
        return new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uCloudColor: { value: new THREE.Color("#ffffff") },
                uOpacity: { value: 0.6 },
            },
            vertexShader: cloudVertexShader,
            fragmentShader: cloudFragmentShader,
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false,
        });
    }, []);

    useFrame((state) => {
        if (cloudRef.current) {
            (cloudRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value =
                state.clock.elapsedTime;
        }
    });

    return (
        <group>
            {/* 스카이 돔 */}
            <mesh material={skyMaterial}>
                <sphereGeometry args={[500, 32, 32]} />
            </mesh>

            {/* 구름 레이어 1 */}
            <mesh
                ref={cloudRef}
                position={[0, 80, -100]}
                rotation={[-Math.PI / 6, 0, 0]}
                material={cloudMaterial}
            >
                <planeGeometry args={[400, 150, 1, 1]} />
            </mesh>

            {/* 구름 레이어 2 */}
            <mesh
                position={[100, 90, -150]}
                rotation={[-Math.PI / 5, 0.2, 0]}
                material={cloudMaterial.clone()}
            >
                <planeGeometry args={[300, 120, 1, 1]} />
            </mesh>

            {/* 태양 글로우 */}
            <mesh position={[100, 100, -200]}>
                <circleGeometry args={[30, 32]} />
                <meshBasicMaterial
                    color="#fff5e6"
                    transparent
                    opacity={0.8}
                />
            </mesh>
            <mesh position={[100, 100, -199]}>
                <circleGeometry args={[60, 32]} />
                <meshBasicMaterial
                    color="#fffbe6"
                    transparent
                    opacity={0.3}
                />
            </mesh>
        </group>
    );
}
