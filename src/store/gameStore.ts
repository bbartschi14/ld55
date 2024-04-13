import { createStore, useStore } from "zustand";
import { immer } from "zustand/middleware/immer";
import { v4 as uuid } from "uuid";
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
}

export const MAP_SIZE = [50, 50] as [number, number];

const NUM_BATS = 40;
const BAT_PADDING = 3;

const getPointInBounds = () => {
  const width = MAP_SIZE[0] - BAT_PADDING;
  const height = MAP_SIZE[1] - BAT_PADDING;
  return [
    Math.random() * width - width / 2,
    Math.random() * height - height / 2,
  ] as [number, number];
};

const pointHouseIntersection = (
  point: [number, number],
  house: [number, number]
) => {
  const distance = Math.sqrt(
    Math.pow(point[0] - house[0], 2) + Math.pow(point[1] - house[1], 2)
  );

  return distance < 1;
};

const generateBatSpawnPoints = (
  houses: {
    position: [number, number, number];
  }[]
) => {
  const points = [];
  for (let i = 0; i < NUM_BATS; i++) {
    let tries = 0;
    let point = getPointInBounds();
    while (
      houses.some((house) =>
        pointHouseIntersection(point, [house.position[0], house.position[2]])
      ) &&
      tries < 5
    ) {
      point = getPointInBounds();
      tries++;
    }
    points.push(point);
  }
  return points;
};

const initialHouses: {
  position: [number, number, number];
}[] = [
  { position: [0, 0, 0] },
  { position: [15, 0, 0] },
  { position: [0, 0, 15] },
  { position: [-15, 0, 0] },
  { position: [0, 0, -15] },
];

export const gameStore = createStore<GameState & { actions: GameActions }>()(
  immer((set, get) => ({
    score: 0,
    hitCount: 0,
    bats: generateBatSpawnPoints(initialHouses).map((p) => ({
      id: uuid(),
      spawnPoint: p,
    })),
    currentHouse: 0,
    houses: initialHouses,
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
