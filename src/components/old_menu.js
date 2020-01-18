import React from "react";
import MenuItem from "./menuItem"

class Menu extends React.Component{
  constructor( props ){
    super();
    this.state = {
      menuItems: props.menuItems,
      open: props.menuOpen
    }
  }

  componentWillReceiveProps( props ){
    this.setState({ open: props.menuOpen })
  }

  componentDidMount(){
    this.props.passForceClose( this.forceClose.bind( this ) )
  }


  menuItems(){
    return this.state.menuItems.map(
      function( menuItem, index ){
        return(
          <MenuItem key = {`menu-item-${index}`} forceClose = { this.state.forceClose } unClickMenuItem = { this.props.unClickMenuItem } clickMenuItem = { this.props.clickMenuItem } open = { this.state.open } menuItem = { menuItem } index = { index }/>
        )
      }.bind( this )
    );
  }

  clickHamburger(){
    this.setState({ forceClose: false }, this.props.toggleMenu)
  }

  forceClose(){
    this.setState({ forceClose: true }, this.props.closeMenu);
  }

  render(){
    return(
      <div>
        <div className = "hamburger" onClick = { this.clickHamburger.bind( this ) }></div>
        <div className = "cart-drawer">
          <canvas ref = "background" className = "cart-drawer__background"/>
          {
            this.menuItems()
          }
        </div>
      </div>
    )
  }
}

export default Menu;
