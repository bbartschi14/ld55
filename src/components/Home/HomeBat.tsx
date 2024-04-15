import { useGLTF } from "@react-three/drei";
import { BufferGeometry } from "three";

const HomeBat = () => {
  const { nodes } = useGLTF("/bat.glb");
  const bat = nodes.Bat as unknown as { geometry: BufferGeometry };

  return (
    <mesh
      geometry={bat.geometry}
      position={[0, 0, 2]}
      scale={0.25}
      rotation={[0, 0, 0]}
    >
      <meshStandardMaterial color="#696969" />
    </mesh>
  );
};

export default HomeBat;
