import React from "react";
import Easing from "../util/easing"
import Project from "./project"
import Scene from "../util/scene"
import Timeline from "../util/timeline"
import Interface from "./home/interface"
import Arrows from "./home/arrows"
import Loading from "./loading.js"
import Timer from "../util/timer.js"
import Background from "./home/background"
const throttle = require("../util/throttle")

class Projects extends React.Component{
  constructor( props ){
    super();
    this.state = {
      menuItems: props.menuItems,
      clickTimer: props.clickTimer,
      selectedPage: props.selectedPage,
      projectsEaseIn: 0,
      menuOpen: props.menuOpen,
      settings: props.menuItems[0],
      projects: props.projects,
      nextBackgroundColor: { r: 255, g: 255, b: 255 },
      animating: props.animating,
      loadingAnimating: props.loadingAnimating,
      currentBackgroundColor: { r: 255, g: 255, b: 255 },
      scrolled: 0
    }

    this.backgroundTimer = new Timer( 0, .015, true )

  }

  componentWillReceiveProps( props ){
    if( this.state.overlayCanvas && this.state.clickTime !== props.clickTimer ){
      this.state.overlayCanvas.updateClickTimer( props.clickTimer )
    }

   this.setState({
       clickTimer: props.clickTimer,
       menuOpen: props.menuOpen,
       animating: props.animating,
    })

    if( props.menuOpen ){
      this.state.scene.stopAnimating();
    }
  }

  changeSelected( project ){
    this.props.changeSelected( project );
    let currentBackgroundColor = this.state.selectedProject && this.state.selectedProject.project ? this.state.selectedProject.project.backgroundColor : { r: 255, g: 255, b: 255 }
    this.setState({
      currentBackgroundColor: currentBackgroundColor,
      selectedProject: project,
      nextBackgroundColor: project.project.backgroundColor
    }, this.scrollEnd)
    this.backgroundTimer.resetTimer();
  }

  componentDidMount(){
    this.count = 0
    this.images = [];
    this.state.projects.forEach(
      ( project ) => {
        let image = new Image();
        image.src = project.icon
        image.onload = () => { this.checkLoad( image, project ) }
      }
    );
  }

  checkLoad( image, project ){
    this.count++;
    this.images.push( image );
    project.loaded_cover = image;

    if( this.count === this.state.projects.length ){
      this.imagesLoaded()
    }
  }

  componentWillUnmount(){
    document.removeEventListener( "scroll", this.handle )
    this.animate = function(){
    }
  }

  imagesLoaded(){
    this.handle = throttle( () => { this.scrollStart.bind( this )() }, 50, {} );
    document.addEventListener( "scroll", this.handle )
    let settings = {
      backgroundColor: `rgb( ${  parseInt(this.state.settings.color[0] * 255) }, ${  parseInt(this.state.settings.color[1] * 255)}, ${ parseInt(this.state.settings.color[2] * 255) } )`
    }

    let projectsSettings = {
      backgroundColor: `rgb( ${  parseInt(this.state.settings.color[0] * 255) }, ${  parseInt(this.state.settings.color[1] * 255)}, ${ parseInt(this.state.settings.color[2] * 255) } )`
    };
    let timeline = new Timeline( this.state.projects );
    let scene = new Scene( this.refs.projects, projectsSettings, this.state.projects, this.resetScroll.bind( this ), this );
    // scene.next = this.next.bind( this );
    // scene.prev = this.next.bind( this );
    scene.onSelectProject( this.selectProject.bind( this ) )
    this.setState({ scene: scene }, () => { this.state.scene.fadeIn(); this.animate() })
  }

  next( project ){
    // this.changeSelected( project )
  }

  prev(){
  }

  assignBackgroundAnimation( func ){
    this.backgroundAnimation = func;
  }

  animate(){
    if( !this.state.menuOpen && this.state.selectedPage === "Projects" ){
      if( this.state.scene ){
        if( this.state.animating && !this.state.loadingAnimating ){
          if( this.backgroundTimer.getCount() !== 1 ){
            this.backgroundTimer.countUp();
            this.backgroundAnimation( this.backgroundTimer );
          }
          this.state.scene.animate()
          window.requestAnimationFrame( this.animate.bind( this ) );
        }
      }
    }
  }

  selectProject( project ){
    this.setState({ selectedPage: project })
  }

  getStyle(){
    return({
      top: `-10%`
    })
  }

  mouseOver( e ){
    if( this.state.scene ){
      this.state.scene.updateMouse( { x: (e.clientX - (( window.innerWidth -  this.refs.projects.offsetWidth )  / 2))  / this.refs.projects.offsetWidth, y: (e.clientY - (( window.innerHeight -  this.refs.projects.offsetHeight )  / 2)) / this.refs.projects.offsetHeight } )
    }
  }

