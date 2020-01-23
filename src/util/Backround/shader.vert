precision mediump float;
#pragma glslify: grain = require('glsl-film-grain')
#pragma glslify: blend = require('glsl-blend-soft-light')

uniform vec3 color1;
uniform vec3 color2;
uniform float aspect;
uniform vec2 offset;
uniform vec2 scale;
uniform float noiseAlpha;
uniform bool aspectCorrection;
uniform float grainScale;
uniform float grainTime;
uniform vec2 smooth;

varying vec2 vUv;

void main() {
  vec2 q = vec2(vUv - 0.5);

  gl_FragColor.a = vec4( 1.0 );
}
