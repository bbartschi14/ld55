import { CollisionGroup } from "@/constants/collisions";
import { CONTROLS } from "@/constants/controls";
import { actions, gameStore, useGameStore } from "@/store/gameStore";
import { animated, useSpring } from "@react-spring/three";
import { useKeyboardControls } from "@react-three/drei";
import {
  CuboidCollider,
  RapierRigidBody,
  RigidBody,
  interactionGroups,
  useBeforePhysicsStep,
} from "@react-three/rapier";
import { useRef } from "react";
import { Group, Matrix4, Quaternion, Vector3 } from "three";
import { clamp } from "three/src/math/MathUtils.js";

const _position = new Vector3();
const _direction = new Vector3();
const _left = new Vector3();
const _up = new Vector3(0, 1, 0);
const _rotationQuat = new Quaternion();
const _rotation = new Matrix4();

const Character = () => {
  const rigidBody = useRef<RapierRigidBody>(null);
  const tractorBeam = useRef<Group>(null!);

  const horizontalVelocity = useRef(0);
  const currentHouse = useGameStore((state) => state.currentHouse);

  const tractorBeamSpring = useSpring({
    opacity: currentHouse === null ? 0 : 1,
  });

  const leftPressed = useKeyboardControls((state) => state[CONTROLS.left]);
  const rightPressed = useKeyboardControls((state) => state[CONTROLS.right]);

  useBeforePhysicsStep(() => {
    if (rigidBody.current && currentHouse !== null) {
      // Reset forces
      rigidBody.current.resetForces(true);
      rigidBody.current.setLinvel({ x: 0, y: 0, z: 0 }, true);

      // Calculate vectors
      const currentHousePosition =
        gameStore.getState().houses[currentHouse].position;
      const position = rigidBody.current.translation();
      _position.set(position.x, position.y, position.z);
      _direction
        .set(
          currentHousePosition[0] - position.x,
          currentHousePosition[1] - position.y,
          currentHousePosition[2] - position.z
        )
        .normalize();
      _left.copy(_up).cross(_direction).normalize();

      // Set tractor beam force
      rigidBody.current.addForce(_direction.multiplyScalar(300), true);

      // Calculate and apply horizontal movement
      const maxHorizontalVelocity = 500;
      const horizontalAcceleration = 50;
      if (leftPressed) {
        horizontalVelocity.current += horizontalAcceleration;
      } else if (rightPressed) {
        horizontalVelocity.current -= horizontalAcceleration;
      } else {
        // Slow down
        horizontalVelocity.current *= 0.99;
      }

      horizontalVelocity.current = clamp(
        horizontalVelocity.current,
        -maxHorizontalVelocity,
        maxHorizontalVelocity
      );

      rigidBody.current.addForce(
        _left.multiplyScalar(horizontalVelocity.current),
        true
      );

      // Face towards the target
      _rotation.lookAt(_position, _direction, _up);
      _rotationQuat.setFromRotationMatrix(_rotation);
      rigidBody.current.setRotation(_rotationQuat, true);

      // Set tractor beam scale
      const distance = _position.distanceTo(
        new Vector3(
          currentHousePosition[0],
          currentHousePosition[1],
          currentHousePosition[2]
        )
      );

      if (tractorBeam.current) {
        tractorBeam.current.scale.z = distance;
      }
    }
  });

  return (
    <RigidBody
      ref={rigidBody}
      colliders={false}
      lockRotations
      name="character"
      onIntersectionEnter={(p) => {
        if (p.rigidBodyObject?.name === `house-${currentHouse}`) {
          rigidBody.current?.resetForces(true);
          rigidBody.current?.setLinvel({ x: 0, y: 0, z: 0 }, true);
          horizontalVelocity.current = 0;

          actions.deliverPackage();
        }
      }}
      position={[20, 0, 20]}
    >
      <group>
        <mesh position={[0, 1, 0]}>
          <CuboidCollider
            args={[0.5, 0.5, 0.5]}
            collisionGroups={interactionGroups(CollisionGroup.Character)}
          />

          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#c33ade" />
          <group ref={tractorBeam}>
            <mesh position={[0, 0, -0.5]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.1, 0.1, 1]} />
              <animated.meshStandardMaterial
                color="#c33ade"
                transparent
                opacity={tractorBeamSpring.opacity}
              />
            </mesh>
          </group>
        </mesh>
      </group>
    </RigidBody>
  );
};

export default Character;
