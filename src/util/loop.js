import Word from "./word3";
const Easing = require( "./easing" );
const THREE = require( "three" );

class Loop{
  constructor( projectSettings, project, index, scene ){
    this.settings = projectSettings;
    this.project = project;
    this.scene = scene;
    this.index = index;
    this.numWords = projectSettings.numWords;
    this.radius = projectSettings.radius;
    this.setup();
  }

  setup(){
    this.geometry = new THREE.BoxGeometry( .1, .1, .1 );
    this.mesh = new THREE.Mesh( this.geometry );
    this.project.mesh.add( this.mesh )
    this.mesh.position.set( this.settings.loopPos.x, this.settings.loopPos.y, this.settings.loopPos.z );
    let words = []
    let mod = 1;
    let yIndex = 0;
    for( var i = 0; i < this.numWords; i++ ){
      mod = i % 3 === 0 ? mod * -1: mod;
      yIndex = i % 3 === 0 ? yIndex + 1: yIndex;
      let word = new Word( this.settings, this.project, i, this.scene, this, mod, yIndex )
      words.push( word )
    }
    this.words = words
  }

  animate(){
    let time = this.scene.time / 100;
    let inc = (Math.PI * 2) / this.numWords
    let timeLeftOver = time % ( inc );
    let timeBase = time - timeLeftOver;
    let normalized = timeLeftOver / inc;
    let easeTime = Easing.easeInOutQuint(normalized) * inc;
    time = timeBase + easeTime;
    time =  this.scene.time / 150;
    this.mesh.rotation.set( time % (Math.PI * 2), 0, 0 );
    this.mesh.scale.set( .5, .5, .5 )
    this.words.forEach( (word) => { word.animate.bind( word )( time ) } );
  }
}

export default Loop
