import Word from "./word2";

const Easing = require( "./easing" );
const THREE = require( "three" );

class Ring{
  constructor( projectSettings, project, index, scene  ){
    this.settings = projectSettings;
    this.project = project;
    this.scene = scene;
    this.index = index;
    this.numWords = this.project.project.numWords ? this.project.project.numWords : 12
    this.setup();
  }

  setup(){
    this.geometry = new THREE.BoxGeometry( .1, .1, .1 );
    this.mesh = new THREE.Mesh( this.geometry );
    this.project.mesh.add( this.mesh )
    this.mesh.position.set( 0, -550, -1000 );
    let words = []
    for( var i = 0; i < this.numWords; i++ ){
      let word = new Word( this.settings, this, i, this.scene, this.project )
      words.push( word )
    }
    // this.position
    this.words = words
  }

  animate(){
    this.words.forEach( ( word ) => { word.animate.bind( word )() } )
    this.mesh.rotation.set( 0, 0, 0 );
    // this.mesh.rotation.set( 0, 0, Math.PI / 2 );
    if( this.settings.ringPos ){
      this.mesh.position.set( this.settings.ringPos.x, this.settings.ringPos.y, this.settings.ringPos.z )
    }else{
      this.mesh.position.set( 250, -400, -1000 );
    }
    // this.mesh.position.set( 1000, -600, -2710 );
  }
}

export default Ring
