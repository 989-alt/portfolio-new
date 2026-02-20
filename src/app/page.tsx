"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

// 로딩 화면 컴포넌트
function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const [tip, setTip] = useState(0);

  const tips = [
    "🎮 방향키로 이동, Space로 점프!",
    "🏃 Shift를 누르면 달릴 수 있어요",
    "💡 존에 가까이 가면 정보가 나타나요",
    "🔑 E키로 상호작용하세요",
  ];

  useEffect(() => {
    let currentProgress = 0;
    const progressInterval = setInterval(() => {
      currentProgress = Math.min(currentProgress + Math.random() * 15 + 5, 100);
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(progressInterval);
      }
    }, 100);

    const tipInterval = setInterval(() => {
      setTip((t) => (t + 1) % tips.length);
    }, 2000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(tipInterval);
    };
  }, []);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-b from-sky-400 to-sky-600">
      <div className="text-center">
        {/* 타이틀 */}
        <h1 className="font-display text-7xl text-white mb-4 animate-bounce drop-shadow-lg">
          Project Gravity
        </h1>
        <p className="font-body text-white/80 text-xl mb-8">
          인터랙티브 3D 포트폴리오
        </p>

        {/* 프로그레스 바 */}
        <div className="w-64 h-3 bg-white/30 rounded-full overflow-hidden mx-auto mb-4">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-200 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-white/80 text-lg mb-6">{Math.round(progress)}%</p>

        {/* 팁 */}
        <p className="text-white/70 text-base animate-pulse font-body">
          {tips[tip]}
        </p>
      </div>

      {/* 캐릭터 실루엣 */}
      <div className="absolute bottom-10 text-8xl animate-bounce">
        🏃
      </div>
    </div>
  );
}

// 클라이언트 사이드에서만 3D Experience 로드 (SSR 비활성화)
const Experience = dynamic(
  () => import("@/components/canvas/Experience"),
  {
    ssr: false,
    loading: () => <LoadingScreen />,
  }
);

export default function Home() {
  return (
    <main className="w-full h-screen overflow-hidden">
      <Experience />
    </main>
  );
}
