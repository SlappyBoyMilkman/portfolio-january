import WordBase from "../base/word-base"
import Letter from "./letter"
import Timer from "./timer"
const Easing = require( "./easing" );
const THREE = require( "three" );
const Noise = require("simplex-noise");

class Vertex{
  constructor( vertex, scene, mesh ){
    this.vertex = vertex;
    this.y = this.vertex.y;
    this.mesh = mesh;
    this.scene = scene;
    this.noise = new Noise(1)
  }

  animate( rotation ){
    var vector = this.vertex.clone();
    vector.applyMatrix4( this.mesh.matrixWorld );
    let scale = ((this.noise.noise3D( this.y / 20, this.scene.time / 345, ( (vector.x + vector.y + vector.z) / 800 ) ) - .5) * 200);
    this.vertex.y = this.y + ( this.noise.noise2D(  (rotation + vector.x + this.scene.time) / 400, 1 ) * ( Math.sin( this.scene.time / 300 ) * 200 ) ) + scale;
  }
}


class Word extends WordBase{
  constructor( projectSettings, ring, index, scene, project, mod, yIndex  ){
    let fontSize = projectSettings.fontSize * (scene.three.renderer.domElement.offsetWidth / 100) + "px";
    super( scene, index, fontSize );
    this.settings = projectSettings;
    this.ring = ring;
    this.scene = scene;
    this.project = project;
    this.index = index;
    this.mod = mod;
    this.color = this.settings.color;
    this.string = this.settings.sub.toUpperCase();
    this.fadeEase = 0;
    this.positionYTimer = { indexTimer: 0, timer: 0 };
    this.time = 0;
    this.yIndex = yIndex;
    this.vertices = [];
    this.timer = new Timer( (this.index * .02) + .5, .01, true );
    if( this.settings.subFont ){
      this.fontFamily = this.settings.subFont
    }
    this.noise = new Noise();
    this.loadFont( this );
  }

  setup(){
    var texture = new THREE.Texture( this.canvas );
    texture.needsUpdate = true;
    var geometry = new THREE.PlaneGeometry( this.canvas.width, this.canvas.height, 80 );
    let sat = Math.round( 250 - ( this.index * 10 ));
    let color = `rgb(${sat}, ${sat}, ${sat})`;
    var material = new THREE.MeshBasicMaterial( { map: texture, transparent: true, side: THREE.DoubleSide, color: "white" } );
    material.depthWrite = false;
    material.depthTest = true;
    this.plane = new THREE.Mesh( geometry, material );
    let width = this.canvas.width;
    for( var i = 0; i < this.plane.geometry.vertices.length; i++ ){
      let vertex = this.plane.geometry.vertices[i];
      let xPos = vertex.x;
      let radius = ( this.canvas.width / (Math.PI) ) / 2;
      let zPos = Math.sin( (xPos / width) * (Math.PI * 1) ) * radius  * 2;
      let newXPos = Math.cos( (xPos / width) * (Math.PI * 1) ) * radius  * -2;
      vertex.x = newXPos
      vertex.z = zPos
    }
    let yOffset = ((parseFloat(this.settings.fontSize) / 100) * this.scene.three.renderer.domElement.offsetWidth * this.settings.fontSize * this.yIndex * this.settings.yOffset) ;
    this.plane.position.set( 0, yOffset, 0);
    this.plane.scale.set( this.settings.scale, this.settings.scale, this.settings.scale )
    this.plane.geometry.verticesNeedUpdate = true;
    this.ring.mesh.add( this.plane );
    this.front = this.plane;
    this.back = this.plane.clone();
    this.ring.mesh.add( this.back )
    this.back.renderOrder = -1;
    this.front.renderOrder = 1;

    this.back.geometry.vertices.forEach(
      ( vertex ) => {
        let vert = new Vertex( vertex, this.scene, this.back );
        this.vertices.push( vert )
      }
    )

    this.front.geometry.vertices.forEach(
      ( vertex ) => {
        let vert = new Vertex( vertex, this.scene, this.front );
        this.vertices.push( vert )
      }
    )

    var material2 = new THREE.MeshBasicMaterial( { map: texture, transparent: true, side: THREE.BackSide, color: "white" } );
    material2.depthWrite = false;
    material2.depthTest = true;

    this.back.material = material2;
    this.front.material.side = THREE.FrontSide;
  }



    animate(){
      if( this.scene.status === "fadingOut" ){

        if( this.positionYTimer.indexTimer <= 0 ){
          if( this.positionYTimer.timer > 0  ){
            this.positionYTimer.timer -= .01;
          }
        }else{
          this.positionYTimer.indexTimer -= .05
        }
      }else if( this.positionYTimer.timer < 1 ){
        if( this.positionYTimer.indexTimer <= this.index * .3 ){
          this.positionYTimer.indexTimer += .05
        }else{
          if( this.positionYTimer.timer < 1 ){
            this.positionYTimer.timer += .01;
          }
        }
      }
      if( this.plane ){
        let time = (this.scene.time / 50);
        let inc = (Math.PI * 2) / 3;
        let timeLeftOver = time % inc;
        let timeBase = time - timeLeftOver;
        let normalized = timeLeftOver / inc;
        let easeTime = Easing.easeInOutQuint(normalized) * inc;
        time = timeBase + easeTime;
        let rotation = ( this.index * .7) + time;
        rotation = (this.index * .8) + (this.scene.time / 100);
        if( this.project.animating ){
          this.timer.countUp()
        }else{
          this.timer.resetTimer()
        }
        let mod = this.index % 2 === 0? 1: -1;
        this.front.material.opacity = Easing.easeInOutCubic( this.timer.getCount() );
        this.back.material.opacity = Easing.easeInOutCubic( this.timer.getCount() );
        this.front.rotation.set( 0, rotation * this.mod, 0 );
        this.back.rotation.set( 0, rotation * this.mod, 0 );
        this.front.geometry.verticesNeedUpdate = true;
        this.back.geometry.verticesNeedUpdate = true;
        this.front.updateMatrixWorld();
        this.back.updateMatrixWorld();

        this.vertices.forEach(
          ( vertex ) => {
            vertex.animate.bind( vertex )( rotation )
          }
        );
      }
    }
  }

export default Word
