import React from "react";

class AOS extends React.Component{
  constructor( props ){
    super();
    this.state = {
      scrolled: false,
      scrollTop: props.scrollTop,
      offset: props.offset,
      className: props.className
    }

  }

  componentDidMount(){
    if( this.refs.aos.offsetTop - window.innerHeight < this.state.scrollTop + this.state.offset ){
      this.setState({ scrolled: true })
    }
  }

  componentWillReceiveProps( props ){
    if( this.refs.aos.offsetTop - window.innerHeight < props.scrollTop + this.state.offset ){
      this.setState({ scrolled: true })
    }
  }

  getClassName(){
    if( this.state.scrolled ){
      return `${ this.state.className }  ${ this.state.className }--scrolled`
    }else{
      return `${ this.state.className }`
    }
  }

  render(){
    return(
      <div className = "aos" className = { this.getClassName() } ref = "aos">
        {
          this.props.children
        }
      </div>
    )
  }
}

export default AOS
