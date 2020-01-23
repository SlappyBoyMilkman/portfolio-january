const THREE = require( "three" );
const WebFont = require( "webfontloader" );

class WordBase{
  constructor( system, index, fontSize ){
    this.system = system;
    this.index = index;
    this.interfaceElements = [];
    this.interfaceIndex = 0;
    if( fontSize ){
      this.fontSize = fontSize
    }else{
      this.fontSize = "15px"
    }
    this.interfaceUpdeteListeners = [];
    this.letters = [];
    this.letterObjs = [];
  }

  updateInterfaceElement( name, value ){
    this.interfaceElements[ name ] = value;
    this.onInterfaceUpdate();
  }

  loadFont( that, callback ){
    if( callback ){
      let config = {
        custom: {
          families: [this.fontFamily],
        },
        fontactive: callback
      }
      let wf =  WebFont.load( config );
    }else{
      let config = {
        custom: {
          families: [this.fontFamily],
        },
        fontactive: this.fontLoaded.bind( that )
      }
      let wf =  WebFont.load( config );
    }
  }

  fontLoaded( font, other ){
    let canvas = document.createElement( "canvas" );
    canvas.width = this.scene.three.renderer.domElement.offsetWidth * 1.1
    canvas.height = window.innerHeight / 3 ;
    let ctx = canvas.getContext( "2d" )
    // ctx.fillStyle = "red";
    // ctx.fillRect( 0, 0, window.innerWidth, window.innerHeight )
    let fontSize = this.scene.getInterfaceElement( "font size" );
    let fontFamily = "graphik";
    if( this.fontFamily ){
      fontFamily = this.fontFamily
    }
    ctx.font = this.fontSize + ` ${ fontFamily }`;
    let string = this.settings.name
    if( this.string ){
      string = this.string
    }
    let sat = Math.round( 10 + ( this.index * 11 ));
    ctx.fillStyle = `rgb( ${200}, ${200}, ${200} )`;
    let totalWidth;
    totalWidth = ctx.measureText(string).width;
    if( this.color ){
      ctx.fillStyle = `rgb( ${ this.color.r }, ${ this.color.g }, ${ this.color.b } )`;
    }else{
      ctx.fillStyle = "rgb( 255, 255, 255 )";

    }
    ctx.fillText( string, (this.scene.three.renderer.domElement.offsetWidth / 2) - (totalWidth / 2), (window.innerHeight / 3) * 7.5 / 10 );
    let offsetLeft = 0;

    for( var i = 0; i < string.length; i++ ){
      let obj = {};
      let letter = string[i];
      var txt = letter;
      let width = ctx.measureText(txt).width;
      totalWidth = ctx.measureText(string).width;
      obj.width = width;
      obj.left = offsetLeft;
      obj.totalWidth = totalWidth;
      obj.letter = letter;
      offsetLeft += width
      this.letters.push( obj );
    }

    this.canvas = canvas;
    this.canvas.style.position = "fixed";
    this.canvas.style.top = "0px"
    this.canvas.style.left = "0px"
    this.canvas.style.zIndex = "1000"
    // document.body.appendChild( this.canvas )
    this.setup();
  }


  addSlider( name, deflat, min, max, increment, needsUpdate ){
    if( !needsUpdate ){
      needsUpdate = true
    }

    let obj = {
      index: this.interfaceIndex,
      type: "Slider",
      name: name,
      min: min,
      max: max,
      increment: increment,
      default: deflat,
      value: deflat,
      needsUpdate: needsUpdate
    }

    this.interfaceElements[ name ] = obj;
    this.interfaceIndex++;
  }

  addVectorThree( name, type, deflat, needsUpdate ){
    if( !needsUpdate ){
      needsUpdate = true
    }
    let obj = {
      index: this.interfaceIndex,
      type: "Vector Three",
      name: name,
      type: type,
      default: deflat
    }

    this.interfaceElements[ name ] = obj;
    this.interfaceIndex++;
  }



  removeLights(){

  }

  addVectorTwo( name, group, deflat, type, needsUpdate ){
    if( !needsUpdate ){
      needsUpdate = true
    }
    let obj = {
      index: this.interfaceIndex,
      type: "Vector Two",
      name: name,
      type: type,
      default: deflat
    }

    this.interfaceElements[ name ] = obj;
    this.interfaceIndex++;
  }

  interfaceUpdate(){
    for( let i = 0; i < this.interfaceUpdeteListeners.length; i++ ){
      let update = this.interfaceUpdeteListeners[i];
      update();
    }

    this.remove();
  }

  addInterfaceUpdateListener( func ){
    this.interfaceUpdeteListeners.push( func );
  }


  interfaceUpdate(){
    for( let i = 0; i < this.interfaceUpdeteListeners.length; i++ ){
      let update = this.interfaceUpdeteListeners[i];
      update();
    }

    this.remove();
  }

  addInterfaceUpdateListener( func ){
    this.interfaceUpdeteListeners.push( func );
  }

  interfaceUpdate(){
    for( let i = 0; i < this.interfaceUpdeteListeners.length; i++ ){
      let update = this.interfaceUpdeteListeners[i];
      update();
    }

    this.remove();
  }

  updateInterfaceElement( name, value ){
    this.interfaceElements[ name ].value = value;
    this.interfaceUpdate();
  }

  getInterfaceElement( name ){
    return this.interfaceElements[name]
  }


}

export default WordBase;
