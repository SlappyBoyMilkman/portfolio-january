import React from "react";

class Hamburger extends React.Component{
  constructor( props ){
    super();
    this.state = {
      selectedProject: props.selectedProject,
      projects: props.projects,
      isProject: props.isProject,
      menuOpen: props.menuOpen
    }
  }

  componentWillReceiveProps( props ){
    this.setState({
      selectedProject: props.selectedProject,
      menuOpen: props.menuOpen,
      isOtherPage: props.isOtherPage
    })
  }

  componentDidMount(){
    window.setTimeout(
      () => {
        this.setState({ showMenu: true })
      }, 100
    );
  }

  getClassName(){
    let handle;
    if( this.state.selectedProject && this.state.selectedProject.project ){
      handle = this.state.selectedProject.project.name.handleize();
    }else if( this.state.selectedProject ){
      handle = this.state.selectedProject.name.handleize();
    }
    if( this.state.selectedProject ){
      return `bun bun--${ handle }`
    }else{
      return(
        "bun"
      )
    }
  }

  mapColors( index ){
    return this.state.projects.map(
      ( project, second ) => {
        let width;
        let className = "bun__inner"
        let transitionDelay = index * .1 + "s"
        if( this.state.selectedProject && (project === this.state.selectedProject.project || project === this.state.selectedProject) && this.state.showMenu  ){
          width = "100%"
          className += " bun__inner--in";
          transitionDelay = (.5 + index * .1) + "s"
        }else{
          width = "0%"
        }
        let style = {
          backgroundColor: `rgb( ${project.color.r},
              ${project.color.g},
              ${project.color.b}
            )`,
            width: width,
            transitionDelay: transitionDelay
          }
          if( this.state.isProject === true ){
            style = {
              backgroundColor:
              `rgb(${project.backgroundColor.r},${project.backgroundColor.g},${project.backgroundColor.b})`,
                width: width,
                transitionDelay: transitionDelay
            }
          }

          if( this.state.isOtherPage ){
            if( this.state.isOtherPage.display ){
              style = {
                backgroundColor:
                `rgb(${this.state.isOtherPage.color.r},${this.state.isOtherPage.color.g},${this.state.isOtherPage.color.b})`,
                width: "100%",
                transitionDelay: transitionDelay
              }
            }else{
              style = {
                backgroundColor:
                `rgb(${this.state.isOtherPage.color.r},${this.state.isOtherPage.color.g},${this.state.isOtherPage.color.b})`,
                width: "0%",
                transitionDelay: transitionDelay
              }
            }
          }


        return(
          <div
            key = {`bun-${index}-${second}`}
            style = {style}
            className = "bun__inner"
            ></div>
        )
      }
    )
  }

  onClick(){
    this.props.toggleMenu();
  }

  getStyle( bunNum ){
    if( bunNum === 0 ){
      if( this.state.menuOpen ){
        return({
          transform: "rotate(45deg) translate( 0px, -50% ) scale( 1, .3 )"
        })
      }
    }else if( bunNum === 1 ){
      if( this.state.menuOpen ){
        return({
          transform: "scale(0, 1) translate( 0px, -50% )",
          transformOrigin: "0px 50%",
          transition: ".2s"
        })
      }else{
        return({
          transition: ".4s",
          transform: "scale(1, 1) translate( 0px, -50% )",
          transformOrigin: "0px 50%",
          transitionDelay: ".2s"
        })
      }
    }else if( bunNum === 2 ){
      if( this.state.menuOpen ){
        return({
          transform: "rotate(-45deg) translate( -10px, 11px ) scale( 1, .3 )"
        })
      }
    }
  }

  render(){
    return(
      <div className = "hamburger__wrapper" onClick = { this.onClick.bind( this ) }>
        <div className = "hamburger__pivot"  style = { this.getStyle(0) }>
          <div className = { this.getClassName() }>
          {
            this.mapColors( 0 )
          }
          </div>
        </div>
        <div className = "hamburger__pivot" >
          <div className = { this.getClassName() } style = { this.getStyle(1) }>
          {
            this.mapColors( 1 )
          }
          </div>
        </div>
        <div className = "hamburger__pivot" style = { this.getStyle(2) }>
          <div className = { this.getClassName() }>
          {
            this.mapColors( 2 )
          }
          </div>
        </div>
      </div>
    )
  }
}

export default Hamburger
