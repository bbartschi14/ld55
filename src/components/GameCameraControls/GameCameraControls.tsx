import { gameStore, useGameStore } from "@/stores/gameStore";
import { CameraControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Vector3 } from "three";
import { degToRad } from "three/src/math/MathUtils.js";

const CAMERA_POLAR_ANGLE = degToRad(40);
const CAMERA_AZIMUTH_ANGLE = degToRad(0);
const CAMERA_DISTANCE = 40;

const _target = new Vector3();
const _forward = new Vector3();

const LEAD_AMOUNT = 15;
const VERTICAL_LEAD_AMOUNT = 2;

const GameCameraControls = () => {
  const ref = useRef<CameraControls>(null!);
  const spawnPoint = useGameStore((state) => state.spawnPoint);

  useEffect(() => {
    // ref.current.disconnect();

    ref.current.moveTo(
      spawnPoint[0] + LEAD_AMOUNT,
      spawnPoint[1] + 10,
      spawnPoint[2] + VERTICAL_LEAD_AMOUNT,
      false
    );
    ref.current.dollyTo(CAMERA_DISTANCE + 40, false);
    ref.current.moveTo(
      spawnPoint[0] + LEAD_AMOUNT,
      spawnPoint[1],
      spawnPoint[2] + VERTICAL_LEAD_AMOUNT,
      true
    );
    ref.current.dollyTo(CAMERA_DISTANCE, true);
  }, [spawnPoint]);

  useFrame(() => {
    const character = gameStore.getState().references.character;

    if (character) {
      character.getWorldPosition(_target);
      ref.current.moveTo(
        _target.x + LEAD_AMOUNT,
        _target.y,
        _target.z + VERTICAL_LEAD_AMOUNT,
        true
      );

      character.getWorldDirection(_forward);
    }
  });

  return (
    <CameraControls
      ref={ref}
      polarAngle={CAMERA_POLAR_ANGLE}
      distance={CAMERA_DISTANCE}
      // maxDistance={CAMERA_DISTANCE + 25}
      azimuthAngle={CAMERA_AZIMUTH_ANGLE}
      smoothTime={1}
    />
  );
};

export default GameCameraControls;
