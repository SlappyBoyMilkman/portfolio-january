import React from "react";

const Pages = require("../data/pages")

class Shelf extends React.Component{
  constructor( props ){
    super();
    this.state = {
      projects: props.projects,
      menuOpen: props.menuOpen,
      pages: Pages
    }
  }

  componentWillReceiveProps( props ){
    this.setState({
      menuOpen: props.menuOpen
    })
  }

  onClick( page ){
    this.props.clickMenuItem( page )
  }

  projects(){
    return this.state.pages.map(
      ( page, index ) => {
        let style = {};
        style.transitionDelay = this.state.menuOpen ? .2 + index * .1 + "s": index * .1 + "s";
        style.marginTop = this.state.menuOpen ? "0px": "15vh";
        style.pointerEvents = this.state.menuOpen ? "painted": "none";
        return(
          <div className = "shelf__menu-word__wrapper">
            <div className = "shelf__menu-word" style = { style } onClick = { () => { this.onClick( page ) } }>
              {
                page.title
              }
            </div>
          </div>
        )
      }
    )
  }

  getStyle(){
    if( this.state.menuOpen ){
      return({
        width: "100vw",
        pointerEvents: "none"
      })
    }else{
      return({
        width: "100vw",
        pointerEvents: "none"
      })
    }
  }

  render(){
    return(
      <div className = "shelf" style = { this.getStyle() }>
        <div className = "shelf__wrap">
          {
            this.projects()
          }
        </div>
      </div>
    )
  }
}

export default Shelf
