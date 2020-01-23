import React from "react";
import Menu from "./menu";
import Loading from "./loadingTwo"
import Background from "./home/background"
import Timer from "../util/timer.js"
import TextWarp from "./textWarp"

const projectData = require("../data/projects.js")
const pages = require("../data/pages.js")


class Projects extends React.Component{
  constructor(){
    super();
    let page = pages[2]
    let projects = projectData
    let project = this.getProject( pages, page )

    this.state = {
      projects: projects,
      project: project,
      isOtherPage: false,
      page: page,
      currentBackgroundColor: { r: 255, g: 255, b: 255 },
      nextBackgroundColor: page.color
    }
    this.listeners = [];
    this.backgroundTimer = new Timer( 0, .01, true )
  }

  addAnimationListener( func ){
    this.listeners.push( func )
  }

  getProject( projects, page ){
    return {
      name: "Wild One",
      backgroundColor: page.color,
      color: page.backgroundColor
    }
  }

  componentDidMount(){
    this.setState({ isOtherPage: {
        color: this.state.page.backgroundColor,
        display: true
     }
   }, this.animate.bind( this ))
  }

  animate(){
    if( this.backgroundTimer.getCount() !== 1 ){
      this.backgroundTimer.countUp();
      this.backgroundAnimation( this.backgroundTimer );
    }
    this.listeners.forEach( ( func ) => { func() } );
    window.requestAnimationFrame( this.animate.bind( this ) );
  }

  clickMenuItem( page ){
    this.state.isOtherPage.display = false
    this.setState({
      loadingColor: page.color,
      loadingRoute: page.url,
      loadingAnimating: true,
      isOtherPage: this.state.isOtherPage
    })
  }

  getColor(){
    if( !this.state.loadingColor ){
      return({ r: 255, g: 255, b: 255 })
    }else{
      return( this.state.loadingColor )
    }
  }

  getRoute(){
    if( !this.state.loadingRoute ){
      return("/index")
    }else{
      return this.state.loadingRoute
    }
  }

  assignBackgroundAnimation( func ){
    this.backgroundAnimation = func;
  }

  menu(){
    return(
      <Menu
      projects = { this.state.projects }
      selectedProject = { this.state.project }
      isProject = { false }
      isOtherPage = { this.state.isOtherPage }
      clickMenuItem = { this.clickMenuItem.bind( this ) }
      >
      </Menu>
    )

  }

  render(){
    return(
      <div>
        {
          this.menu()
        }
        <Loading
          color = { this.getColor() }
          route = { this.getRoute() }
          animating = { this.state.loadingAnimating }
        />
        <Background
          assignBackgroundAnimation = { this.assignBackgroundAnimation.bind( this ) }
          currentBackgroundColor = { this.state.currentBackgroundColor }
          nextBackgroundColor = { this.state.nextBackgroundColor }
        />
        <div id = "append-container"></div>
        <TextWarp
          addAnimationListener = { this.addAnimationListener.bind( this ) }
          text = {
            `Oscar Robert is a designer / artist
            He has a condition where he
            talks about himself in
            the third person. Nobody is as
            smart as he thinks he is.
            He a smart ass `
          }
        />
      </div>
    )
  }
}

export default Projects
