import { CollisionGroup } from "@/constants/collisions";
import { GROUND_LEVEL } from "@/constants/ground";
import { actions } from "@/stores/gameStore";
import { useTexture } from "@react-three/drei";
import {
  RapierRigidBody,
  RigidBody,
  interactionGroups,
  useBeforePhysicsStep,
} from "@react-three/rapier";
import { useRef } from "react";
import { Vector3 } from "three";

const Bat = (props: {
  position: [number, number, number];
  id: string;
  flip: boolean;
}) => {
  const shadowOffset = useRef(Math.random() * 0.01);
  const texture = useTexture("/Shadow.png");
  const rigidBody = useRef<RapierRigidBody>(null);
  const wanderDirection = useRef(new Vector3(0, 0, props.flip ? -1 : 1));
  const speed = useRef(5);

  useBeforePhysicsStep(() => {
    if (rigidBody.current) {
      rigidBody.current.setLinvel(
        {
          x: wanderDirection.current.x * speed.current,
          y: wanderDirection.current.y * speed.current,
          z: wanderDirection.current.z * speed.current,
        },
        true
      );
    }
  });

  return (
    <RigidBody
      position={props.position}
      colliders="ball"
      linearVelocity={[
        wanderDirection.current.x * speed.current,
        wanderDirection.current.y * speed.current,
        wanderDirection.current.z * speed.current,
      ]}
      onCollisionEnter={({ manifold, rigidBodyObject }) => {
        const name = rigidBodyObject?.name ?? "";
        if (["bounds"].includes(name) && rigidBody.current) {
          // Flip direction
          wanderDirection.current.copy(manifold.normal());
        } else if (name === "character") {
          actions.hitBat(props.id);
        }
      }}
      collisionGroups={interactionGroups(CollisionGroup.Bat, [
        CollisionGroup.Bounds,
        CollisionGroup.Character,
      ])}
      lockRotations
      name="bat"
      ref={rigidBody}
    >
      <group scale={0.5} position={[0, 1.5, 0]}>
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#696969" />
        </mesh>
      </group>
      <mesh
        position={[0, GROUND_LEVEL + shadowOffset.current, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[1.5, 1.5]} />
        <meshBasicMaterial
          color={"#000000"}
          transparent
          opacity={0.1}
          map={texture}
        />
      </mesh>
    </RigidBody>
  );
};

export default Bat;
