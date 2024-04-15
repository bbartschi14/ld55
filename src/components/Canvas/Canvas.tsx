import { Canvas as R3FCanvas } from "@react-three/fiber";
import * as classes from "./Canvas.css";
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
import Tree from "@/components/Tree/Tree";
import { GROUND_LEVEL } from "@/constants/ground";

THREE.ColorManagement.enabled = true;

const Canvas = () => {
  const goals = useGameStore((state) => state.goals);
  const bats = useGameStore((state) => state.bats);
  const trees = useGameStore((state) => state.trees);
  const runId = useGameStore((state) => state.runId);

  return (
    <div className={classes.root}>
      <R3FCanvas
        camera={{ fov: 30 }}
        gl={{ powerPreference: "high-performance", antialias: true }}
        key={runId}
      >
        <Suspense>
          <Physics debug={false} gravity={[0, 0, 0]}>
            <TimeManager />
            <KeyboardControls map={CONTROLS_MAP}>
              <GameCameraControls />

              <color attach="background" args={["#f8ebff"]} />
              {goals.map((goal, index) => (
                <Goal
                  key={index}
                  position={goal.position}
                  index={index}
                  isFinal={index === goals.length - 1}
                />
              ))}
              <Bounds />
              {trees.map((tree, index) => (
                <Tree
                  key={index}
                  position={[tree.position[0], GROUND_LEVEL, tree.position[2]]}
                />
              ))}
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
              <directionalLight position={[0, 5, 5]} intensity={1.25} />
            </KeyboardControls>
          </Physics>
        </Suspense>
      </R3FCanvas>
    </div>
  );
};

export default Canvas;
