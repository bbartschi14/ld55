import { CollisionGroup } from "@/constants/collisions";
import { GroupProps } from "@react-three/fiber";
import {
  BallCollider,
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
        collisionGroups={interactionGroups(CollisionGroup.House)}
      >
        <mesh position={[0, 0.5, 0]}>
          <CuboidCollider args={[0.5, 0.5, 0.5]} />
          <boxGeometry args={[1, 1, 1]} />
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
        <BallCollider args={[1.25]} />
      </RigidBody>
    </group>
  );
};

export default House;
