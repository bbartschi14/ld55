import { createStore, useStore } from "zustand";
import { immer } from "zustand/middleware/immer";
import { v4 as uuid } from "uuid";
import { Object3D } from "three";

export interface GameActions {
  deliverPackage: () => void;
  hitBat: (id: string) => void;
}

export interface GameState {
  score: number;
  hitCount: number;
  bats: {
    id: string;
    spawnPoint: [number, number];
  }[];
  currentHouse: number | null;
  houses: {
    position: [number, number, number];
  }[];
  character: Object3D | null;
}

const initialHouses: {
  position: [number, number, number];
}[] = [
  { position: [15, 0, 0] },
  { position: [45, 0, -5] },
  { position: [80, 0, 5] },
  { position: [105, 0, 0] },
  { position: [140, 0, -5] },
  { position: [165, 0, 0] },
  { position: [190, 0, 5] },
];

const generateBats = (
  minX: number,
  maxX: number,
  minZ: number,
  maxZ: number,
  batCount: number
) => {
  const bats = [];
  for (let i = 0; i < batCount; i++) {
    bats.push({
      id: uuid(),
      spawnPoint: [
        Math.random() * (maxX - minX) + minX,
        Math.random() * (maxZ - minZ) + minZ,
      ] as [number, number],
    });
  }
  return bats;
};

export const gameStore = createStore<GameState & { actions: GameActions }>()(
  immer((set, get) => ({
    score: 0,
    hitCount: 0,
    bats: generateBats(-5, 190, -10, 10, 100),
    currentHouse: 0,
    houses: initialHouses,
    character: null,
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
        }, 0);
      },
      hitBat: (id: string) => {
        set({ hitCount: get().hitCount + 1 });

        // Remove bat
        set(({ bats }) => {
          const index = bats.findIndex((bat) => bat.id === id);
          bats.splice(index, 1);
        });
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
