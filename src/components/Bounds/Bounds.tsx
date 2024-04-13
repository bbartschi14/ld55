import BoundsWall from "@/components/Bounds/BoundsWall";

const thickness = 2;
const Bounds = () => {
  return (
    <>
      <BoundsWall
        x={-10}
        z={0}
        width={thickness}
        height={thickness}
        depth={30}
      />
      <BoundsWall
        x={200}
        z={0}
        width={thickness}
        height={thickness}
        depth={30}
      />
      <BoundsWall
        x={95}
        z={15}
        width={210}
        height={thickness}
        depth={thickness}
      />
      <BoundsWall
        x={95}
        z={-15}
        width={210}
        height={thickness}
        depth={thickness}
      />
    </>
  );
};

export default Bounds;
