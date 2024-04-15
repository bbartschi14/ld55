import { gameStore, useGameStore } from "@/stores/gameStore";
import { CameraControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useCallback, useEffect, useRef } from "react";
import { Vector3 } from "three";
import {
  clamp,
  degToRad,
  inverseLerp,
  lerp,
} from "three/src/math/MathUtils.js";

const CAMERA_POLAR_ANGLE = degToRad(40);
const CAMERA_AZIMUTH_ANGLE = degToRad(0);
const CAMERA_DISTANCE = 40;

const _target = new Vector3();
const _forward = new Vector3();

const MAX_LEAD_AMOUNT = 15;
const MIN_LEAD_AMOUNT = 5;
const VERTICAL_LEAD_AMOUNT = 2;

const GameCameraControls = () => {
  const ref = useRef<CameraControls>(null!);
  const spawnPoint = useGameStore((state) => state.spawnPoint);
  const { viewport } = useThree();

  const calcLeadAmount = useCallback(() => {
    const aspect = viewport.aspect;

    const minAspect = 1;
    const maxAspect = 1.75;

    const inverseLerped = clamp(
      inverseLerp(minAspect, maxAspect, aspect),
      0,
      1
    );

    return lerp(MIN_LEAD_AMOUNT, MAX_LEAD_AMOUNT, inverseLerped);
  }, [viewport.aspect]);

  useEffect(() => {
    ref.current.disconnect();

    const leadAmount = calcLeadAmount();

    ref.current.moveTo(
      spawnPoint[0] + leadAmount,
      spawnPoint[1] + 10,
      spawnPoint[2] + VERTICAL_LEAD_AMOUNT,
      false
    );
    ref.current.dollyTo(CAMERA_DISTANCE + 40, false);
    ref.current.moveTo(
      spawnPoint[0] + leadAmount,
      spawnPoint[1],
      spawnPoint[2] + VERTICAL_LEAD_AMOUNT,
      true
    );
    ref.current.dollyTo(CAMERA_DISTANCE, true);
  }, [spawnPoint, calcLeadAmount]);

  useFrame(() => {
    ref.current.disconnect();

    const character = gameStore.getState().references.character;

    const leadAmount = calcLeadAmount();

    if (character) {
      character.getWorldPosition(_target);
      ref.current.moveTo(
        _target.x + leadAmount,
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
