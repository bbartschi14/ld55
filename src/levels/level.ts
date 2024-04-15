import level_1 from "@/levels/level_1";
import level_2 from "@/levels/level_2";
import level_3 from "@/levels/level_3";

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
  trees: {
    position: [number, number, number];
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
    trees: level.trees.map((tree) => ({
      position: [tree.position[1], 0, tree.position[0]],
    })),
  };
};

export const LEVELS = [level_1, level_2, level_3].map(convertLevelCoordinates);
