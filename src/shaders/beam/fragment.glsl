uniform float uTime;
uniform float uLength;
varying vec2 csm_vUv;

void main()
{
    float u = csm_vUv.y;

    float currentLocation = u * uLength;

    float newOpacity = mod(currentLocation, 1.0);

    csm_FragColor = vec4(1.0, 1.0, 1.0, newOpacity * opacity);
}