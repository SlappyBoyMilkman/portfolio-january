import React from "react";

class ProjectImage extends React.Component{
  constructor(){
    super();
    this.state = {
      loaded: false,
      time: false
    }
  }

  componentDidMount(){
    let image = new Image();
    image.src = this.props.image
    image.onload = () => { this.setState({ loaded: true }) }
    window.setTimeout( this.setTime.bind( this ), 1000 )
  }

  setTime(){
    this.setState({ time: true })
  }

  getPlaceholderStyle(){
    if( this.refs.image ){
      return({
        width: this.refs.image.offsetWidth,
        height: this.refs.image.offsetHeight,
        backgroundColor: `rgb( ${ this.props.project.backgroundColor.r}, ${this.props.project.backgroundColor.g}, ${this.props.project.backgroundColor.b } )`
      })
    }else{
      return({
        backgroundColor: `rgb( ${ this.props.project.backgroundColor.r}, ${this.props.project.backgroundColor.g}, ${this.props.project.backgroundColor.b } )`
      })
    }
  }

  getImageStyle(){
    if( this.state.loaded && this.state.time ){
      return({
        opacity: 1
      })
    }else{
      return({
        opacity: 0
      })
    }
  }

  render(){
    return(
      <div style = { this.getPlaceholderStyle() } className = "placeholder-image">
        <img src = { this.props.image } style = { this.getImageStyle() } ref = "image"/>
      </div>
    )
  }
}

export default ProjectImage
