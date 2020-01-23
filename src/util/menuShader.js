import GlslCanvas from "glslCanvas"
const Easing = require("./easing");
const WebFont = require( "webfontloader" );

class MenuShader{
  constructor( canvas, index, settings ){
    this.canvas = canvas;
    this.settings = settings;
    this.index = index;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight / 3;
    this.hoverEase = 0;
    this.loadFont()
  }

  loadFont(){
    let config = {
      custom: {
        families: ['graphik'],
      },
      fontactive: this.createWord.bind( this )
    }
    let wf =  WebFont.load( config );
  }

  createWord(){
    let canvas = document.createElement( "canvas" )
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight / 3;
    let ctx = canvas.getContext( "2d" )
    let name = this.settings.name;
    let textSettings = {
      height: window.innerHeight / 3
    };
    ctx.font = "10vh graphik";
    ctx.fillStyle = "#ededed";
    ctx.fillRect( 0,0,window.innerWidth, window.innerHeight )
    textSettings.width = ctx.measureText( name ).width;
    ctx.fillStyle = "black";
    ctx.fillText( name,( window.innerWidth - (textSettings.width)) / 2, textSettings.height * 7.5 / 10 );
    this.textCanvas = canvas
    this.textSettings = textSettings
    this.setup();
  }

  imageLoaded( img ){
  }

  convertToDataURL( img ){
    var canvas = document.createElement('canvas')
    var ctx = canvas.getContext('2d')

    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0)

    // If the image is not png, the format
    // must be specified here
    return canvas.toDataURL()

  }

  setup(){

    var string_frag_code = document.getElementById("menu-item__shader").innerHTML;
    let sandbox = new GlslCanvas( this.canvas );
    sandbox.load(string_frag_code);
    sandbox.setUniform("u_index",3);
    sandbox.setUniform("u_offset",1000);
    sandbox.setUniform("u_magnitude", 10);
    sandbox.setUniform("u_seed", Math.random() * 1000);
    sandbox.setUniform("textCanvas", this.textCanvas.toDataURL());
    this.sandbox = sandbox
  }

  onMouseOver(){
    this.mouseOver = true;
  }

  onMouseLeave(){
    this.mouseOver = false
  }

  onMouseMove( mouse ){
    this.mouse = mouse
  }

  animate(){
    if( this.sandbox ){
      if( this.mouseOver && this.hoverEase < 1 ){
        this.hoverEase += .05
      }else if( this.hoverEase > 0 ){
        this.hoverEase -= .05
      }
      if( this.mouse ){
          let mouseX =   this.mouse.x / this.canvas.width;
          let mouseY =   this.mouse.y / this.canvas.height;
          this.sandbox.setUniform("u_mousePos",
            mouseX,
            ( this.index + 1 )-mouseY
          );
          if( this.img ){
            this.sandbox.setUniform("u_img_aspect",
            this.img.img.width / this.img.img.height
          );
        }
      }
      this.sandbox.setUniform("u_mouseEase", Easing.easeInOutQuart(this.hoverEase));
    }
  }
}

export default MenuShader
