import { gameStore, useGameStore } from "@/stores/gameStore";
import { CameraControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Vector3 } from "three";
import { degToRad } from "three/src/math/MathUtils.js";

const CAMERA_POLAR_ANGLE = degToRad(40);
const CAMERA_AZIMUTH_ANGLE = degToRad(0);
const CAMERA_DISTANCE = 60;

const _target = new Vector3();
const _forward = new Vector3();

const GameCameraControls = () => {
  const ref = useRef<CameraControls>(null!);
  const spawnPoint = useGameStore((state) => state.spawnPoint);

  useEffect(() => {
    ref.current.moveTo(spawnPoint[0], spawnPoint[1] + 10, spawnPoint[2], false);
    ref.current.moveTo(spawnPoint[0], spawnPoint[1], spawnPoint[2], true);
  }, [spawnPoint]);

  useFrame(() => {
    const character = gameStore.getState().references.character;

    if (character) {
      character.getWorldPosition(_target);
      ref.current.moveTo(_target.x, _target.y, _target.z, true);

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
