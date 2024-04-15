import { CollisionGroup } from "@/constants/collisions";
import { GROUND_LEVEL } from "@/constants/ground";
import { useTexture } from "@react-three/drei";
import { GroupProps } from "@react-three/fiber";
import {
  CuboidCollider,
  RigidBody,
  interactionGroups,
} from "@react-three/rapier";

type GoalProps = GroupProps & { index: number; isFinal?: boolean };

const Goal = (props: GoalProps) => {
  const texture = useTexture("/Shadow.png");

  return (
    <group {...props}>
      <group scale={2.3} position={[0, 1, 0]}>
        <RigidBody
          type="fixed"
          name="goal"
          colliders={false}
          collisionGroups={interactionGroups(CollisionGroup.Goal)}
        >
          <CuboidCollider args={[0.1, 1, 0.1]} position={[0, 0.5, 1]} />
          <CuboidCollider args={[0.1, 1, 0.1]} position={[0, 0.5, -1]} />
          <mesh position={[0, 0.5, 0]} rotation={[0, Math.PI / 2, 0]}>
            <torusGeometry args={[1, 0.1, 16, 100]} />
            <meshStandardMaterial
              color={props.isFinal ? "#ffe538" : "#696969"}
              // roughness={!props.isFinal ? 0.0 : 1}
              // metalness={!props.isFinal ? 0.75 : 0}
              emissive={props.isFinal ? "#ffb108" : "#000000"}
            />
          </mesh>
        </RigidBody>
        <RigidBody
          colliders={false}
          type="fixed"
          sensor
          name={`goal-${props.index}`}
          collisionGroups={interactionGroups(CollisionGroup.Goal)}
        >
          <CuboidCollider args={[0.05, 0.8, 0.8]} position={[0, 0.5, 0]} />
        </RigidBody>
      </group>
      <mesh position={[0, GROUND_LEVEL, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[1.5, 5]} />
        <meshBasicMaterial
          color={"#000000"}
          transparent
          opacity={0.1}
          map={texture}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
};

export default Goal;
