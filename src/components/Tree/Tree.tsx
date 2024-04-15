import { CollisionGroup } from "@/constants/collisions";
import { useGLTF } from "@react-three/drei";
import { MeshProps } from "@react-three/fiber";
import { RigidBody, interactionGroups } from "@react-three/rapier";
import { BufferGeometry } from "three";

const Tree = (props: MeshProps) => {
  const { nodes } = useGLTF("/tree.glb");
  const tree = nodes.Tree as unknown as { geometry: BufferGeometry };
  const stump = nodes.Stump as unknown as { geometry: BufferGeometry };
  return (
    <RigidBody
      type="fixed"
      collisionGroups={interactionGroups(CollisionGroup.Tree)}
      name="tree"
    >
      <mesh geometry={tree.geometry} {...props} scale={0.5}>
        {/* <CuboidCollider args={[5, 5, 5]} /> */}
        <meshStandardMaterial color="#758e4f" />
        <mesh geometry={stump.geometry}>
          <meshStandardMaterial color="#ce9055" />
        </mesh>
      </mesh>
    </RigidBody>
  );
};

export default Tree;
