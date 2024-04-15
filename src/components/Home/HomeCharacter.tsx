import { animated } from "@react-spring/three";
import { useGLTF } from "@react-three/drei";
import { BufferGeometry } from "three";
import { degToRad } from "three/src/math/MathUtils.js";

const HomeCharacter = () => {
  const { nodes } = useGLTF("/broom.glb");
  const broom = nodes.Broom as unknown as { geometry: BufferGeometry };
  const bristles = nodes.Bristles as unknown as { geometry: BufferGeometry };
  const character = nodes.Character as unknown as { geometry: BufferGeometry };

  const { nodes: hatNodes } = useGLTF("/hat.glb");
  const hat = hatNodes.Hat as unknown as { geometry: BufferGeometry };
  const hatBand = hatNodes.HatBand as unknown as { geometry: BufferGeometry };
  const hatBuckle = hatNodes.HatBuckle as unknown as {
    geometry: BufferGeometry;
  };

  return (
    <animated.group
      position={[0, 0, 2]}
      scale={0.25}
      rotation={[degToRad(20), -Math.PI / 2, 0]}
    >
      <animated.mesh geometry={broom.geometry}>
        <animated.meshStandardMaterial color="#c68426" />
        <mesh geometry={bristles.geometry}>
          <animated.meshStandardMaterial color="#f4b55b" />
        </mesh>
        <mesh geometry={character.geometry} scale={1.7}>
          <animated.meshStandardMaterial color="#ffffff" />
          <mesh
            geometry={hat.geometry}
            position={[0, 0.85, 0]}
            rotation={[0, Math.PI / 3, 0]}
            scale={1.1}
          >
            <animated.meshStandardMaterial color="#000000" />
            <mesh geometry={hatBand.geometry}>
              <animated.meshStandardMaterial color="#c33ade" />
              <mesh geometry={hatBuckle.geometry}>
                <animated.meshStandardMaterial color="#ffe607" />
              </mesh>
            </mesh>
          </mesh>
        </mesh>
      </animated.mesh>
    </animated.group>
  );
};

export default HomeCharacter;
