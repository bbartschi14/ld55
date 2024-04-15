import * as classes from "./Hud.css";
import Timer from "@/components/Timer/Timer";
import LevelCompleteModal from "@/components/LevelCompleteModal/LevelCompleteModal";
import Countdown from "@/components/Countdown/Countdown";
import { Text } from "@mantine/core";
import { useGameStore } from "@/stores/gameStore";

/**
 * Root HUD
 */
export const Hud = () => {
  const currentLevel = useGameStore((state) => state.currentLevel);
  return (
    <>
      <div className={classes.root}>
        <div className={classes.score}>
          <Timer />
          <Text
            fz="3rem"
            c="white"
            pl="md"
            fw="500"
            lts={"2px"}
            style={{ textShadow: "2px 2px 4px #00000065" }}
          >
            {`Level ${currentLevel !== null ? currentLevel + 1 : 0}`}
          </Text>
        </div>
        <Countdown />
      </div>
      <LevelCompleteModal />
    </>
  );
};
