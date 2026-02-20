"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, Suspense } from "react";
import { Environment, ContactShadows } from "@react-three/drei";
import { EffectComposer, Bloom, ToneMapping, Vignette } from "@react-three/postprocessing";
import { BlendFunction, ToneMappingMode } from "postprocessing";
import { Leva } from "leva";
import * as THREE from "three";
import CharacterController from "./CharacterController";
import CameraFollow from "./CameraFollow";
import ZonePlatform from "./ZonePlatform";
import World from "./World";
import InteractionModal from "@/components/ui/InteractionModal";
import { useCharacterStore } from "@/stores/characterStore";
import { useGameStore } from "@/stores/gameStore";
import { useKeyboardControls, useKeyboardStore } from "@/hooks/useKeyboardControls";
import { PORTFOLIO_ZONES, HOME_ZONE } from "@/lib/portfolioData";

function Controls() {
  useKeyboardControls();
  return null;
}

function PortfolioZones() {
  return (
    <>
      {PORTFOLIO_ZONES.map((zone) => (
        <ZonePlatform key={zone.id} zone={zone} />
      ))}
    </>
  );
}

function InteractionHandler() {
  const interact = useKeyboardStore((state) => state.interact);
  const currentZone = useGameStore((state) => state.currentZone);
  const openModal = useGameStore((state) => state.openModal);

  useEffect(() => {
    if (interact && currentZone) {
      if (currentZone === "home") {
        openModal({
          isOpen: true,
          title: HOME_ZONE.title,
          description: HOME_ZONE.description,
          type: "about",
        });
        return;
      }
      const zone = PORTFOLIO_ZONES.find((z) => z.id === currentZone);
      if (zone) {
        const typeMap: Record<string, "about" | "skill" | "project" | "contact"> = {
          about: "about",
          project: "project",
          insight: "skill",
          contact: "contact",
        };
        openModal({
          isOpen: true,
          title: zone.title,
          description: zone.description,
          type: typeMap[zone.id] || "about",
        });
      }
    }
  }, [interact, currentZone, openModal]);

  return null;
}

function HUD() {
  const currentZone = useGameStore((state) => state.currentZone);

  return (
    <>
      <div className="absolute top-6 left-1/2 -translate-x-1/2 pointer-events-none text-center">
        <h1 className="font-display text-4xl text-gray-800 drop-shadow-sm mb-1" style={{ fontFamily: 'sans-serif', fontWeight: 800 }}>
          Seonbi's World
        </h1>
        <p className="text-gray-600 text-sm font-medium">Developer Portfolio</p>
      </div>

      <div className="absolute bottom-4 left-4 font-body pointer-events-none">
        <div className="bg-white/80 backdrop-blur-md p-4 rounded-3xl shadow-lg border border-white">
          <div className="text-gray-600 text-sm font-bold flex gap-4">
            <span>WASD Move</span>
            <span>SPACE Jump</span>
            <span>SHIFT Run</span>
            <span>E Interact</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 font-body pointer-events-none">
        {currentZone && (
          <div className="bg-white/90 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border-2 border-indigo-100 animate-bounce">
            <p className="text-indigo-600 font-bold text-lg">📍 {currentZone.toUpperCase()}</p>
          </div>
        )}
      </div>
    </>
  );
}

function PostProcessing() {
  return (
    <EffectComposer>
      <Bloom intensity={0.3} luminanceThreshold={0.8} luminanceSmoothing={0.9} mipmapBlur />
      <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
      <Vignette offset={0.3} darkness={0.4} blendFunction={BlendFunction.NORMAL} />
    </EffectComposer>
  );
}

export default function Experience() {
  return (
    <div className="w-full h-screen relative bg-[#87ceeb]">
      <Leva collapsed />
      <Controls />

      <Canvas
        shadows
        camera={{ position: [0, 30, 45], fov: 50 }}
        gl={{
          antialias: true,
          toneMapping: THREE.NoToneMapping,
          toneMappingExposure: 1.0,
        }}
        dpr={[1, 1.5]}
      >
        <color attach="background" args={["#87ceeb"]} />
        <fog attach="fog" args={["#b4e4ff", 80, 280]} />

        <Environment preset="park" background={false} />
        <ambientLight intensity={0.7} color="#fffbe6" />
        <directionalLight
          castShadow
          position={[80, 100, 60]}
          intensity={1.8}
          color="#fff5e6"
          shadow-mapSize={[2048, 2048]}
          shadow-camera-far={350}
          shadow-camera-left={-160}
          shadow-camera-right={160}
          shadow-camera-top={160}
          shadow-camera-bottom={-160}
          shadow-bias={-0.0003}
        />
        <directionalLight position={[-50, 50, -50]} intensity={0.4} color="#b4e4ff" />
        <hemisphereLight intensity={0.5} color="#87ceeb" groundColor="#7bb369" />

        <Suspense fallback={null}>
          <CameraFollow />
          <CharacterController position={[0, 0, 20]} />
          <World />
          <PortfolioZones />
        </Suspense>

        <InteractionHandler />

        <ContactShadows
          resolution={1024}
          scale={180}
          blur={2.5}
          opacity={0.3}
          far={20}
          color="#2d5a27"
        />

        <PostProcessing />
      </Canvas>

      <HUD />
      <InteractionModal />
    </div>
  );
}
