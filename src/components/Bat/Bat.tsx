import { CollisionGroup } from "@/constants/collisions";
import { GROUND_LEVEL } from "@/constants/ground";
import { actions } from "@/stores/gameStore";
import { useGLTF, useTexture } from "@react-three/drei";
import {
  BallCollider,
  RapierRigidBody,
  RigidBody,
  interactionGroups,
  useBeforePhysicsStep,
} from "@react-three/rapier";
import { useRef } from "react";
import { BufferGeometry, Vector3 } from "three";

const _newDirection = new Vector3();

const Bat = (props: {
  position: [number, number, number];
  id: string;
  flip: boolean;
}) => {
  const { nodes } = useGLTF("/bat.glb");
  const bat = nodes.Bat as unknown as { geometry: BufferGeometry };
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
      colliders={false}
      linearVelocity={[
        wanderDirection.current.x * speed.current,
        wanderDirection.current.y * speed.current,
        wanderDirection.current.z * speed.current,
      ]}
      onCollisionEnter={({ rigidBodyObject }) => {
        const name = rigidBodyObject?.name ?? "";
        if (["bounds", "tree"].includes(name) && rigidBody.current) {
          // Flip direction
          _newDirection.copy(wanderDirection.current).negate();
          wanderDirection.current.copy(_newDirection);
        } else if (name === "character") {
          actions.hitBat(props.id);
        }
      }}
      collisionGroups={interactionGroups(CollisionGroup.Bat, [
        CollisionGroup.Bounds,
        CollisionGroup.Character,
        CollisionGroup.Tree,
      ])}
      lockRotations
      name="bat"
      ref={rigidBody}
    >
      <group scale={0.5} position={[0, 1.5, 0]}>
        <BallCollider args={[0.5]} position={[0, 1.5, 0]} />
        <mesh geometry={bat.geometry} rotation={[0, Math.PI / 2, 0]}>
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
          depthWrite={false}
        />
      </mesh>
    </RigidBody>
  );
};

export default Bat;
