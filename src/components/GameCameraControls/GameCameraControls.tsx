import { gameStore } from "@/store/gameStore";
import { CameraControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Vector3 } from "three";
import { degToRad, lerp } from "three/src/math/MathUtils.js";

const CAMERA_POLAR_ANGLE = degToRad(40);
const CAMERA_AZIMUTH_ANGLE = degToRad(0);
const CAMERA_DISTANCE = 60;

const _target = new Vector3();
const _forward = new Vector3();

const GameCameraControls = () => {
  const polarTarget = useRef(CAMERA_POLAR_ANGLE);

  const ref = useRef<CameraControls>(null!);
  useFrame((state, delta) => {
    const character = gameStore.getState().character;

    if (character) {
      character.getWorldPosition(_target);
      ref.current.moveTo(_target.x, _target.y, _target.z, true);

      character.getWorldDirection(_forward);
      // const radians = Math.atan2(_forward.x, _forward.z);

      // polarTarget.current = lerp(polarTarget.current, radians, 1 * delta);
      // ref.current.rotateAzimuthTo(polarTarget.current);
    }
  });

  return (
    <CameraControls
      ref={ref}
      polarAngle={CAMERA_POLAR_ANGLE}
      distance={CAMERA_DISTANCE}
      maxDistance={CAMERA_DISTANCE + 25}
      azimuthAngle={CAMERA_AZIMUTH_ANGLE}
      smoothTime={1}
      polarRotateSpeed={0.1}
    />
  );
};

export default GameCameraControls;
