const THREE = require( "three" )

class ProjectCanvas{
  constructor( canvas, settings ){
    this.canvas = canvas;
    this.settings = settings;
    this.setupTHREE()
    this.setup();
  }

  setupTHREE(){
    let renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true });
    let color = `rgb( ${ parseInt(this.settings.color[0] * 255) }, ${ parseInt(this.settings.color[1] * 255)}, ${ parseInt(this.settings.color[2] * 255) } )`;

    renderer.setClearColor( color )
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );

    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, .1, 4000 )

    this.three = {
      scene: scene,
      renderer: renderer,
      camera: camera
    }
    renderer.render( scene, camera );

  }

  setup(){

  }
}

export default ProjectCanvas;
