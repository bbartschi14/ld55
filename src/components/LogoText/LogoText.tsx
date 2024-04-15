import { animated, useSpring } from "@react-spring/three";
import { useGLTF } from "@react-three/drei";
import { BufferGeometry } from "three";

const LogoText = () => {
  const { nodes } = useGLTF("/broom_vroom.glb");
  const text = nodes.Text as unknown as { geometry: BufferGeometry };
  const text2 = nodes.Text2 as unknown as { geometry: BufferGeometry };

  const textSpring = useSpring({
    scale: [1, 1, 1],
    position: [0, 0, 0],
    from: { scale: [0, 1, 1], position: [-3, 0, 0] },
    delay: 200,
  });

  const text2Spring = useSpring({
    scale: [1, 1, 1],
    position: [0, 0, 0],
    from: { scale: [0, 1, 1], position: [3, 0, 0] },
    delay: 700,
  });

  return (
    <>
      <animated.mesh
        geometry={text.geometry}
        rotation={[Math.PI / 2, 0, 0]}
        scale={textSpring.scale as unknown as [number, number, number]}
        position={textSpring.position as unknown as [number, number, number]}
      >
        <meshStandardMaterial color={"#77327f"} />
      </animated.mesh>
      <animated.mesh
        geometry={text2.geometry}
        rotation={[Math.PI / 2, 0, 0]}
        scale={text2Spring.scale as unknown as [number, number, number]}
        position={text2Spring.position as unknown as [number, number, number]}
      >
        <meshStandardMaterial color={"#9732a2"} />
      </animated.mesh>
    </>
  );
};

export default LogoText;
