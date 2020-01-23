import React from "react";
import Line from "../util/line.js"

const THREE = require("three");


class TextWarp extends React.Component{
  constructor( props ){
    super();
    this.state = {
      text: props.text
    }
    this.time = 0;
  }

  componentDidMount(){
    this.three = {};
    this.three.renderer = new THREE.WebGLRenderer({
      canvas: this.refs.canvas,
      antialias: true,
      alpha: true
    });
    let renderer = this.three.renderer;
    renderer.setClearColor( 0x000000, 0 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( this.refs.canvas.offsetWidth, this.refs.canvas.offsetHeight );
    this.three.camera = new THREE.PerspectiveCamera( 35, this.refs.canvas.offsetWidth / this.refs.canvas.offsetHeight, 0.1, 5000 );
    this.three.scene = new THREE.Scene();
    this.three.clock = new THREE.Clock();
    let geo = new THREE.SphereGeometry( 200, 32, 32 );
    let material = new THREE.MeshBasicMaterial(  "red" )
    this.three.mesh = new THREE.Mesh( geo, material );
    this.three.mesh.position.set( 0, 0, -1000 );
    material.opacity = 0;
    // this.three.scene.add( this.three.mesh )
    window.mesh = this.three.mesh

    this.setupWords()
    this.props.addAnimationListener( this.animate.bind( this ) )
  }

  setupWords(){
    let lines = this.state.text.split(/\r?\n/);
    this.lines = [];
    lines.forEach(
      ( str, index ) => {
        let line = new Line( str, index, this.three )
        this.lines.push( line )
      }
    );
  }

  animate(){
    if( this.three.renderer ){
      this.time ++;
      this.three.renderer.render( this.three.scene, this.three.camera );
      this.lines.forEach( ( line ) => { line.animate.bind( line )( this.time ); } )
    }
  }

  render(){
    return(
      <div>
        <canvas ref = "canvas" style = {{ width: "100vw", height: "100vh", position: "fixed", top: "0px", left: "0px", pointerEvents: "none"}}/>
      </div>
    )
  }
}

export default TextWarp
