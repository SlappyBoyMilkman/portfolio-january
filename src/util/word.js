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
    this.timer = new Timer( (this.index * .05) + 0, .01, true );
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
    texture.needsUpdate = true;
    var geometry = new THREE.PlaneGeometry( this.canvas.width, this.canvas.height, 2 );
    let sat = Math.round( 250 - ( this.index * 10 ));
    let color = `black `
    var material = new THREE.MeshBasicMaterial( { map: texture, transparent: true } );
    material.depthWrite = false;
    this.plane = new THREE.Mesh( geometry, material );
    this.project.mesh.add( this.plane );
    this.plane.scale.set( .5, .5, .5 );

  }



    animate(){
      if( this.plane ){
        let value = this.timer.getCount();
        if( this.project.animating ){
          this.timer.countUp()
        }else{
          this.timer.resetTimer()
        }
        if( this.settings.wordPos ){
          this.plane.position.set(  this.settings.wordPos.x,  this.settings.wordPos.y + ( Easing.easeOutQuart(value) * 800 ) + (Math.sin( ( this.index / 3 )  + (this.scene.time / 20) ) * 20) + ( this.index * 10 ) , this.settings.wordPos.z - ( (this.index ) * 50 * 1 ) );
        }else{
          this.plane.position.set(  400,  -1150 + ( Easing.easeOutQuart(value) * 800 ) + (Math.sin( ( this.index / 3 )  + (this.scene.time / 20) ) * 10) + ( this.index * 5 ) , -950 - ( (this.index ) * 20 * 1 ) );
        }
      }
    }
  }

export default Word
