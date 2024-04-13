import { CollisionGroup } from "@/constants/collisions";
import {
  RapierRigidBody,
  RigidBody,
  interactionGroups,
} from "@react-three/rapier";
import { useRef } from "react";
import { Vector3 } from "three";

const randomVectorOnUnitCircle = () => {
  const angle = Math.random() * Math.PI * 2;
  return [Math.cos(angle), Math.sin(angle)];
};

const createRandomVector3 = () => {
  const [x, z] = randomVectorOnUnitCircle();
  return new Vector3(x, 0, z);
};

const _up = new Vector3(0, 1, 0);

const Bat = (props: { position: [number, number, number] }) => {
  const rigidBody = useRef<RapierRigidBody>(null);
  const wanderDirection = useRef(createRandomVector3());
  // const wanderDirection = useRef(new Vector3(1, 0, 0));
  const speed = useRef(5);

  return (
    <RigidBody
      position={props.position}
      linearVelocity={[
        wanderDirection.current.x * speed.current,
        wanderDirection.current.y * speed.current,
        wanderDirection.current.z * speed.current,
      ]}
      onCollisionEnter={({ manifold, rigidBodyObject }) => {
        const name = rigidBodyObject?.name ?? "";
        if (["house", "bounds"].includes(name) && rigidBody.current) {
          wanderDirection.current.copy(manifold.normal());

          // Random angle from -π/4 to π/4
          const randomAngle = ((Math.random() - 0.5) * Math.PI) / 2;
          wanderDirection.current.applyAxisAngle(_up, randomAngle);

          wanderDirection.current.multiplyScalar(speed.current);
          rigidBody.current.setLinvel(wanderDirection.current, true);
        }
      }}
      collisionGroups={interactionGroups(CollisionGroup.Bat, [
        CollisionGroup.House,
        CollisionGroup.Bounds,
      ])}
      lockRotations
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
