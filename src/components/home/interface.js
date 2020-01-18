import React from "react"

class Interface extends React.Component{
  constructor( props ){
    super();
    this.state = {
      projects: props.projects,
      selectedProject: props.selectedProject
    }
  }

  componentWillReceiveProps( props ){
    this.setState({ selectedProject: props.selectedProject })
  }

  onClick( project ){
    window.changeSelectedProject( project );
  }

  render(){
    return(
      <div className = "home__interface__wrapper">

        <div className = "home__inerface__list">
          {
            this.state.projects.map(
              ( project, index ) => {
                let style
                if( this.state.selectedProject ){
                  if( project === this.state.selectedProject.project ){
                    style = {
                      color: `rgb(
                        ${this.state.selectedProject.project.color.r },
                        ${this.state.selectedProject.project.color.g },
                        ${this.state.selectedProject.project.color.b }
                      )`
                    };
                  }else{
                    style = {
                      color: `rgb(
                        ${ (this.state.selectedProject.project.color.r + (this.state.selectedProject.project.backgroundColor.r * 3)) / 4 },
                        ${ (this.state.selectedProject.project.color.g + (this.state.selectedProject.project.backgroundColor.g * 3)) / 4 },
                        ${ (this.state.selectedProject.project.color.b + (this.state.selectedProject.project.backgroundColor.b * 3)) / 4 }
                      )`
                    };
                  }
                }
                return(
                  <a key = {`project-interface__shit-${index}`} style = { style } className = "home__interface__item" onClick = { () => { this.onClick( project ) } } >{ project.name }</a>
                )
              }
            )
          }
        </div>
      </div>
    )
  }
}

export default Interface;
