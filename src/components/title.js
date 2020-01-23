import React from "react";
import Word from "../util/titleWord"
const THREE = require("three");

class Title extends React.Component{
  constructor( props ){
    super();
    this.state = {
      title: props.title,
      project: props.project
    }
    this.time = 0
  }

  componentWillReceiveProps( props ){
    this.setState({
      scrollTop: props.scrollTop
    })
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
    renderer.setClearColor( 0x000000, 0 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( this.refs.canvas.offsetWidth, this.refs.canvas.offsetHeight );
    this.three.camera = new THREE.PerspectiveCamera( 35, this.refs.canvas.offsetWidth / this.refs.canvas.offsetHeight, 0.1, 5000 );
    this.three.scene = new THREE.Scene();
    this.three.clock = new THREE.Clock();
    this.setupWords()

  }

  setupWords(){
    let lines = this.state.title.split(" ");
    this.lines = [];
    lines.forEach(
      ( str, index ) => {
        let line = new Word( str, index, this.three, this.state.project )
        this.lines.push( line )
      }
    );
    this.animate.bind( this )()
  }

  animate(){
    if( this.three.renderer ){
      this.time ++;
      this.three.renderer.render( this.three.scene, this.three.camera );
      this.lines.forEach( ( line ) => { line.animate.bind( line )( this.time ); } )
    }
    window.requestAnimationFrame( this.animate.bind( this ) )
  }

  getStyle(){
    return({
      height: this.state.project.titleSize
    })
  }

  render(){
    return(
      <div className = "project__title" >
        <canvas ref = "canvas" style = { this.getStyle() }/>
      </div>
    )
  }
}

export default Title
