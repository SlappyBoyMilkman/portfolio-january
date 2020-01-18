import React from "react";

class Arrows extends React.Component{
  constructor( props ){
    super();
    this.state = {
      projects: props.projects,
      selectedProject: props.selectedProject
    }
  }

  componentWillReceiveProps( props ){
    this.setState({
      projects: props.projects,
      selectedProject: props.selectedProject
    })
  }

  mapArrows(){
    return this.state.projects.map(
      ( project, index ) => {
        let width =
          this.state.selectedProject && ( project === this.state.selectedProject.project || project === this.state.selectedProject )?
          "30px": "0%";
        let className =
          this.state.selectedProject && ( project === this.state.selectedProject.project || project === this.state.selectedProject )?
          "arrow__inner": "arrow__inner arrow__inner--in";
        let transitionDelay =
          this.state.selectedProject && ( project === this.state.selectedProject.project || project === this.state.selectedProject )?
          index * .1 + "s": (.5 + index * .1) + "s";


        let style = {
          width: width,
          transitionDelay: transitionDelay,
          backgroundColor: `rgb( ${project.color.r},
              ${project.color.g},
              ${project.color.b}
            )`,
        }
        return(
          <div className = { className } style = { style } ></div>
        )
      }
    );
  }

  render(){
    return(
      <div className = "home__arrows_wrap">
        <div className = "index-arrow left__arrow" onClick = { this.props.nextProject }>
          <div className = "handle-1">
            {
              this.mapArrows()
            }
          </div>
          <div className = "handle-2">
            {
              this.mapArrows()
            }
          </div>

        </div>
        <div className = "index-arrow right__arrow" onClick = { this.props.prevProject }>
          <div className = "handle-1">
            {
              this.mapArrows()
            }
          </div>
          <div className = "handle-2">
            {
              this.mapArrows()
            }
          </div>
        </div>
      </div>
    )
  }
}

export default Arrows
