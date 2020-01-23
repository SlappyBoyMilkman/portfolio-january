import Timer from "../util/timer.js"
const THREE = require("three");
const Noise = require("simplex-noise");
const WebFont = require( "webfontloader" );

class Line{
  constructor( string, index, three ){
    this.string = string.replace(/\s\s+/g, ' ').toUpperCase();
    this.index = index;
    this.three = three;
    this.p = document.createElement( "p" )
    this.p.innerText = this.string;
    this.p.fontFamily = "graphik"
    this.p.style.display = "inline";
    this.p.style.fontSize = "15vh";
    this.p.style.whiteSpace = "nowrap";
    this.p.style.opacity = 0;
    this.p.style.visibility = "hidden";
    document.getElementById( "append-container" ).appendChild( this.p )
    this.width = this.p.offsetWidth
    this.fontFamily = "graphik"
    this.height = this.p.offsetHeight
    this.aspect = this.p.width / this.p.height
    this.p.remove();
    this.loadFont( this, this.setupThree.bind( this ) )
    this.noise = new Noise()
    this.timer = new Timer( .8, .02, true )

  }

  loadFont( that, callback ){
    if( callback ){
      let config = {
        custom: {
          families: [this.fontFamily],
        },
        fontactive: callback
      }
      let wf =  WebFont.load( config );
    }else{
      let config = {
        custom: {
          families: [this.fontFamily],
        },
        fontactive: this.fontLoaded.bind( that )
      }
      let wf =  WebFont.load( config );
    }
  }

  setupThree(){

    let canvas = document.createElement( "canvas" );
    canvas.width = this.width * 1.6;
    canvas.height = this.height;
    let ctx = canvas.getContext( "2d" );
    ctx.font = `15vh ${ this.fontFamily }`;
    ctx.fillStyle = "red"
    // ctx.fillRect( 0, 0, this.width, this.height );
    ctx.fillStyle = `rgb( 255, 200, 200 )`;
    canvas.style = { position: "fixed", top: "0px", left: "0px", zIndex: "100000000" }
    canvas.style.position =  "fixed";
    canvas.style.zIndex =  10000;
    canvas.style.top =  "0px";
    canvas.style.left =  "0px";
    canvas.style.backgroundColor =  "blue";
    ctx.fillText( this.string, this.width * .25, this.height * .8 );
    var texture = new THREE.Texture( canvas );
    texture.needsUpdate = true;
    let box = new THREE.PlaneGeometry( canvas.width, canvas.height, 80 );
    var material = new THREE.MeshBasicMaterial( { map: texture, transparent: true, side: THREE.DoubleSide, color: "white" } );
    this.mesh = new THREE.Mesh( box, material );
    this.mesh.position.set( 0, 200 + (this.index * .55 * -this.height), -1000 );
    material.depthTest = true
    material.depthWrite = false;
    material.opacity = 0;
    this.mesh.scale.set( .6, .6, .6 )
    this.three.scene.fog = new THREE.Fog( "rgb( 2, 27, 2 )", 1200, 2000 );
    this.three.scene.add( this.mesh )
  }

  animate( time ){
    if( this.mesh ){
      this.mesh.geometry.verticesNeedUpdate = true
      this.mesh.material.opacity = this.timer.getCount();
      this.timer.countUp();
      this.mesh.geometry.vertices.forEach(
        ( vertex ) => {
          var noise = this.noise.noise2D( 1, ((vertex.x) / 1000) + ( time / 600 ) );
          vertex.z = (noise * 400) - 1000
          // this.mesh.renderOrder = this.index;

          // vertex.position.z = vertex.position.x
        }
      )
    }
  }
}

export default Line;
