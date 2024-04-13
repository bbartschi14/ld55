import { createStore, useStore } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface GameActions {
  deliverPackage: () => void;
}

export interface GameState {
  score: number;
  currentHouse: number | null;
  houses: {
    position: [number, number, number];
  }[];
}

export const gameStore = createStore<GameState & { actions: GameActions }>()(
  immer((set, get) => ({
    score: 0,
    currentHouse: 0,
    houses: [
      { position: [0, 0, 0] },
      { position: [15, 0, 0] },
      { position: [0, 0, 15] },
      { position: [-15, 0, 0] },
    ],

    actions: {
      deliverPackage: () => {
        const houseDelivered = get().currentHouse;
        if (houseDelivered === null) {
          return;
        }
        set({ score: get().score + 1 });
        set({ currentHouse: null });

        setTimeout(() => {
          const nextHouse = (houseDelivered + 1) % get().houses.length;
          set({ currentHouse: nextHouse });
        }, 1000);
      },
    },
  }))
);

/**
 *  Wraps zustand's `useStore` with the game store context.
 */
export function useGameStore<T>(selector: (state: GameState) => T): T {
  return useStore(gameStore, selector);
}

export const actions = gameStore.getState().actions;
