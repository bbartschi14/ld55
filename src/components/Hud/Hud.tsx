import { useGameStore } from "@/store/gameStore";
import * as classes from "./Hud.css";
import { Text } from "@mantine/core";
import Timer from "@/components/Timer/Timer";
import LevelCompleteModal from "@/components/LevelCompleteModal/LevelCompleteModal";

/**
 * Root HUD
 */
export const Hud = () => {
  const score = useGameStore((state) => state.score);
  const goals = useGameStore((state) => state.goals);

  return (
    <>
      <div className={classes.root}>
        <div className={classes.score}>
          <Text fz="3rem">{`${score} of ${goals.length}`}</Text>
          <Timer />
        </div>
      </div>
      <LevelCompleteModal />
    </>
  );
};
