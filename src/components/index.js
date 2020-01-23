import React from 'react';
import Mouse from "./mouse";
import About from "./about"
import Projects from "./projects";
import Menu from "./menu"
import Contact from "./contact";
import Project from "./project"
import Loading from "./loadingTwo"
import {withRouter} from 'react-router-dom';

const projectData = require("../data/projects.js")

const IndexWithProps = withRouter(props => <Index {...props}/>);
class Index extends React.Component{
  constructor( props ){
    super();
    let menuItems = [
      {
        name: "Projects",
        img: "./cornnut.png",
        color: [ 1 ,.2 ,.4  ]
      },
      {
        name: "About",
        img: "./cornnut.png",
        color: [ 0, 0, 1 ]
      },
      {
        name: "Contact",
        img: "./cornnut.png",
        color: [ 0, 1, 1 ]
      },
    ]

    let projects = projectData;

    this.state = {
      clickTimer: 0,
      menuItems: menuItems,
      menuOpen: false,
      selectedPage: menuItems[0].name,
      projects: projects,
      animating: {"projects": true}
    }
  }

  componentWillReceiveProps( props ){

  }

  addAnimating( name ){
    let animating = this.state.animating;
    animating[ name ] = true;
    this.setState({ animating: animating })
  }

  changeAnimating( name ){
    this.clearAnimating( () => { this.addAnimating.bind( this )( name ) } );
  }

  removeFromAnimating( name ){
    let animating = this.state.animating;
    animating[ name ] = false;
    this.setState({ animating: animating })
  }

  clearAnimating( callback ){
    let animating = {};
    this.setState({ animating: animating }, callback)
  }

  passForceClose( forceClose ){
    this.forceCloseMenu = forceClose
  }

  toggleMenu(){
    this.setState({ menuOpen: !this.state.menuOpen })
  }

  clickProject( project ){
    this.setState({
      selectedPage: "Project",
      clickedProject: this.state.selectedProject,
      animating: "loading"
    })
  }

  clickMenuItem( page ){
    this.setState({ loadingColor: page.color, loadingRoute: page.url, loadingAnimating: true, animating: false })
  }


  unClickMenuItem(){
    if( this.state.clickTimer < .2 ){
      this.setState({ menuItemClicked: undefined })
    }
  }

  closeMenu(){
    this.setState({ menuOpen: false })
  }

  projectMouseDown(){
    let animating = this.state.animating;
    animating["loading"] = true;
    this.setState({
      selectedPage: "Project",
      clickedProject: this.state.selectedProject,
      animating: animating,
      loadingMouseDown: true
    })
  }

  projectMouseUp(){
    let animating = this.state.animating;
    animating["loading"] = true;
    this.setState({
      selectedPage: "Project",
      clickedProject: this.state.selectedProject,
      animating: animating,
      loadingMouseDown: false
    })
  }

  menu(){
    if( true === false ){
      return(
        <Menu
          toggleMenu = { this.toggleMenu.bind( this ) }
          passForceClose = { this.passForceClose.bind( this ) }
          menuOpen = { this.state.menuOpen }
          menuItems = { this.state.menuItems }
          unClickMenuItem = { this.unClickMenuItem.bind( this ) }
          clickMenuItem = { this.clickMenuItem.bind( this ) }
        />
      )
    }
  }

  changeSelected( project ){
    this.setState({ selectedProject: project })
  }

  isAnimating( name ){
    if( this.state.animating[ name ] === true ){
      return true
    }else{
      return false
    }
  }

  componentWillUnmount(){
    this.setState({ animating: false })
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

  render(){
    return (
      <div className="App">
          <div className = "fixed-top graphik"></div>
          {
            this.menu()
          }
          <Menu
            selectedProject = { this.state.selectedProject }
            projects = { this.state.projects }
            isProject = { false }
            clickMenuItem = { this.clickMenuItem.bind( this ) }
          />
          <Mouse/>
          <Projects
          changeSelected = { this.changeSelected.bind( this ) }
          menuItems = { this.state.menuItems }
          menuItemClicked = { this.state.menuItemClicked }
          clickTimer = { this.state.clickTimer }
          projects = { this.state.projects }
          menuOpen = { this.state.menuOpen }
          animating = { this.isAnimating( "projects" ) }
          clickProject = { this.clickProject.bind( this ) }
          selectedPage = { this.state.selectedPage } />
          <Loading
            color = { this.getColor() }
            route = { this.getRoute() }
            animating = { this.state.loadingAnimating }
          />
      </div>
    );
  }
}

export default IndexWithProps;
