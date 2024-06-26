import { createStore, useStore } from "zustand";
import { immer } from "zustand/middleware/immer";
import { v4 as uuid } from "uuid";
import { Object3D } from "three";
import { LEVELS, LevelData } from "@/levels/level";
import { SOUNDS } from "@/components/AudioManager/sounds";

export interface GameActions {
  reachGoal: () => void;
  hitBat: (id: string) => void;
  addTime: (time: number) => void;
  setLevel: (level: LevelData) => void;
  resetLevel: () => void;
  nextLevel: () => void;
}

export interface GameState {
  runId: string;
  currentLevel: number | null;
  score: number;
  levelTime: number;
  bats: {
    id: string;
    spawnPoint: [number, number];
    flip?: boolean;
  }[];
  currentGoal: number | null;
  goals: {
    position: [number, number, number];
  }[];
  trees: {
    position: [number, number, number];
  }[];
  spawnPoint: [number, number, number];
  characterState: "wait" | "default" | "hit" | "finished";
}

export interface GameReferences {
  character: Object3D | null;
}

const initialGameState: GameState = {
  currentLevel: null,
  runId: uuid(),
  score: 0,
  levelTime: 0,
  bats: [],
  currentGoal: 0,
  goals: [],
  trees: [],
  spawnPoint: [0, 0, 0],
  characterState: "wait",
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

        SOUNDS.ringin.play();

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

        if (Math.random() > 0.5) {
          SOUNDS.hit1.play();
        } else {
          SOUNDS.hit2.play();
        }

        set({ characterState: "hit" });
        setTimeout(() => {
          set({ characterState: "default" });
        }, 1000);
      },
      addTime: (time: number) => {
        set({ levelTime: get().levelTime + time });
      },
      resetLevel: () => {
        const level = get().currentLevel;
        const data = LEVELS[level !== null ? level : 0];

        get().actions.setLevel(data);
      },
      nextLevel: () => {
        const currentLevel = get().currentLevel;
        if (currentLevel === null) {
          return;
        }

        let nextLevel = currentLevel + 1;
        if (nextLevel >= LEVELS.length) {
          nextLevel = 0;
        }

        const data = LEVELS[nextLevel];
        get().actions.setLevel(data);
      },
      setLevel: (level: LevelData) => {
        const nextRunId = uuid();
        set({
          runId: nextRunId,
          currentLevel: level.level,
          goals: level.goals,
          trees: level.trees,
          bats: level.bats.map((bat) => ({
            id: uuid(),
            spawnPoint: [bat.position[0], bat.position[2]],
            flip: bat.flip,
          })),
          currentGoal: 0,
          score: 0,
          levelTime: 0,
          spawnPoint: level.player,
          characterState: "wait",
        });

        setTimeout(() => {
          set({ characterState: "default" });
        }, 4000);
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
