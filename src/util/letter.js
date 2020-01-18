import LetterBase from "../base/letter-base"

const Easing = require( "./easing" );

const THREE = require( "three" );

class Letter{
  constructor( char, word, project, scene, settings ){
    this.char = char;
    this.word = word;
    this.project = project
    this.scene = scene;
    this.settings = settings
    this.setup()
  }

  setup(){
    let loader = new THREE.FontLoader();
    let scene = this.scene.three.scene;
    let fontSize = this.scene.getInterfaceElement("font size");

    loader.load( './fonts/graphik.json', function( font ){
      var geometry = new THREE.TextGeometry( this.char.letter, {
        font: font,
        size: fontSize.value,
        height: 20,
        curveSegments: 20,
       })

       this.material = new THREE.MeshBasicMaterial({ color: "rgb( 40, 40, 40 )", transparent: true });
       this.mesh = new THREE.Mesh( geometry, this.material );
       this.word.mesh.add( this.mesh )
       this.mesh.position.set( this.char.left * 100, 2000, 0 )

    }.bind( this ));
  }

  animate(){
    if( this.mesh ){
      let sat = Math.round( 0 + ( this.word.index * 1 * 10 ));
      let ease = Easing.easeInOutQuad( this.word.positionYTimer.timer );
      this.mesh.material.color.set( `rgb(${sat}, ${sat}, ${sat})` )
      this.material.opacity = ease;
      this.mesh.position.set(  (( this.char.left * .6 ) - (( this.char.totalWidth * .6) / 2 ) ) + ( (( this.char.left * ease ) - (( this.char.totalWidth * ease ) / 2 ) ) ), 0, 0 );
      this.mesh.scale.set( 4, 4, .1 );
    }
  }


}

export default Letter;
