import React from "react";
import LoadingImages from "./loadingImages"

class Landing extends React.Component{
  constructor(){
    super();
    this.state = {

    }
    this.listeners = []
  }

  getMessagingStyle(){
    if( this.state.landPercentage === 100 ){

    }
  }

  componentDidMount(){
    this.animate.bind( this )()
  }

  animate(){
    this.listeners.forEach(
      ( func ) => { func() }
    );
    window.requestAnimationFrame(
      this.animate.bind( this )
    );
  }

  addAnimationListener( func ){
    this.listeners.push( func );
  }

  render(){
    return(
      <div>
        <LoadingImages addAnimationListener = { this.addAnimationListener.bind( this ) }/>
        <div className = "landing-messaging" style = { this.getMessagingStyle() }>
          <div className = "landing-icom"></div>
          <h3> Scroll Down </h3>
        </div>
      </div>
    )
  }
}

export default Landing
