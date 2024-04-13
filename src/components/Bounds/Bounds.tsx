import BoundsWall from "@/components/Bounds/BoundsWall";

const thickness = 2;
const Bounds = (props: { bounds: [number, number] }) => {
  return (
    <>
      <BoundsWall
        x={props.bounds[0] / 2}
        z={-props.bounds[1] / 2}
        width={thickness}
        height={thickness}
        depth={props.bounds[0]}
      />
      <BoundsWall
        x={-props.bounds[0] / 2}
        z={-props.bounds[1] / 2}
        width={thickness}
        height={thickness}
        depth={props.bounds[0]}
      />
      <BoundsWall
        x={-props.bounds[0] / 2}
        z={props.bounds[1] / 2}
        width={props.bounds[1]}
        height={thickness}
        depth={thickness}
      />
      <BoundsWall
        x={-props.bounds[0] / 2}
        z={-props.bounds[1] / 2}
        width={props.bounds[1]}
        height={thickness}
        depth={thickness}
      />
    </>
  );
};

export default Bounds;
