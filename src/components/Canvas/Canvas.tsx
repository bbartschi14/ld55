"use client";

import { Canvas as R3FCanvas } from "@react-three/fiber";
import * as classes from "./Canvas.css";
import { Perf } from "r3f-perf";
import * as THREE from "three";
import { CameraControls, KeyboardControls } from "@react-three/drei";
import { degToRad } from "three/src/math/MathUtils.js";
import Ground from "@/components/Ground/Ground";
import Character from "@/components/Character/Character";
import House from "@/components/House/House";
import { Physics } from "@react-three/rapier";
import { Suspense } from "react";
import { CONTROLS_MAP } from "@/constants/controls";
import { useGameStore } from "@/store/gameStore";
import Bat from "@/components/Bat/Bat";
import Bounds from "@/components/Bounds/Bounds";

THREE.ColorManagement.enabled = true;

const CAMERA_POLAR_ANGLE = degToRad(40);
const CAMERA_AZIMUTH_ANGLE = degToRad(45);
const CAMERA_DISTANCE = 30;

const MAP_SIZE = [60, 60] as [number, number];

const NUM_BATS = 30;
const BAT_SPAWN_POINTS = Array.from({ length: NUM_BATS }, () => [
  Math.random() * MAP_SIZE[0] - MAP_SIZE[0] / 2,
  Math.random() * MAP_SIZE[1] - MAP_SIZE[1] / 2,
]);

const Canvas = () => {
  const houses = useGameStore((state) => state.houses);

  return (
    <div className={classes.root}>
      <R3FCanvas
        camera={{ fov: 30 }}
        gl={{ powerPreference: "high-performance", antialias: false }}
      >
        <Perf />

        <Suspense>
          <Physics debug gravity={[0, 0, 0]}>
            <KeyboardControls map={CONTROLS_MAP}>
              <CameraControls
                polarAngle={CAMERA_POLAR_ANGLE}
                distance={CAMERA_DISTANCE}
                maxDistance={CAMERA_DISTANCE + 25}
                azimuthAngle={CAMERA_AZIMUTH_ANGLE}
              />

              <color attach="background" args={["#f8ebff"]} />
              {houses.map((house, index) => (
                <House key={index} position={house.position} index={index} />
              ))}
              <Bounds bounds={MAP_SIZE} />

              {BAT_SPAWN_POINTS.map((position, index) => (
                <Bat key={index} position={[position[0], 0, position[1]]} />
              ))}

              <Character />
              <Ground />
              <ambientLight intensity={Math.PI / 3} />
              <directionalLight position={[0, 5, 5]} intensity={1} />
            </KeyboardControls>
          </Physics>
        </Suspense>
      </R3FCanvas>
    </div>
  );
};

export default Canvas;
