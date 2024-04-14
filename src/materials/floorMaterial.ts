import * as THREE from "three";

import shaderFragment from "@/shaders/floor/fragment.glsl";
import shaderVertex from "@/shaders/floor/vertex.glsl";

export default class FloorMaterial extends THREE.ShaderMaterial {
  constructor() {
    const uniforms = {
      tBackground: { value: null },
    };

    super({
      wireframe: false,
      transparent: false,
      uniforms,
      vertexShader: shaderVertex,
      fragmentShader: shaderFragment,
    });
  }
}
