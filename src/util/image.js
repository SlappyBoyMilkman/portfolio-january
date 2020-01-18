import Vertex from "./vertex";
import Timer from "./timer"
const THREE = require( "three" );
const SimplexNoise = require( "simplex-noise" )
const Easing = require( "./easing" );

class Image{
  constructor( project, settings, scene ){
    this.scene = scene;
    this.settings = settings;
    this.project = project;
    this.img = this.project.project.loaded_cover
    this.timer = new Timer(  1, .02, true );
    this.getImageThing();
  }

  setup(){
    var texture = new THREE.Texture( this.canvas );
    texture.needsUpdate = true;
    let size = 500;
    if( this.settings.imageSize ){
      if( !this.settings.imageHeight ){
        size = (this.settings.imageSize / 100) * this.scene.three.renderer.domElement.offsetWidth;
      }else{
        size = ((this.settings.imageHeight )) * ( this.canvas.width / this.canvas.height );
        debugger
      }
    }
    var geometry = new THREE.PlaneGeometry( size, size * ( this.canvas.height / this.canvas.width ), 10 );
    var material = new THREE.ShaderMaterial({
      vertexShader: [
        "varying vec2 vUv;",
        "void main() {",
          "vUv = uv;",
          "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
        "}"
      ].join( "\n" ),
      uniforms: {
        "perc": {  type: "1f", value: 0 },
        "image": { value: texture }
      },
      transparent: true,
      side: THREE.DoubleSide,
      fragmentShader: document.getElementById( "main-image-frag" ).innerHTML,
      depthTest: false
    });

    material.depthWrite = true;
    material.depthTest = true
    this.plane = new THREE.Mesh( geometry, material );
    if( this.settings.imagePos ){
      this.plane.position.set( this.settings.imagePos.x, this.settings.imagePos.y, this.settings.imagePos.z);
    }else{
      this.plane.position.set( -400, -600, -1000 - 700);
    }
    this.project.mesh.add( this.plane );
    material.depthWrite = false;
    this.points = []
    this.position = this.plane.position.clone();
    this.plane.geometry.verticesNeedUpdate = true;
    // this.plane.geometry.vertices.forEach( function( vertex, index ){
    //   let _vertex = new Vertex( vertex, index, this.scene );
    //   this.points.push( _vertex );
    // }.bind( this ));
  }

  getImageThing(){
    let canvas = document.createElement( "canvas" );
    let ctx = canvas.getContext( "2d" )
    canvas.width = this.img.width;
    canvas.height = this.img.height;
    ctx.drawImage( this.img, 0, 0 )
    this.canvas = canvas;
    this.setup();
  }

  animate(){
    if( this.plane ){
      let value = this.timer.getCount();
      if( this.project.animating ){
        this.timer.countUp()
      }else{
        this.timer.resetTimer()
      }
      this.plane.material.opacity = 1;
      this.plane.material.uniforms.perc.value = Easing.easeInOutQuint(value);
      this.plane.position.set(
        this.position.x + (( Easing.easeInOutQuint( Math.abs(this.scene.timer.getCount() - 1) ) * 0) ),
        this.position.y + (( Easing.easeInOutQuint( Math.abs(this.scene.timer.getCount() - 1) ) * 400) ),
        this.position.z + (( Easing.easeInOutQuint( Math.abs(this.scene.timer.getCount() - 1) ) * 1100))
      );
    }
  }
}

export default Image
