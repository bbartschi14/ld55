import { CollisionGroup } from "@/constants/collisions";
import { GroupProps } from "@react-three/fiber";
import {
  CuboidCollider,
  RigidBody,
  interactionGroups,
} from "@react-three/rapier";

type HouseProps = GroupProps & { index: number };

const House = (props: HouseProps) => {
  return (
    <group scale={[2, 2, 2]} {...props}>
      <RigidBody
        type="fixed"
        name="house"
        colliders={false}
        collisionGroups={interactionGroups(CollisionGroup.House)}
      >
        <CuboidCollider args={[0.1, 1, 0.1]} position={[0, 0.5, 1]} />
        <CuboidCollider args={[0.1, 1, 0.1]} position={[0, 0.5, -1]} />
        <mesh position={[0, 0.5, 0]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[1, 0.1, 16, 100]} />
          <meshStandardMaterial color="#696969" />
        </mesh>
      </RigidBody>
      <RigidBody
        colliders={false}
        type="fixed"
        sensor
        name={`house-${props.index}`}
        collisionGroups={interactionGroups(CollisionGroup.House)}
      >
        <CuboidCollider args={[0.05, 0.8, 0.8]} position={[0, 0.5, 0]} />
      </RigidBody>
    </group>
  );
};

export default House;
