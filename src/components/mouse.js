import React from "react";

class Mouse extends React.Component{
  constructor(){
    super();
    this.state = {

    }
  }

  componentDidMount(){
    document.body.addEventListener( "mousemove", this.mouseOver.bind( this ) )
  }

  getCursorStyle(){
    if( this.state.mouse ){
      return({
        top: this.state.mouse.y + "px",
        left: this.state.mouse.x + "px"
      })
    }
  }

  mouseOver( e ){
    this.setState({
      mouse: { x: e.clientX, y: e.clientY }
    })
  }

  render(){
    return(
      <div>
        <div className = "cursor" style = { this.getCursorStyle() }>
          <canvas ref = "canvas"/>
        </div>
      </div>
    )
  }
}

export default Mouse;