  updateScrolled(){
    let diff = this.state.scrolled
    this.state.scene.updateScrolled( this.state.scrolled );
  }

  scrollStart(){
    if( !this.state.locked ){
      var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
      if( this.scrollListener ){
        window.clearTimeout( this.scrollListener )
        this.setState({ scrolled: scrollTop - this.state.scrollStart }, this.updateScrolled.bind( this ))
      }else{
        this.setState({ scrollStart: scrollTop, scrolled: 0 }, this.updateScrolled.bind( this ))
      }
      this.scrollListener = window.setTimeout( this.scrollEnd.bind( this ), 100 )
    }
  }

  onClick( e ){
    this.props.clickProject();
  }

  onMouseUp(){
    this.setState({ mouseDown: false, animating: true }, this.animate.bind( this) )
  }

  onMouseDown(){
    this.setState({ mouseDown: true, animating: false } )
  }

  dragStart( e ){
    var img = new Image();
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBAAAACwAAAAAAQABAAACAkQBADs=';
    e.dataTransfer.setDragImage(img, 0, 0);
    var date = new Date();
    this.dragStartTime = date.getTime();
    if( !this.state.locked ){
      var dragStart = e.clientX;
      this.setState({ scrollStart: dragStart, dragging: true, mouseDown: false }, this.props.onMouse )
    }
  }

  drag( e ){
    e.preventDefault();
    if( !this.state.locked ){
      if( e.clientX !== 0 ){
        if( this.state.scene ){
          this.state.scene.updateMouse( { x: e.clientX / this.refs.projects.offsetWidth, y: e.clientY / this.refs.projects.offsetHeight } )
        }
        let diff = this.state.scrollStart - e.clientX
        this.setState({ scrolled: diff }, this.updateScrolled.bind( this ));
        }else{
          if( this.state.scene ){
            this.state.scene.updateMouse( { x: e.clientX / this.refs.projects.offsetWidth, y: e.clientY / this.refs.projects.offsetHeight } )
          }
        }
      }
  }

  dragEnd(){
    this.setState({ dragging: false, animating: true })
  }

  scrollEnd(){
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    this.setState({ scrollStart: undefined, locked: true, scrolled: 0 })
    window.scrollTo( 0, document.body.offsetHeight / 2 );
    window.setTimeout( () => { this.setState({ locked: false }) }, 600 );
    this.scrollListener = undefined
    window.clearTimeout( this.scrollListener )
  }

  resetScroll(){
    var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    this.setState({ scrollStart: scrollTop, scrolled: 0, locked: true }, this.scrollStart )
  }

  getProjectsStyle(){
    if( this.state.selectedPage === "Projects" ){
      return({
        backgroundColor: `rgb( ${ this.state.settings.color[0] * 255 }, ${ this.state.settings.color[1] * 255}, ${this.state.settings.color[2] * 255 } )`,
        display: "block"
      })
    }
  }

  mapProjects(){
    return this.state.menuItems.map(
      function( el, index ){
        return(
          <Project/>
        )
      }
    );
  }

  nextProject(){
    this.state.scene.next();
  }

  prevProject(){
    this.state.scene.prev();
  }


  render(){
    return(
      <div className = "projects-wrapper"

        >
        <div className = "main-wrapper main-wrapper--projects">
          <div className = "item">
            <canvas
            className = "project-index"
            ref = "projects"
            onMouseMove = { this.mouseOver.bind( this ) }
            draggable = { true }
            onDragStart = { this.dragStart.bind( this ) }
            onDrag = { this.drag.bind( this ) }
            onDragEnd = { this.dragEnd.bind( this ) }
            onMouseDown = { this.onMouseDown.bind( this ) }
            onMouseUp = { this.onMouseUp.bind( this ) }
            />
            <Interface projects = { this.state.projects } selectedProject = { this.state.selectedProject }/>
            <Arrows
              projects = { this.state.projects }
              selectedProject = { this.state.selectedProject }
              nextProject = { this.nextProject.bind( this ) }
              prevProject = { this.nextProject.bind( this ) }
            />
          </div>
        </div>
        <Background
          assignBackgroundAnimation = { this.assignBackgroundAnimation.bind( this ) }
          currentBackgroundColor = { this.state.currentBackgroundColor }
          nextBackgroundColor = { this.state.nextBackgroundColor }
        />
        <Loading
          clickedPage = { this.state.clickedPage }
          clickedProject = { this.state.clickedProject }
          mouseDown = { this.state.mouseDown }
          animating = { true }
          selectedProject = { this.state.selectedProject }
        />
      </div>
    )
  }
}

export default Projects
