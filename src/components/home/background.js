import React from "react";
import Easing from "../../util/easing"
import GlslCanvas from "../../util/GLSLCanvas/src/GlslCanvas.js";


class Background extends React.Component{
  constructor( props ){
    super();
    this.state = {
      currentBackgroundColor: props.currentBackgroundColor,
      nextBackgroundColor: props.nextBackgroundColor
    }
  }

  componentWillReceiveProps( props ){
    this.setState({
      currentBackgroundColor: props.currentBackgroundColor,
      nextBackgroundColor: props.nextBackgroundColor
    })
  }

  componentDidMount(){
    window.setTimeout(
      () => {
        this.setState({ loaded: true })
      }, 200
    );
    this.props.assignBackgroundAnimation( this.animate.bind( this ) )
    var string_frag_code = document.getElementById("background__shader").innerHTML;
    let sandbox = new GlslCanvas( this.refs.canvas );
    sandbox.load(string_frag_code);
    sandbox.setUniform("u_next", this.state.currentBackgroundColor.r / 255, this.state.currentBackgroundColor.g / 255, this.state.currentBackgroundColor.b / 255 );
    sandbox.setUniform("u_background", this.state.nextBackgroundColor.r / 255, this.state.nextBackgroundColor.g / 255, this.state.nextBackgroundColor.b / 255 );
    sandbox.setUniform("u_mag", Easing.easeInOutCubic( 0 ));
    this.sandbox = sandbox
  }

  animate( timer ){
    if( this.state.currentBackgroundColor && this.state.nextBackgroundColor ){
      this.sandbox.setUniform("u_next", this.state.currentBackgroundColor.r / 255, this.state.currentBackgroundColor.g / 255, this.state.currentBackgroundColor.b / 255 );
      this.sandbox.setUniform("u_background", this.state.nextBackgroundColor.r / 255, this.state.nextBackgroundColor.g / 255, this.state.nextBackgroundColor.b / 255 );
      let count = timer.getCount();
      this.sandbox.setUniform("u_mag", Easing.easeInOutQuint( count * 1));
      this.sandbox.render();
    }
  }

  getStyle(){
    if( !this.state.currentBackgroundColor || !this.state.nextBackgroundColor || !this.state.loaded ){
      return({
        opacity: 0
      })
    }else{
    }
  }

  render(){
    return(
      <div className = "projects__background__canvas" style = { this.getStyle() }>
        <canvas ref = "canvas"
        width = { window.innerWidth / 2 }
        height = { window.innerHeight / 2 }/>
      </div>
    )
  }
}

export default Background
