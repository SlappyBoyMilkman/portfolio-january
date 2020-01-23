import Word from "./word2";
import Element from "./element.js"
import Mountain from "./mountain.js"
import Image from "./image"
import Ring from "./ring"
import Timer from "./timer";
import BigWord from "./bigWord.js"
const THREE = require( "three" );
const Easing = require( "./easing" );

class Project{
  constructor( project, projectIndex, scene ){
    this.project = project;
    this.scene = scene;
    this.numWords = 1;
    this.growEase = 0;
    this.fadeEase = 0;
    this.ease = 0;
    this.index = projectIndex;
    this.timer = new Timer( 1, 1000, true );
    this.backgroundTimer = new Timer( 0, 1000, true );
    this.timer.assignReset( this.stopAnimating.bind( this ) );
    this.setup()
  }

  stopAnimating(){
    this.animating = false
  }

  setup(){
    this.scene.addString( "word", "word", this.project.name, true );
    let rings = [];

    this.geometry = new THREE.BoxGeometry( .1, .1, .1 );
    this.mesh = new THREE.Mesh( this.geometry );

    this.scene.mesh.add( this.mesh )
    for( var i = 0; i < this.numWords; i++ ){
      let ring = new Ring( this.project, this, i, this.scene )
      rings.push( ring )
    }

    this.mesh.position.set( this.index * 3500, 50, 0 );

    // this.mountain = new Mountain( this, this.scene );
    // this.bigWord = new BigWord( this.project, this, this.scene );
    this.rings = rings;
    this.image = new Image( this, this.project, this.scene );
  }

  reset(){
    this.fadeEase = 0;
    this.growEase = 0;
  }

  updateScrolled( scrolled ){
    this.growEase = 1 - Math.abs( scrolled / 400 )
  }

  animate( selectedProject ){
    if( selectedProject === this ){
      this.timer.countUp();
      this.animating = true;
      this.mesh.position.set( this.index * 3500, 0, 0 );
      this.rings.forEach( ( ring ) => { ring.animate.bind( ring )() } )
      this.image.animate();
      // this.bigWord.animate.bind( this.bigWord )()
    }else if( this.animating === true ){
      this.timer.countDown();
      this.mesh.position.set( this.index * 3500, 0, 0 );
      this.rings.forEach( ( ring ) => { ring.animate.bind( ring )() } )
      this.image.animate();
      // this.bigWord.animate.bind( this.bigWord )()
    }else{
    }
  }
}

export default Project
