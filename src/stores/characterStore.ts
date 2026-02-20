import { create } from "zustand";

// 캐릭터 상태 타입
type AnimationState = "idle" | "walk" | "run" | "jump" | "falling";

interface CharacterState {
    position: [number, number, number];
    rotation: [number, number, number];
    animationState: AnimationState;
    isGrounded: boolean;
    velocity: [number, number, number];
}

interface CharacterActions {
    setPosition: (position: [number, number, number]) => void;
    setRotation: (rotation: [number, number, number]) => void;
    setAnimationState: (state: AnimationState) => void;
    setIsGrounded: (grounded: boolean) => void;
    setVelocity: (velocity: [number, number, number]) => void;
    reset: () => void;
}

const initialState: CharacterState = {
    position: [0, 2, 0],
    rotation: [0, 0, 0],
    animationState: "idle",
    isGrounded: false,
    velocity: [0, 0, 0],
};

export const useCharacterStore = create<CharacterState & CharacterActions>(
    (set) => ({
        ...initialState,

        setPosition: (position) => set({ position }),
        setRotation: (rotation) => set({ rotation }),
        setAnimationState: (animationState) => set({ animationState }),
        setIsGrounded: (isGrounded) => set({ isGrounded }),
        setVelocity: (velocity) => set({ velocity }),
        reset: () => set(initialState),
    })
);
