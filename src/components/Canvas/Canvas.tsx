"use client";

import { Canvas as R3FCanvas } from "@react-three/fiber";
import * as classes from "./Canvas.css";
import { Perf } from "r3f-perf";
import * as THREE from "three";
import { CameraControls } from "@react-three/drei";
import { degToRad } from "three/src/math/MathUtils.js";

THREE.ColorManagement.enabled = true;

const CAMERA_POLAR_ANGLE = degToRad(60);
const CAMERA_AZIMUTH_ANGLE = degToRad(45);
const CAMERA_DISTANCE = 15;

const Canvas = () => {
  return (
    <div className={classes.root}>
      <R3FCanvas
        camera={{ fov: 30 }}
        gl={{ powerPreference: "high-performance", antialias: false }}
      >
        <Perf />
        <CameraControls
          polarAngle={CAMERA_POLAR_ANGLE}
          distance={CAMERA_DISTANCE}
          azimuthAngle={CAMERA_AZIMUTH_ANGLE}
        />

        <color attach="background" args={["#f8ebff"]} />
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#c33ade" />
        </mesh>
        <ambientLight intensity={Math.PI / 3} />
        <directionalLight position={[0, 5, 5]} intensity={1} />
      </R3FCanvas>
    </div>
  );
};

export default Canvas;
