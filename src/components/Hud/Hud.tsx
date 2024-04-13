import { useGameStore } from "@/store/gameStore";
import * as classes from "./Hud.css";
import { Text } from "@mantine/core";

/**
 * Root HUD
 */
export const Hud = () => {
  const score = useGameStore((state) => state.score);
  const hitCount = useGameStore((state) => state.hitCount);
  return (
    <div className={classes.root}>
      <div className={classes.score}>
        <Text fz="3rem">{score}</Text>
        <Text fz="3rem">{hitCount}</Text>
      </div>
    </div>
  );
};
