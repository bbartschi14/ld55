import level_1 from "@/levels/level_1";

export type LevelData = {
  level: number;
  bounds: {
    bottom: [number, number, number];
    top: [number, number, number];
  };
  player: [number, number, number];
  goals: {
    position: [number, number, number];
  }[];
  bats: {
    position: [number, number, number];
    flip: boolean;
  }[];
};

const convertLevelCoordinates = (
  level: Omit<LevelData, "level">,
  index: number
): LevelData => {
  return {
    ...level,
    level: index,
    bounds: {
      bottom: [level.bounds.bottom[1], 0, level.bounds.bottom[0]],
      top: [level.bounds.top[1], 0, level.bounds.top[0]],
    },
    player: [level.player[1], 0, level.player[0]],
    goals: level.goals.map((goal) => ({
      position: [goal.position[1], 0, goal.position[0]],
    })),
    bats: level.bats.map((bat) => ({
      ...bat,
      position: [bat.position[1], 0, bat.position[0]],
    })),
  };
};

export const LEVELS = [level_1].map(convertLevelCoordinates);
