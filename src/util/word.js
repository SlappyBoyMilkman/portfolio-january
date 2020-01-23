import WordBase from "../base/word-base"
import Letter from "./letter"
import Timer from "./timer"
const Easing = require( "./easing" );
const THREE = require( "three" );

class Word extends WordBase{
  constructor( projectSettings, project, index, scene  ){
    let fontSize = projectSettings.fontSize * (scene.three.renderer.domElement.offsetWidth / 100) + "px";
    super( scene, index, fontSize );
    this.settings = projectSettings;
    this.project = project;
    this.scene = scene;
    this.index = index;
    this.color = this.settings.color;
    this.string = projectSettings.sub.toUpperCase();
    this.fadeEase = 0;
    this.timer = new Timer( .3, .01, true );
    if( this.settings.subFont ){
      this.fontFamily = this.settings.subFont
    }
    this.loadFont( this );
  }

  setup(){
    this.geometry = new THREE.BoxGeometry( .1, .1, .1 );
    this.material = new THREE.MeshBasicMaterial( "white" );
    this.mesh = new THREE.Mesh( this.geometry );

    this.project.mesh.add( this.mesh )
    var texture = new THREE.Texture( this.canvas );
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
    texture.needsUpdate = true;
    texture.repeat.y = this.project.numWords;
    texture.repeat.x = 1;
    texture.offset.y = (1 / this.project.numWords) * this.index;
    var geometry = new THREE.SphereGeometry( 400, 32, 32 );
    let sat = Math.round( 250 - ( this.index * 10 ));
    let color = `black `
    var material = new THREE.MeshBasicMaterial( { map: texture, transparent: true,  side: THREE.DoubleSide } );
    material.depthWrite = false;
    material.depthTest = true;
    this.plane = new THREE.Mesh( geometry, material );
    this.project.mesh.add( this.plane );
    window.sphere = this.plane
    this.plane.scale.set( .5, .5, .5 );
    // this.plane.position.set( this.index, .5, .5 );
    // this.plane.scale.set( ((this.index + 1) / 10), ((this.index + 1) / 10), ((this.index + 1) / 10) );

  }



    animate(){
      if( this.plane ){
        let value = this.timer.getCount();
        if( this.project.animating ){
          this.timer.countUp()
        }else{
          this.timer.resetTimer()
        }
        let pos = this.index & 2 == 0? -1 : 1;
        let rotation = (pos * (this.index + 1)* this.scene.time) / 200
        if( ((rotation + (-2)) % (Math.PI * 2)) < Math.PI ){
          this.plane.renderOrder = 1;
        }else{
          this.plane.renderOrder = 2;
        }
        this.plane.material.map.repeat.x = 1
        this.plane.material.opacity = Easing.easeInOutCubic( this.timer.getCount() ) * .8
        this.plane.position.set( -150,-400, -1200 )
        // this.plane.material.map.offset.x = (((this.index + 1) * this.scene.time) / 1000 );
        this.plane.rotation.set( 0, rotation, 0 )
      }
    }
  }

export default Word
