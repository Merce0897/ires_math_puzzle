import { create } from "zustand";

export const useMathStore = create((set) => ({
    current: null,
    setCurrent: (math) => set(() => {
        return ({ current: math })
    }),
    correct: [],
    setCorrect: (math) => set((state) => {
        return ({ correct: [...state.correct, math] })
    }),
    resetCorrect: () => set(() => {
        return ({ correct: [] })
    })
}))