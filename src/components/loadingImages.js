import React from "react";
import Numbers from "../util/numbers"
const THREE = require("three");

class LoadingImages extends React.Component{
  constructor(){
    super();
    this.state = {
      loadingStatus: 0
    }
    this.time = 0;
    this.tens = []
    this.status = 0
  }

  componentDidMount(){
    this.three = {};
    this.three.renderer = new THREE.WebGLRenderer({
      canvas: this.refs.canvas,
      antialias: true,
      alpha: true
    });
    let renderer = this.three.renderer;
    window.renderer = renderer;
    renderer.shadowMapCullFace = THREE.CullFaceBack;
    renderer.setClearColor( "white", 1 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( this.refs.canvas.offsetWidth, this.refs.canvas.offsetHeight );
    this.three.camera = new THREE.PerspectiveCamera( 35, this.refs.canvas.offsetWidth / this.refs.canvas.offsetHeight, 0.1, 5000 );
    this.three.scene = new THREE.Scene();
    this.three.clock = new THREE.Clock();

    // let mat = new THREE.MeshBasicMaterial( { color: "green" } );
    // var geometry = new THREE.BoxGeometry( 200, 200, 32, 32 );

    // window.mesh = new THREE.Mesh( geometry, mat )
    // window.mesh.position.set( 0, 0, -1000 )
    // this.three.scene.add( window.mesh )
    this.three.renderer.render( this.three.scene, this.three.camera )
    window.three = this.three;

    this.props.addAnimationListener( this.animate.bind( this ) );
    this.setupNumbers()
  }

  setupNumbers(){
    for( var i = 0; i < 3; i++ ){
      let num = new Numbers( i, this.state.loadingStatus, this.three )
      this.tens.push( num )
    }
  }

  updateStatus( status ){
    this.tens.forEach(
      ( ten ) => {
        ten.updateStatus( Math.floor(status) )
      }
    );
  }

  animate(){
    this.tens.forEach(
      ( ten, index ) => {
        ten.animate.bind( ten )()
      }
    );
    this.status+= .01;
    this.updateStatus( this.status )
    this.three.renderer.render( this.three.scene, this.three.camera )
  }

  render(){
    return(
      <canvas ref = "canvas" style = {{ width: "100vw", height: "100vh" }}/>
    )
  }
}

export default LoadingImages;
