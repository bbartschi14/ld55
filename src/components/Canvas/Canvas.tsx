"use client";

import { Canvas as R3FCanvas } from "@react-three/fiber";
import * as classes from "./Canvas.css";
import { Perf } from "r3f-perf";
import * as THREE from "three";
import { KeyboardControls } from "@react-three/drei";
import Character from "@/components/Character/Character";
import Goal from "@/components/Goal/Goal";
import { Physics } from "@react-three/rapier";
import { Suspense } from "react";
import { CONTROLS_MAP } from "@/constants/controls";
import { useGameStore } from "@/stores/gameStore";
import Bat from "@/components/Bat/Bat";
import Bounds from "@/components/Bounds/Bounds";
import GameCameraControls from "@/components/GameCameraControls/GameCameraControls";
import TimeManager from "@/components/TimeManager/TimeManager";
import Ground from "@/components/Ground/Ground";

THREE.ColorManagement.enabled = true;

const Canvas = () => {
  const goals = useGameStore((state) => state.goals);
  const bats = useGameStore((state) => state.bats);
  const runId = useGameStore((state) => state.runId);

  return (
    <div className={classes.root}>
      <R3FCanvas
        camera={{ fov: 30 }}
        gl={{ powerPreference: "high-performance", antialias: false }}
        key={runId}
      >
        <Perf />
        <Suspense>
          <Physics debug={false} gravity={[0, 0, 0]}>
            <TimeManager />
            <KeyboardControls map={CONTROLS_MAP}>
              <GameCameraControls />

              <color attach="background" args={["#f8ebff"]} />
              {goals.map((goal, index) => (
                <Goal key={index} position={goal.position} index={index} />
              ))}
              <Bounds />

              {bats.map((bat) => (
                <Bat
                  key={bat.id}
                  position={[bat.spawnPoint[0], 0, bat.spawnPoint[1]]}
                  id={bat.id}
                  flip={bat.flip ?? false}
                />
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
