import { Canvas as R3FCanvas } from "@react-three/fiber";
import * as classes from "./Home.css";
import * as THREE from "three";
import { Suspense, useEffect, useState } from "react";
import Ground from "@/components/Ground/Ground";
import LogoText from "@/components/LogoText/LogoText";
import { CameraControls, Environment } from "@react-three/drei";
import { degToRad } from "three/src/math/MathUtils.js";
import HomeCharacter from "@/components/Home/HomeCharacter";
import { animated, useSpring } from "@react-spring/three";
import HomeBat from "@/components/Home/HomeBat";
import { Button, Center, Text, Transition, rem } from "@mantine/core";
import { Link } from "react-router-dom";

THREE.ColorManagement.enabled = true;

const Home = () => {
  const [spring] = useSpring(
    () => ({
      rotation: [0, Math.PI * 2, 0],
      from: { rotation: [0, 0, 0] },
      config: { duration: 4000 },
      loop: true,
    }),
    []
  );

  const [mountPlay, setMountPlay] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setMountPlay(true);
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <Suspense>
      <div className={classes.root}>
        <R3FCanvas
          camera={{ fov: 30 }}
          gl={{ powerPreference: "high-performance", antialias: true }}
        >
          <CameraControls
            azimuthAngle={degToRad(0)}
            polarAngle={degToRad(80)}
            distance={5}
            connect={() => null}
          />
          <group position={[0, 0.35, 0]}>
            <group position={[-0.1, 0, 0]}>
              <LogoText />
            </group>
            <animated.group
              position={[0, -0.75, -1.5]}
              rotation={spring.rotation as unknown as [number, number, number]}
            >
              <animated.group>
                <HomeCharacter />
              </animated.group>
              <animated.group rotation={[0, degToRad(-30), 0]}>
                <HomeBat />
              </animated.group>
              <animated.group rotation={[0, degToRad(-50), 0]}>
                <HomeBat />
              </animated.group>
            </animated.group>
          </group>

          <Ground />
          <Environment preset="sunset" />
          <ambientLight intensity={1} />
          <pointLight position={[-0.5, 1.5, 1.5]} intensity={5} />
        </R3FCanvas>
        <Center
          style={{
            zIndex: 100,
            position: "fixed",
            left: 0,
            right: 0,
            bottom: "10dvh",
          }}
        >
          <Transition mounted={mountPlay} duration={700} transition="fade-up">
            {(styles) => (
              <Button
                size="xl"
                w={rem(300)}
                h={rem(100)}
                radius={rem(16)}
                style={{ boxShadow: "4px 4px 16px #00000034", ...styles }}
                component={Link}
                to={"/game"}
              >
                <Text fz="3rem" fw="bold">
                  Play
                </Text>
              </Button>
            )}
          </Transition>
        </Center>
      </div>
    </Suspense>
  );
};

export default Home;
