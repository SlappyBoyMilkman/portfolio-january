import WordBase from "../base/word-base"
import Letter from "./letter"
import Timer from "./timer"
const Easing = require( "./easing" );
const THREE = require( "three" );

class Word extends WordBase{
  constructor( projectSettings, project, index, scene, loop  ){
    let fontSize = projectSettings.fontSize * (scene.three.renderer.domElement.offsetWidth / 100) + "px";
    super( scene, index, fontSize );
    this.settings = projectSettings;
    this.project = project;
    this.loop = loop;
    this.scene = scene;
    this.color = this.settings.color
    this.index = index;
    this.string = projectSettings.sub.toUpperCase();
    this.fadeEase = 0;
    this.timer = new Timer( (this.index * .04) + .5, .01, true );
    if( this.settings.subFont ){
      this.fontFamily = this.settings.subFont
    }
    this.loadFont( this );
  }

  setup(){
    this.geometry = new THREE.BoxGeometry( .1, .1, .1 );
    this.material = new THREE.MeshBasicMaterial( "white" );
    this.mesh = new THREE.Mesh( this.geometry );

    this.loop.mesh.add( this.mesh )
    var texture = new THREE.Texture( this.canvas );
    texture.needsUpdate = true;
    var geometry = new THREE.PlaneGeometry( this.canvas.width, this.canvas.height, 2 );
    var material = new THREE.MeshBasicMaterial( { map: texture, side: THREE.DoubleSide, transparent: true } );
    material.depthWrite = true;
    material.depthTest = false
    material.depthWrite = false;
    this.plane = new THREE.Mesh( geometry, material );
    this.mesh.add( this.plane );
    let angle = (this.index / this.loop.numWords) * Math.PI * 2;
    this.plane.rotation.set(  -angle + 0, 0, 0 );
    // this.plane.rotation.set(  0, 0, 0 );
    // this.plane.position.set(  0, 0, 0 );

    this.plane.position.set( 0, Math.sin( angle ) * this.loop.radius, Math.cos( angle ) * this.loop.radius );
  }



    animate( time ){
      // time = time % (Math.PI / 2)
      if( this.mesh ){
        let index = (this.index / this.loop.numWords);
        let indexNormal = Math.abs(index - ( .5 )) * 2;
        let timeNormal = Math.abs((((((time ) % ( Math.PI * 2 ))) / ( Math.PI * 2 ))) - .5) * 2
        let tp = (Math.PI * 2)
        let opacity = (Math.abs(((( time + tp - (index * tp - .5) ) % (tp)) / (tp)) - .5) * 2);
        if( this.project.animating ){
          this.timer.countUp()
        }else{
          this.timer.resetTimer()
        }
        let value = Easing.easeInOutQuint( this.timer.getCount() ) * opacity;
        this.plane.material.opacity = value;
        let angle = (this.index / this.loop.numWords) * Math.PI * 2;

        if( opacity < .5 ){
          this.plane.renderOrder = -1;
        }else{
          this.plane.renderOrder = 1;
        }
      }
    }
  }

export default Word
