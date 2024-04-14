import { CollisionGroup } from "@/constants/collisions";
import { CONTROLS } from "@/constants/controls";
import { GROUND_LEVEL } from "@/constants/ground";
import { actions, gameStore, useGameStore } from "@/stores/gameStore";
import { animated, useSpring } from "@react-spring/three";
import { useGLTF, useKeyboardControls, useTexture } from "@react-three/drei";
import {
  CuboidCollider,
  RapierCollider,
  RapierRigidBody,
  RigidBody,
  interactionGroups,
  useBeforePhysicsStep,
} from "@react-three/rapier";
import { useEffect, useRef } from "react";
import {
  BufferGeometry,
  Group,
  Matrix4,
  MeshBasicMaterial,
  Quaternion,
  Vector3,
} from "three";
import { clamp } from "three/src/math/MathUtils.js";
import vertexShader from "@/shaders/beam/vertex.glsl";
import fragmentShader from "@/shaders/beam/fragment.glsl";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";

const BeamMaterial = new CustomShaderMaterial({
  vertexShader,
  fragmentShader,
  baseMaterial: MeshBasicMaterial,
  uniforms: {
    uTime: { value: 0 },
    uLength: { value: 1 },
  },
  opacity: 0.5,
  transparent: true,
});

const _position = new Vector3();
const _targetPosition = new Vector3();
const _direction = new Vector3();
const _left = new Vector3();
const _up = new Vector3(0, 1, 0);
const _prevQuat = new Quaternion();
const _rotationQuat = new Quaternion();
const _rotation = new Matrix4();

