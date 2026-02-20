"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/stores/gameStore";
import { PORTFOLIO_ZONES } from "@/lib/portfolioData";

export default function InteractionModal() {
    const { showModal, modalContent, closeModal } = useGameStore();

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
    const currentZoneData = modalContent
        ? PORTFOLIO_ZONES.find((z) => z.title === modalContent.title)
        : null;

    return (
        <AnimatePresence>
            {showModal && modalContent && (
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
                                        <h2 className="text-2xl font-bold">{modalContent.title}</h2>
                                        <p className="text-white/80">{modalContent.description}</p>
                                    </div>
                                </div>
                            </div>

                            {/* 콘텐츠 */}
                            <div className="p-6">
                                {currentZoneData && (
                                    <ul className="space-y-3">
                                        {currentZoneData.content.items.map((item, index) => (
                                            <motion.li
                                                key={index}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="flex items-center gap-3 text-white/90"
                                            >
                                                <span
                                                    className="w-2 h-2 rounded-full"
                                                    style={{ backgroundColor: currentZoneData.color }}
                                                />
                                                {item}
                                            </motion.li>
                                        ))}
                                    </ul>
                                )}

                                {/* 링크 버튼들 */}
                                {currentZoneData?.content.links && (
                                    <div className="mt-6 flex gap-3">
                                        {currentZoneData.content.links.map((link, index) => (
                                            <a
                                                key={index}
                                                href={link.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-4 py-2 rounded-lg text-white font-medium transition-transform hover:scale-105"
                                                style={{ backgroundColor: currentZoneData.color }}
                                            >
                                                {link.label}
                                            </a>
                                        ))}
                                    </div>
                                )}
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
