import { actions, gameStore } from "@/stores/gameStore";
import { useFrame } from "@react-three/fiber";

const TimeManager = () => {
  useFrame((_state, delta) => {
    const state = gameStore.getState().characterState;
    if (state !== "finished") {
      actions.addTime(delta);
    }
  });
  return null;
};

export default TimeManager;
