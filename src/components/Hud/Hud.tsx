import { useGameStore } from "@/store/gameStore";
import * as classes from "./Hud.css";
import { Text } from "@mantine/core";

/**
 * Root HUD
 */
export const Hud = () => {
  const score = useGameStore((state) => state.score);

  return (
    <div className={classes.root}>
      <div className={classes.score}>
        <Text fz="3rem">{score}</Text>
      </div>
    </div>
  );
};
