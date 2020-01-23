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
      route: props.route,
      animating: props.animating,
      color: props.color
    }
    this.timer = new Timer( 0, .02, true );
    this.timer.addCallback( () => { this.pushRoute.bind( this )(  ) } );
  }

  componentWillReceiveProps( props ){
    if( props.animating === true ){
      this.setState({
        animating: props.animating,
        route: props.route
      }, this.animate.bind( this ))
    }else{
      this.setState({ animating: props.animating, route: props.route })
    }
  }

  componentWillUnmount(){
    this.animate = function(){
      
    }
  }

  animate(){
    if( this.state.animating ){
      if( this.sandbox ){
        console.log( "animating" )
        this.sandbox.setUniform("u_background", this.state.color.r / 255, this.state.color.g / 255, this.state.color.b / 255 );
        let count = this.timer.getCount();
        this.timer.countUp();
        this.sandbox.setUniform("u_mag", Easing.easeInOutCubic( count * 1));
        this.sandbox.render();
        this.requestId = window.requestAnimationFrame( this.animate.bind( this ) )
      }
    }
  }

  componentDidMount(){
    this.setupCanvas();
  }

  setupCanvas(){
    var string_frag_code = document.getElementById("loading__shader").innerHTML;
    let sandbox = new GlslCanvas( this.refs.canvas );
    sandbox.load(string_frag_code);
    this.sandbox = sandbox
  }

  pushRoute(){
    window.cancelAnimationFrame( this.requestId )
    this.props.history.push( this.state.route )
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
          ref = "canvas"
          width = { window.innerWidth }
          height = { window.innerHeight }
        />
      </div>
    )
  }
}

export default LoadingWithProps
