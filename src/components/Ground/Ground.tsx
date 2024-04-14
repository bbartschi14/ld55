import FloorMaterial from "@/materials/floorMaterial";
import * as THREE from "three";

const topLeft = new THREE.Color("#fae0fb");
const topRight = new THREE.Color("#f0d0f3");
const bottomRight = new THREE.Color("#f5c5f7");
const bottomLeft = new THREE.Color("#f4c2f6");

const data = new Uint8Array([
  Math.round(bottomLeft.r * 255),
  Math.round(bottomLeft.g * 255),
  Math.round(bottomLeft.b * 255),
  255,
  Math.round(bottomRight.r * 255),
  Math.round(bottomRight.g * 255),
  Math.round(bottomRight.b * 255),
  255,
  Math.round(topLeft.r * 255),
  Math.round(topLeft.g * 255),
  Math.round(topLeft.b * 255),
  255,
  Math.round(topRight.r * 255),
  Math.round(topRight.g * 255),
  Math.round(topRight.b * 255),
  255,
]);

const texture = new THREE.DataTexture(data, 2, 2);
texture.magFilter = THREE.LinearFilter;
texture.needsUpdate = true;

const material = new FloorMaterial();
material.uniforms.tBackground.value = texture;

const Ground = () => {
  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2, 10, 10]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
};

export default Ground;
