import React from "react";
import Hamburger from "./menu/hamburger"
import Shelf from "./shelf"

class Menu extends React.Component{
  constructor( props ){
    String.prototype.handleize = function() {
      let str = this.toLowerCase();
      var toReplace = ['"', "'", "\\", "(", ")", "[", "]"];
      for (var i = 0; i < toReplace.length; ++i) {
          str = str.replace(toReplace[i], "");
      }
      str = str.replace(/\W+/g, "-");
      if (str.charAt(str.length - 1) == "-") {
          str = str.replace(/-+\z/, "");
      }
      if (str.charAt(0) == "-") {
          str = str.replace(/\A-+/, "");
      }
      return str
    };
    super();
    this.state = {
      projects: props.projects,
      selectedProject: props.selectedProject,
      isProject: props.isProject,
      isOtherPage: props.isOtherPage,
      menuOpen: false
    }
  }

  componentWillReceiveProps( props ){
    this.setState({
      projects: props.projects,
      selectedProject: props.selectedProject,
      isOtherPage: props.isOtherPage
    })
  }

  openMenu(){
    this.setState({ menuOpen: true })
  }

  closeMenu(){
    this.setState({ menuOpen: false })
  }

  toggleMenu(){
    this.setState({ menuOpen: !this.state.menuOpen })
  }

  getOverlayStyle(){
    let backgroundColor = this.state.selectedProject && this.state.selectedProject.blackMenu ? "black": "white";
    let color = this.state.selectedProject && this.state.selectedProject.blackMenu ? "white": "black";
    if( this.state.menuOpen ){
      return({
        opacity: 1,
        pointerEvents: "painted",
        color: color,
        backgroundColor: backgroundColor
      })
    }else{
      return({
        opacity: 0,
        pointerEvents: "none",
        transitionDelay: ".5s",
        color: color,
        backgroundColor: backgroundColor
      })
    }
  }

  getNavClassName(){
    if( this.state.menuOpen ){
      return "nav nav--open"
    }else{
      return "nav"
    }
  }

  clickMenuItem( page ){
    this.setState({ menuOpen: false },
      () => {
        window.setTimeout(
          () => {
            this.props.clickMenuItem( page )
          }, 1000
        );
      }
    )
  }

  render(){
    return(
      <div className = { this.getNavClassName() }>
        <Hamburger
        selectedProject = { this.state.selectedProject }
        projects = { this.state.projects }
        isProject = { this.state.isProject }
        toggleMenu = { this.toggleMenu.bind( this ) }
        menuOpen = { this.state.menuOpen }
        isOtherPage = { this.state.isOtherPage }
        />
        <Shelf
          menuOpen = {  this.state.menuOpen }
          clickMenuItem = { this.clickMenuItem.bind( this ) }
        />
        <div className = "menu__overlay" style = { this.getOverlayStyle() }></div>
      </div>
    )
  }
}

export default Menu
