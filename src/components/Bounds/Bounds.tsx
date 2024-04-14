import BoundsWall from "@/components/Bounds/BoundsWall";
import { LEVELS } from "@/levels/level";
import { useGameStore } from "@/stores/gameStore";

const Bounds = () => {
  const currentLevel = useGameStore((state) => state.currentLevel);

  if (currentLevel !== null && LEVELS[currentLevel] !== undefined) {
    const boundsData = LEVELS[currentLevel].bounds;

    return (
      <>
        <BoundsWall
          x={0}
          z={-boundsData.top[2]}
          width={2000}
          height={5}
          depth={1}
        />
        <BoundsWall
          x={0}
          z={-boundsData.bottom[2]}
          width={2000}
          height={5}
          depth={1}
        />
      </>
    );
  }

  return null;
};

export default Bounds;
