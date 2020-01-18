import React from "react";
import GlslCanvas from "../util/GLSLCanvas/src/GlslCanvas.js";
import Timer from "../util/timer.js";
import Easing from "../util/easing"
import {withRouter} from 'react-router-dom';
const GenerateWord = require("../util/generateWordCanvas");

const LoadingWithProps = withRouter(props => <Loading {...props}/>);
class Loading extends React.Component{
  constructor( props ){
    super();
    this.state = {
      word: props.word,
      backgroundColor: props.backgroundColor,
      color: props.color,
      status: props.status,
      animating: props.animating,
      selectedProject: props.selectedProject,
      mouseDown: props.mouseDown
    }
    this.timer = new Timer( 0, .02, true );
    this.timer.addCallback( () => { this.pushProject( this.state.selectedProject ) } );
  }



  setupCanvas(){
    var string_frag_code = document.getElementById("loading__shader").innerHTML;
    let sandbox = new GlslCanvas( this.refs.canvas );
    sandbox.load(string_frag_code);
    this.sandbox = sandbox
  }

  componentWillReceiveProps( props ){
    let animating
    if( props.mouseDown === true || this.timer.getCount() > 0 ){
      animating = true
    }
    this.setState({
      word: props.word,
      backgroundColor: props.backgroundColor,
      color: props.color,
      status: props.status,
      animating: true,
      selectedProject: props.selectedProject,
      mouseDown: props.mouseDown,
    })

    if( props.selectedProject !== this.state.selectedProject ){
      this.timer.addCallback( () => { this.pushProject( props.selectedProject ) } )
    }
  }

  pushProject( project ){
    this.setState({ animating: false })
    window.cancelAnimationFrame( this.requestId )
    this.props.history.push( `/project/${ project.project.handle }` )
  }


  animate(){
    if( this.state.animating ){
      if( this.sandbox && this.state.selectedProject ){
        this.sandbox.setUniform("u_background", this.state.selectedProject.project.color.r / 255, this.state.selectedProject.project.color.g / 255, this.state.selectedProject.project.color.b / 255 );
      }
      let count = this.timer.getCount();
      if( this.state.mouseDown || count > .5 ){
        this.timer.countUp();
        this.sandbox.setUniform("u_mag", Easing.easeInOutCubic( count * 1));
      }else{
        this.timer.countDown();
        this.sandbox.setUniform("u_mag", Easing.easeInOutCubic( count * 1));
      }
      this.sandbox.render();
      this.requestId = window.requestAnimationFrame( this.animate.bind( this ) )
    }
  }

  componentDidMount(){
    this.setupCanvas();
    this.animate()
  }

  getStyle(){
    if( !this.state.animating ){
      return({
        display: "none",
        pointerEvents: "none"
      })
    }else{
      return({
        display: "block"
      })
    }
  }

  render(){
    return(
      <div className = "loading__wrapper" style = { this.getStyle() }>
        <canvas
          className = "loading__canvas"
          ref = "canvas"
          width = { window.innerWidth }
          height = { window.innerHeight }
          ></canvas>
      </div>
    )
  }
}

export default LoadingWithProps
