import { CollisionGroup } from "@/constants/collisions";
import { actions } from "@/store/gameStore";
import {
  RapierRigidBody,
  RigidBody,
  interactionGroups,
  useBeforePhysicsStep,
} from "@react-three/rapier";
import { useRef } from "react";
import { Vector3 } from "three";

// const randomVectorOnUnitCircle = () => {
//   const angle = Math.random() * Math.PI * 2;
//   return [Math.cos(angle), Math.sin(angle)];
// };

const DIRECTIONS = [
  new Vector3(1, 0, 0),
  new Vector3(-1, 0, 0),
  new Vector3(0, 0, 1),
  new Vector3(0, 0, -1),
  // new Vector3(1, 0, 1),
  // new Vector3(-1, 0, -1),
];

const createRandomVector3 = () => {
  return new Vector3().copy(
    DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)]
  );
};

const Bat = (props: { position: [number, number, number]; id: string }) => {
  const rigidBody = useRef<RapierRigidBody>(null);
  const wanderDirection = useRef(createRandomVector3());
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
        if (["house", "bounds"].includes(name) && rigidBody.current) {
          // Flip direction
          wanderDirection.current.copy(manifold.normal());
        } else if (name === "character") {
          actions.hitBat(props.id);
        }
      }}
      collisionGroups={interactionGroups(CollisionGroup.Bat, [
        CollisionGroup.House,
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
    </RigidBody>
  );
};

export default Bat;
