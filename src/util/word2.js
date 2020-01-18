import WordBase from "../base/word-base"
import Letter from "./letter"
import Timer from "./timer"
const Easing = require( "./easing" );
const THREE = require( "three" );

class Word extends WordBase{
  constructor( projectSettings, ring, index, scene, project  ){
    let fontSize = projectSettings.fontSize * (scene.three.renderer.domElement.offsetWidth / 100) + "px";
    super( scene, index, fontSize );
    this.settings = projectSettings;
    this.ring = ring;
    this.scene = scene;
    this.project = project;
    this.index = index;
    this.color = this.settings.color;
    this.string = this.settings.sub.toUpperCase();
    this.fadeEase = 0;
    this.positionYTimer = { indexTimer: 0, timer: 0 };
    this.time = 0;
    this.timer = new Timer( (this.index * .02) + 0, .01, true );
    if( this.settings.subFont ){
      this.fontFamily = this.settings.subFont
    }
    this.loadFont( this );
  }

  setup(){
    var texture = new THREE.Texture( this.canvas );
    texture.needsUpdate = true;
    var geometry = new THREE.PlaneGeometry( this.canvas.width, this.canvas.height, 10 );
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
    let yOffset = ((parseFloat(this.settings.fontSize) / 100) * this.scene.three.renderer.domElement.offsetWidth * this.settings.fontSize * this.index * this.settings.yOffset) ;
    this.plane.position.set( 0, yOffset, 0);
    this.plane.scale.set( this.settings.scale, this.settings.scale, this.settings.scale )
    this.plane.geometry.verticesNeedUpdate = true;
    this.ring.mesh.add( this.plane );
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
        let inc = (Math.PI * 2) / 8;
        let timeLeftOver = time % inc;
        let timeBase = time - timeLeftOver;
        let normalized = timeLeftOver / inc;
        let easeTime = Easing.easeInOutQuint(normalized) * inc;
        time = timeBase + easeTime;
        let rotation = ( this.index * 1.3) + time;
        if( this.project.animating ){
          this.timer.countUp()
        }else{
          this.timer.resetTimer()
        }
        this.plane.material.opacity = Easing.easeInOutCubic( this.timer.getCount() );
        this.plane.rotation.set( 0, rotation, 0 );
        if( rotation % ((Math.PI * 2) + (Math.PI * 0))  < Math.PI  ){
          this.plane.renderOrder = 1;
        }else{
          this.plane.renderOrder = -1;
        }
      }
    }
  }

export default Word
