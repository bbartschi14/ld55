import { CollisionGroup } from "@/constants/collisions";
import { Instance, Instances, useGLTF, useTexture } from "@react-three/drei";
import {
  CuboidCollider,
  RigidBody,
  interactionGroups,
} from "@react-three/rapier";
import { BufferGeometry, MeshStandardMaterial } from "three";

type BoundsWallProps = {
  x: number;
  z: number;
  width: number;
  height: number;
  depth: number;
};

const fenceMaterial = new MeshStandardMaterial({ color: "#b565cf" });

// X value from -400 to 400 space by 5
const fencePositions = Array.from({ length: 160 }, (_, i) => i * 15 - 400);

const BoundsWall = ({ x, z, width, height, depth }: BoundsWallProps) => {
  const { nodes } = useGLTF("/fences.glb");
  const fence = nodes.Fence as unknown as { geometry: BufferGeometry };
  const texture = useTexture("/Shadow.png");

  return (
    <RigidBody
      position={[x, -2.1, z]}
      collisionGroups={interactionGroups(CollisionGroup.Bounds)}
      name="bounds"
      type="fixed"
      colliders={false}
    >
      <CuboidCollider args={[width, height * 2, depth]} />
      <Instances
        limit={1000}
        geometry={fence.geometry}
        material={fenceMaterial}
      >
        {fencePositions.map((position, i) => (
          <Instance
            key={i}
            position={[position, 0, 0]}
            rotation={[0, Math.PI / 2, 0]}
            scale={4}
          />
        ))}
      </Instances>
      <Instances limit={1000}>
        <planeGeometry args={[15, 5]} />
        <meshBasicMaterial
          color={"#000000"}
          transparent
          opacity={0.1}
          map={texture}
          depthWrite={false}
        />
        {fencePositions.map((position, i) => (
          <Instance
            key={i}
            position={[position, 0, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          />
        ))}
      </Instances>
    </RigidBody>
  );
};

export default BoundsWall;
