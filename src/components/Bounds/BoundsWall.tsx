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
      position={[x, 0, z]}
      collisionGroups={interactionGroups(CollisionGroup.Bounds)}
      name="bounds"
      type="fixed"
    >
      <group scale={[width, height * 2, depth]} position={[0, 0, 0]}>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial visible={false} color="#696969" />
        </mesh>
      </group>
    </RigidBody>
  );
};

export default BoundsWall;
