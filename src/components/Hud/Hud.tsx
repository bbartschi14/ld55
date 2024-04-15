import * as classes from "./Hud.css";
import Timer from "@/components/Timer/Timer";
import LevelCompleteModal from "@/components/LevelCompleteModal/LevelCompleteModal";
import Countdown from "@/components/Countdown/Countdown";

/**
 * Root HUD
 */
export const Hud = () => {
  return (
    <>
      <div className={classes.root}>
        <div className={classes.score}>
          <Timer />
        </div>
        <Countdown />
      </div>
      <LevelCompleteModal />
    </>
  );
};
