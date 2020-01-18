const THREE = require( "three" );
const SimplexNoise = require( "simplex-noise" )

class Peak{
  constructor( index, mountain, project, scene ){
    this.index = index;
    this.project = project;
    this.mountain = mountain;
    this.scene = scene;
    this.time = 0;
    this.simplex = new SimplexNoise( 'seed' )
    this.setup();
  }

  setup(){
    var geometry = new THREE.PlaneGeometry( 1150 + ( 60 * this.index), 10, 10 );
    let sat = Math.round( 0 + ( this.index * 10 ));
    let color = `rgb(${sat}, ${sat}, ${sat})`;
    var material = new THREE.MeshBasicMaterial( {color: color, side: THREE.DoubleSide} );
    this.plane = new THREE.Mesh( geometry, material );
    this.plane.position.set( this.project.index * 2000, -300, -1000 - 500 - (10 * this.index));
    this.scene.three.scene.add( this.plane );
  }

  animate(){
    this.time++;
    this.plane.geometry.verticesNeedUpdate = true;
    this.plane.geometry.vertices.forEach(
      function( vertex, index ){
        let pos = index % 2;
        if( vertex.y < 0 ){
          pos = -1
        }else{
          pos = 1;
        }
        let noise = this.simplex.noise2D( ( vertex.x / 500 ), this.time / 100 + ( this.index * 2 ) ) + 5
        vertex.y = ( noise * pos * ((this.index + 1) * 8));
      }.bind( this )
    );
  }
}

export default Peak;
