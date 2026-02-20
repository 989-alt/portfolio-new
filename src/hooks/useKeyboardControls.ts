"use client";

import { useEffect, useCallback } from "react";
import { create } from "zustand";

// 키 입력 상태 타입
interface KeyboardState {
    forward: boolean;
    backward: boolean;
    left: boolean;
    right: boolean;
    jump: boolean;
    shift: boolean;
    interact: boolean;
}

interface KeyboardActions {
    setKey: (key: keyof KeyboardState, value: boolean) => void;
    reset: () => void;
}

const initialState: KeyboardState = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    jump: false,
    shift: false,
    interact: false,
};

// 키보드 상태 스토어
export const useKeyboardStore = create<KeyboardState & KeyboardActions>(
    (set) => ({
        ...initialState,
        setKey: (key, value) => set({ [key]: value }),
        reset: () => set(initialState),
    })
);

// 키 매핑 (방향키 + Space + Shift)
const keyMap: Record<string, keyof KeyboardState> = {
    ArrowUp: "forward",
    ArrowDown: "backward",
    ArrowLeft: "left",
    ArrowRight: "right",
    Space: "jump",
    ShiftLeft: "shift",
    ShiftRight: "shift",
    KeyE: "interact",
};

// 키보드 입력 훅
export function useKeyboardControls() {
    const setKey = useKeyboardStore((state) => state.setKey);

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            const key = keyMap[event.code];
            if (key) {
                event.preventDefault();
                setKey(key, true);
            }
        },
        [setKey]
    );

    const handleKeyUp = useCallback(
        (event: KeyboardEvent) => {
            const key = keyMap[event.code];
            if (key) {
                event.preventDefault();
                setKey(key, false);
            }
        },
        [setKey]
    );

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, [handleKeyDown, handleKeyUp]);

    return useKeyboardStore;
}

// 이동 방향 계산 유틸리티
export function getMovementDirection(state: KeyboardState) {
    const direction = { x: 0, z: 0 };

    if (state.forward) direction.z -= 1;
    if (state.backward) direction.z += 1;
    if (state.left) direction.x -= 1;
    if (state.right) direction.x += 1;

    // 정규화 (대각선 이동 시 속도 일정하게)
    const length = Math.sqrt(direction.x ** 2 + direction.z ** 2);
    if (length > 0) {
        direction.x /= length;
        direction.z /= length;
    }

    return direction;
}
