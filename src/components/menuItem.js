import React from "react";
import MenuShader from "../util/menuShader"

class MenuItem extends React.Component{
  constructor( props ){
    super();
    this.state = {
      index: props.index,
      open: props.open,
      menuItem: props.menuItem,
      forceClose: props.forceClose
    }
  }

  componentWillReceiveProps( props ){
    this.setState({
      open: props.open,
      forceClose: props.forceClose
    }, this.animate.bind( this ))
  }

  componentDidMount(){
    let img = new Image();
    img.src = this.state.menuItem.img
    let ms = new MenuShader( this.refs.canvas, this.state.index, this.state.menuItem )
    img.onload = ms.imageLoaded.bind( ms )
    this.setState({ menuShader: ms }, this.animate.bind( this ))
  }

  animate(){
    if( this.state.open ){
      this.state.menuShader.animate()
      window.requestAnimationFrame( this.animate.bind( this ) )
    }
  }

  onMouseEnter(){
    if( this.state.menuShader ){
      this.state.menuShader.onMouseOver()
    }
  }

  onMouseLeave(){
    if( this.state.menuShader ){
      this.state.menuShader.onMouseLeave()
    }
  }

  onMouseMove( e ){
    this.setState({ mousePos: { x: e.clientX, y: e.clientY } });
    if( this.state.menuShader ){
      this.state.menuShader.onMouseMove( { x: e.clientX, y: e.clientY } );
    }
  }

  getStyle(){
    let width
    if( this.state.open ){
      width = "100vw"
    }else{
      width = "0vw"
    }
    if( !this.state.forceClose ){
      return({
        top: `${ this.state.index * ( window.innerHeight / 3 ) }px`,
        height: `${ window.innerHeight / 3 }px`,
        width: width,
        transitionDelay: `${ this.state.index / 4 }s`
      })
    }else{
      return({
        top: `${ this.state.index * ( window.innerHeight / 3 ) }px`,
        height: `${ window.innerHeight / 3 }px`,
        width: width,
        transition: "0s"
      })
    }
  }

  onMouseDown(){
    this.props.clickMenuItem( this.state.menuItem.name )
  }



  onMouseUp(){
    this.props.unClickMenuItem()
  }

  render(){
    return(
      <div className = "menuItem" style = { this.getStyle() } onMouseEnter = { this.onMouseEnter.bind( this ) } onMouseLeave = { this.onMouseLeave.bind( this ) } onMouseMove = { this.onMouseMove.bind( this ) } onMouseDown = { this.onMouseDown.bind( this ) } onMouseUp = { this.onMouseUp.bind( this ) }>
        <canvas style = {{ }} ref = "canvas"/>
      </div>
    )
  }
}

export default MenuItem