const Character = () => {
  const { nodes } = useGLTF("/broom.glb");
  const broom = nodes.Broom as unknown as { geometry: BufferGeometry };
  const bristles = nodes.Bristles as unknown as { geometry: BufferGeometry };
  const character = nodes.Character as unknown as { geometry: BufferGeometry };

  const { nodes: hatNodes } = useGLTF("/hat.glb");
  const hat = hatNodes.Hat as unknown as { geometry: BufferGeometry };
  const hatBand = hatNodes.HatBand as unknown as { geometry: BufferGeometry };
  const hatBuckle = hatNodes.HatBuckle as unknown as {
    geometry: BufferGeometry;
  };

  const texture = useTexture("/Shadow.png");
  const rigidBody = useRef<RapierRigidBody>(null);
  const characterCollider = useRef<RapierCollider>(null);
  const tractorBeam = useRef<Group>(null);

  const impulseVelocity = useRef(0);
  const horizontalVelocity = useRef(0);
  const forwardVelocity = useRef(0);

  const currentGoal = useGameStore((state) => state.currentGoal);
  const characterState = useGameStore((state) => state.characterState);
  const spawnPoint = useGameStore((state) => state.spawnPoint);

  const [, tractorBeamSpringApi] = useSpring(() => ({
    opacity: 0.5,
    onChange: (props) => {
      BeamMaterial.opacity = props.value.opacity;
    },
  }));

  const [opacitySpring, opacitySpringApi] = useSpring(() => ({
    opacity: 1,
    loop: { reverse: true },
    immediate: false,
  }));

  const forwardPressed = useKeyboardControls(
    (state) => state[CONTROLS.forward]
  );
  const backPressed = useKeyboardControls((state) => state[CONTROLS.back]);
  const leftPressed = useKeyboardControls((state) => state[CONTROLS.left]);
  const rightPressed = useKeyboardControls((state) => state[CONTROLS.right]);

  const rotationSpring = useSpring({
    rotation: [
      forwardPressed ? -Math.PI / 8 : backPressed ? Math.PI / 8 : 0,
      0,
      leftPressed ? Math.PI / 4 : rightPressed ? -Math.PI / 4 : 0,
    ],
  });

  useEffect(() => {
    if (characterState === "hit") {
      opacitySpringApi.start({
        from: { opacity: 1 },
        to: { opacity: 0.75 },
        loop: { reverse: true },
        config: { duration: 150 },
      });
    } else {
      opacitySpringApi.stop();
      opacitySpringApi.start({ opacity: 1 });
    }

    if (characterState === "finished") {
      rigidBody.current?.setLinearDamping(1);
      rigidBody.current?.applyImpulse(
        {
          x: 10,
          y: 0,
          z: 0,
        },
        true
      );
    }

    characterCollider.current?.setEnabled(characterState === "default");
  }, [characterState, characterCollider, opacitySpringApi]);

  useBeforePhysicsStep(() => {
    if (
      rigidBody.current &&
      currentGoal !== null &&
      characterState !== "wait"
    ) {
      // Reset forces
      rigidBody.current.resetForces(true);
      rigidBody.current.setLinvel({ x: 0, y: 0, z: 0 }, true);

      if (characterState === "hit") {
        forwardVelocity.current = 0;
        horizontalVelocity.current = 0;
        impulseVelocity.current = 0;
        return;
      }

      // Calculate vectors
      const currentGoalPosition =
        gameStore.getState().goals[currentGoal].position;
      const position = rigidBody.current.translation();
      _position.set(position.x, position.y, position.z);
      _targetPosition.set(
        currentGoalPosition[0],
        currentGoalPosition[1],
        currentGoalPosition[2]
      );
      _direction
        .set(
          currentGoalPosition[0] - position.x,
          currentGoalPosition[1] - position.y,
          currentGoalPosition[2] - position.z
        )
        .normalize();
      _left.copy(_up).cross(_direction).normalize();

      // Set tractor beam force
      const maxForwardVelocity = 400;
      const maxBackwardVelocity = -200;
      const forwardAcceleration = 25;
      const baseSpeed = 400;
      if (forwardPressed) {
        forwardVelocity.current += forwardAcceleration;
      } else if (backPressed) {
        forwardVelocity.current -= forwardAcceleration;
      } else {
        // Slow down
        forwardVelocity.current *= 0.95;
      }

      impulseVelocity.current *= 0.95;

      forwardVelocity.current = clamp(
        forwardVelocity.current,
        maxBackwardVelocity,
        maxForwardVelocity
      );

      // Calculate horizontal movement
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

      // Apply forces
      rigidBody.current.addForce(
        _direction.multiplyScalar(
          baseSpeed + forwardVelocity.current + impulseVelocity.current
        ),
        true
      );
      rigidBody.current.addForce(
        _left.multiplyScalar(horizontalVelocity.current),
        true
      );

      // Face towards the target
      _rotation.lookAt(_position, _targetPosition, _up);
      _rotationQuat.setFromRotationMatrix(_rotation);

      _prevQuat.copy(rigidBody.current.rotation());
      rigidBody.current.setRotation(_prevQuat.slerp(_rotationQuat, 0.1), true);

      // Set tractor beam scale
      const distance = _position.distanceTo(
        new Vector3(
          currentGoalPosition[0],
          currentGoalPosition[1],
          currentGoalPosition[2]
        )
      );

      if (tractorBeam.current) {
        tractorBeam.current.scale.z = distance;
        BeamMaterial.uniforms.uLength.value = distance;
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
        if (p.rigidBodyObject?.name === `goal-${currentGoal}`) {
          rigidBody.current?.resetForces(true);
          rigidBody.current?.setLinvel({ x: 0, y: 0, z: 0 }, true);
          horizontalVelocity.current = 0;

          actions.reachGoal();

          impulseVelocity.current = 700;
          tractorBeamSpringApi.start({
            from: { opacity: 0 },
            to: [{ opacity: 0.5 }],
            config: { duration: 500 },
          });
        }
      }}
      position={spawnPoint}
      rotation={[0, -Math.PI / 2, 0]}
    >
      <group>
        <group position={[0, 1, 0]}>
          <CuboidCollider
            ref={characterCollider}
            args={[0.35, 0.5, 1.5]}
            collisionGroups={interactionGroups(CollisionGroup.Character)}
            mass={1}
          />
          <animated.mesh
            ref={(ref) => {
              if (ref)
                gameStore.setState(({ references }) => {
                  references.character = ref;
                });
            }}
            rotation={
              rotationSpring.rotation as unknown as [number, number, number]
            }
            geometry={broom.geometry}
          >
            <animated.meshStandardMaterial
              color="#c68426"
              transparent
              opacity={opacitySpring.opacity}
            />
            <mesh geometry={bristles.geometry}>
              <animated.meshStandardMaterial
                color="#f4b55b"
                transparent
                opacity={opacitySpring.opacity}
              />
            </mesh>
            <mesh geometry={character.geometry}>
              <animated.meshStandardMaterial
                color="#ffffff"
                transparent
                opacity={opacitySpring.opacity}
              />
              <mesh
                geometry={hat.geometry}
                position={[0, 0.85, 0]}
                rotation={[0, Math.PI / 3, 0]}
                scale={1.2}
              >
                <animated.meshStandardMaterial
                  color="#000000"
                  transparent
                  opacity={opacitySpring.opacity}
                />
                <mesh geometry={hatBand.geometry}>
                  <animated.meshStandardMaterial
                    color="#c33ade"
                    transparent
                    opacity={opacitySpring.opacity}
                  />
                  <mesh geometry={hatBuckle.geometry}>
                    <animated.meshStandardMaterial
                      color="#ffe607"
                      transparent
                      opacity={opacitySpring.opacity}
                    />
                  </mesh>
                </mesh>
              </mesh>
            </mesh>
          </animated.mesh>
          <group ref={tractorBeam}>
            <mesh
              position={[0, 0, -0.5]}
              rotation={[Math.PI / 2, 0, 0]}
              visible={characterState !== "wait"}
            >
              <cylinderGeometry args={[0.1, 0.1, 1]} />
              <primitive object={BeamMaterial} />
            </mesh>
          </group>
        </group>
        <mesh
          position={[0, GROUND_LEVEL + 0.1, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <planeGeometry args={[2, 2]} />
          <meshBasicMaterial
            color={"#000000"}
            transparent
            opacity={0.1}
            map={texture}
          />
        </mesh>
      </group>
    </RigidBody>
  );
};

export default Character;
