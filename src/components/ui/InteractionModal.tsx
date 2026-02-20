"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/stores/gameStore";
import { PORTFOLIO_ZONES } from "@/lib/portfolioData";

export default function InteractionModal() {
    const { interactModal, closeModal } = useGameStore();

    // ESC 키로 닫기
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                closeModal();
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [closeModal]);

    // 현재 존 데이터 찾기
    const currentZoneData = interactModal
        ? PORTFOLIO_ZONES.find((z) => z.title === interactModal.title)
        : null;

    return (
        <AnimatePresence>
            {interactModal?.isOpen && interactModal && (
                <>
                    {/* 배경 오버레이 */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        onClick={closeModal}
                    />

                    {/* 모달 */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg"
                    >
                        <div
                            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl shadow-2xl border border-white/10 overflow-hidden"
                            style={{
                                boxShadow: currentZoneData
                                    ? `0 0 60px ${currentZoneData.color}40`
                                    : undefined,
                            }}
                        >
                            {/* 헤더 */}
                            <div
                                className="p-6 text-white"
                                style={{
                                    background: currentZoneData
                                        ? `linear-gradient(135deg, ${currentZoneData.color}80, ${currentZoneData.color}40)`
                                        : "linear-gradient(135deg, #6c5ce7, #a29bfe)",
                                }}
                            >
                                <div className="flex items-center gap-4">
                                    <span className="text-4xl">
                                        {currentZoneData?.icon || "📁"}
                                    </span>
                                    <div>
                                        <h2 className="text-2xl font-bold">{interactModal.title}</h2>
                                        <p className="text-white/80">{interactModal.description}</p>
                                    </div>
                                </div>
                            </div>

                            {/* 콘텐츠 */}
                            <div className="p-6">
                                <p className="text-white/90 whitespace-pre-wrap">
                                    {interactModal.description || "이 영역에 대한 상세 설명이 제공될 예정입니다."}
                                </p>
                            </div>

                            {/* 푸터 */}
                            <div className="px-6 py-4 bg-black/20 flex justify-between items-center">
                                <p className="text-white/50 text-sm">ESC 또는 바깥 클릭으로 닫기</p>
                                <button
                                    onClick={closeModal}
                                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                                >
                                    닫기
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
