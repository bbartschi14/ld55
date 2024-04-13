"use client";

import { Canvas as R3FCanvas } from "@react-three/fiber";
import * as classes from "./Canvas.css";
import { Perf } from "r3f-perf";
import * as THREE from "three";
import { KeyboardControls } from "@react-three/drei";
import Character from "@/components/Character/Character";
import House from "@/components/House/House";
import { Physics } from "@react-three/rapier";
import { Suspense } from "react";
import { CONTROLS_MAP } from "@/constants/controls";
import { useGameStore } from "@/store/gameStore";
import Bat from "@/components/Bat/Bat";
import Bounds from "@/components/Bounds/Bounds";
import GameCameraControls from "@/components/GameCameraControls/GameCameraControls";

THREE.ColorManagement.enabled = true;

const Canvas = () => {
  const houses = useGameStore((state) => state.houses);
  const bats = useGameStore((state) => state.bats);

  return (
    <div className={classes.root}>
      <R3FCanvas
        camera={{ fov: 30 }}
        gl={{ powerPreference: "high-performance", antialias: false }}
      >
        <Perf />

        <Suspense>
          <Physics debug={true} gravity={[0, 0, 0]}>
            <KeyboardControls map={CONTROLS_MAP}>
              <GameCameraControls />

              <color attach="background" args={["#f8ebff"]} />
              {houses.map((house, index) => (
                <House key={index} position={house.position} index={index} />
              ))}
              <Bounds />

              {bats.map((bat) => (
                <Bat
                  key={bat.id}
                  position={[bat.spawnPoint[0], 0, bat.spawnPoint[1]]}
                  id={bat.id}
                />
              ))}

              <Character />
              {/* <Ground /> */}
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
