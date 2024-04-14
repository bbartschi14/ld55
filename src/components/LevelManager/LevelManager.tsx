import { LEVELS } from "@/levels/level";
import { actions, useGameStore } from "@/stores/gameStore";
import { PropsWithChildren, useEffect } from "react";

const LevelManager = (props: PropsWithChildren) => {
  const level = useGameStore((state) => state.currentLevel);

  useEffect(() => {
    if (level === null) {
      // Init first level
      actions.setLevel(LEVELS[0]);
    }
  }, [level]);

  if (level === null) {
    return null;
  }

  return props.children;
};

export default LevelManager;
