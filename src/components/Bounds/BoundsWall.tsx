import { CollisionGroup } from "@/constants/collisions";
import { RigidBody, interactionGroups } from "@react-three/rapier";

type BoundsWallProps = {
  x: number;
  z: number;
  width: number;
  height: number;
  depth: number;
};

const BoundsWall = ({ x, z, width, height, depth }: BoundsWallProps) => {
  return (
    <RigidBody
      position={[x + width / 2, height / 2, z + depth / 2]}
      collisionGroups={interactionGroups(CollisionGroup.Bounds)}
      name="bounds"
      type="fixed"
    >
      <group scale={[width, height, depth]} position={[0, 0, 0]}>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#696969" />
        </mesh>
      </group>
    </RigidBody>
  );
};

export default BoundsWall;
