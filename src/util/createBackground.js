const THREE = require("three");
var glslify = require('glslify')


module.exports = createBackground
function createBackground ( color ) {
  var geometry =  new THREE.PlaneGeometry(4, 2, 1)
  let bg = "red";
  if( color ){
    bg = `rgb(${ color.r }, ${ color.g }, ${ color.b })`
  }
  var material = new THREE.ShaderMaterial({
    vertexShader: [
      "varying vec2 vUv;",
      "void main() {",
        "vUv = uv;",
        "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
      "}"
    ].join( "\n" ),
    uniforms: {
      "color": { value: new THREE.Color(bg), type: 'vec3' },
      "nextColor": { value: new THREE.Color("blue"), type: "vec3" },
      "perc": {  type: "1f", value: 0 }
    },
    transparent: true,
    fragmentShader: document.getElementById( "background-frag" ).innerHTML,
    side: THREE.DoubleSide,
    depthTest: false
  })
  var mesh = new THREE.Mesh(geometry, material)
  mesh.renderOrder = -2;
  return mesh
}
