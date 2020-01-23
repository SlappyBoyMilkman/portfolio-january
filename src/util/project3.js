import Word from "./word3";
import Element from "./element.js"
import Mountain from "./mountain.js"
import Timer from "./timer";
import BigWord from "./bigWord.js"
import Image from "./image"
import Loop from "./loop"
const THREE = require( "three" );
const Easing = require( "./easing" );

class Project{
  constructor( project, projectIndex, scene ){
    this.project = project;
    this.scene = scene;
    this.numWords = 6;
    this.growEase = 0;
    this.fadeEase = 0;
    this.ease = 0;
    this.index = projectIndex;
    this.timer = new Timer( 1, 1000, true );
    this.timer.assignReset( this.stopAnimating.bind( this ) );
    this.setup()
  }

  setup(){
    this.scene.addString( "word", "word", this.project.name, true );


    this.geometry = new THREE.BoxGeometry( .1, .1, .1 );
    this.mesh = new THREE.Mesh( this.geometry );

    this.scene.mesh.add( this.mesh )

    this.mesh.position.set( this.index * 3500, 50, 0 );

    this.loop = new Loop( this.project, this, 0, this.scene );
    // this.mountain = new Mountain( this, this.scene );

    // this.bigWord = new BigWord( this.project, this, this.scene );
    this.image = new Image( this, this.project, this.scene );

  }

  reset(){
    this.fadeEase = 0;
    this.growEase = 0;
  }

  updateScrolled( scrolled ){
    this.growEase = 1 - Math.abs( scrolled / 400 )
  }

  stopAnimating(){
    this.animating = false
  }

  animate( selectedProject ){
    if( selectedProject === this ){
      this.timer.countUp();
      this.animating = true;
      this.mesh.position.set( this.index * 3500, 50, 0 );
      this.loop.animate();
      this.image.animate();
      // this.bigWord.animate.bind( this.bigWord )();
    }else if( this.animating === true ){
      this.timer.countDown();
      this.mesh.position.set( this.index * 3500, 50, 0 );
      this.loop.animate();
      this.image.animate();
      // this.bigWord.animate.bind( this.bigWord )();
    }else{
    }
  }
}

export default Project
