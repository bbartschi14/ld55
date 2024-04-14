import { createStore, useStore } from "zustand";
import { immer } from "zustand/middleware/immer";
import { v4 as uuid } from "uuid";
import { Object3D } from "three";

export interface GameActions {
  reachGoal: () => void;
  hitBat: (id: string) => void;
  addTime: (time: number) => void;
  reset: () => void;
}

export interface GameState {
  runId: string;
  score: number;
  levelTime: number;
  bats: {
    id: string;
    spawnPoint: [number, number];
  }[];
  currentGoal: number | null;
  goals: {
    position: [number, number, number];
  }[];
  characterState: "default" | "hit" | "finished";
}

export interface GameReferences {
  character: Object3D | null;
}

const initialGoals: {
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

const initialGameState: GameState = {
  runId: uuid(),
  score: 0,
  levelTime: 0,
  bats: generateBats(5, 190, -10, 10, 50),
  currentGoal: 0,
  goals: initialGoals,
  characterState: "default",
};

export const gameStore = createStore<
  GameState & { references: GameReferences } & { actions: GameActions }
>()(
  immer((set, get) => ({
    ...initialGameState,
    references: { character: null },
    actions: {
      reachGoal: () => {
        const goalReached = get().currentGoal;
        if (goalReached === null) {
          return;
        }

        set({ score: get().score + 1 });
        const nextGoal = goalReached + 1;

        if (nextGoal >= get().goals.length) {
          set({ characterState: "finished", currentGoal: null });
          return;
        } else {
          set({ currentGoal: nextGoal });
        }
      },
      hitBat: (id: string) => {
        // Remove bat
        set(({ bats }) => {
          const index = bats.findIndex((bat) => bat.id === id);
          bats.splice(index, 1);
        });

        set({ characterState: "hit" });
        setTimeout(() => {
          set({ characterState: "default" });
        }, 1000);
      },
      addTime: (time: number) => {
        set({ levelTime: get().levelTime + time });
      },
      reset: () => {
        const nextRunId = uuid();
        set({ ...initialGameState, runId: nextRunId });
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
