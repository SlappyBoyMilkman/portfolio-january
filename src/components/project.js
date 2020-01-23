import React from "react";
import {withRouter} from 'react-router-dom';
import Menu from "./menu";
import AOS from "./aos"
import ProjectImage from "./projectImage"
import Loading from "./loadingTwo"
import Title from "./title.js"
const ProjectWithProps = withRouter(props => <Project {...props}/>);


const projectData = require("../data/projects.js")
const throttle = require("../util/throttle")

class Project extends React.Component{
  constructor( props ){
    super();
    let handle = props.match.params.projectHandle;
    let projects = projectData

    let project = this.getProject( projects, handle )
    this.state = {
      project: project,
      projects: projects,
      scrollTop: 0,
      loadingAnimating: false
    }

    this.animations = []

  }

  componentDidMount(){
    this.handle = throttle( () => { this.scroll.bind( this )() }, 50, {} );
    document.addEventListener( "scroll", this.handle )
    window.scrollTo( 0, 0 );
  }

  animate(){

  }

  addAnimationListener( func ){
    this.animations.push( func );
  }

  clickIndex(){
    this.setState({ loadingAnimating: true })
  }

  componentWillUnmount(){
    document.removeEventListener( "scroll", this.handle )
  }

  clickMenuItem( page ){
    this.setState({ loadingColor: page.color, loadingRoute: page.url, loadingAnimating: true })
  }

  scroll(){
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    this.setState({ scrollTop: scrollTop })
  }

  getProject( projects, handle ){
    let project;
    projects.forEach(
      ( isProject, index ) => {
        if( handle === isProject.handle ){
          project = isProject
        }
      }
    );

    return project;
  }

  getStyle(){
    let bcol = `rgb( ${ this.state.project.color.r}, ${this.state.project.color.g}, ${this.state.project.color.b } )`;
    let col = `rgb( ${ this.state.project.backgroundColor.r}, ${this.state.project.backgroundColor.g}, ${this.state.project.backgroundColor.b } )`;
    return({
      color: col,
      backgroundColor: bcol,
      minWidth: "100vw",
      minHeight:"100vh"
    })
  }

  images(){
    let images = this.state.project.images ? this.state.project.images.map(
      ( image ) => {
        return(
          <AOS scrollTop = { this.state.scrollTop } className = "project__image" offset = { 100 }>
            <div className = "grid">
              <div className = "grid__item one-whole">
                <ProjectImage project = { this.state.project } image = { image }/>
              </div>
            </div>
          </AOS>
        )
      }
    ): undefined;
    return images;
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
    return(
      <div className = "project" style = { this.getStyle() }>
        <Menu
        projects = { this.state.projects }
        selectedProject = { this.state.project }
        isProject = { true }
        clickMenuItem = { this.clickMenuItem.bind( this ) }
        >
        </Menu>
        <div className = "projects__wrap">
          <div className = "grid" >
            <div className = "one-whole grid__item">
              <div className = "project__return" onClick = { this.clickIndex.bind( this ) }>&#x3c;&nbsp;Index</div>
            </div>
          </div>
          <AOS scrollTop = { this.state.scrollTop } className = "project__image" offset = { 100 }>
            <div className = "grid" style = {{ pointerEvents: "none" }}>
              <div className = "grid__item one-whole">
                <ProjectImage project = { this.state.project } image = { this.state.project.img }/>
              </div>
            </div>
          </AOS>
        </div>
          <Title
            addAnimationListener = { this.addAnimationListener.bind( this ) }
            title = { this.state.project.name }
            project = { this.state.project }
          />
        <div className = "projects__wrap">
          <AOS scrollTop = { this.state.scrollTop } className = "project__image" offset = { 100 }>
            <div className = "grid">
              <div className = "grid__item three-quarters">
                <p className = "description" dangerouslySetInnerHTML={{ __html: this.state.project.description }}></p>
              </div>
              <div className = "grid__item one-quarter">
                <div className = "grid info">
                  <div className = "grid__item one-whole roles">
                    <h3> Roles </h3>
                    <ul>
                      <li>Design</li>
                      <li>Art Direction</li>
                      <li>Typography Development</li>
                      <li>ReactJS Development</li>
                      <li>CSS Development</li>
                    </ul>
                  </div>
                  <div className = "grid__item one-whole stack">
                    <h3> Roles </h3>
                    <ul>
                      <li>Design</li>
                      <li>Art Direction</li>
                      <li>Typography Development</li>
                      <li>ReactJS Development</li>
                      <li>CSS Development</li>
                    </ul>
                  </div>
                  <div className = "grid__item one-whole">
                  </div>
                </div>
              </div>
            </div>
          </AOS>
          {
            this.images()
          }
        </div>
        <Loading
          color = { this.getColor() }
          route = { this.getRoute() }
          animating = { this.state.loadingAnimating }
        />
      </div>
    )
  }
}

export default ProjectWithProps
