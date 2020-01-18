import GlslCanvas from "glslCanvas"
const Easing = require("./easing");

class OverlayCanvas{
  constructor( canvas, settings){
    this.canvas = canvas;
    this.settings = settings
    this.clickTimer = 0;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.setup()
  }

  updateClickTimer( clickTimer ){
    this.clickTimer = clickTimer
    this.sandbox.setUniform("u_mag", Easing.easeInOutCubic(clickTimer * 1));
  }

  setup(){
    var string_frag_code = document.getElementById("overlay__shader").innerHTML;
    let sandbox = new GlslCanvas( this.canvas );
    sandbox.load(string_frag_code);
    sandbox.setUniform("u_color", this.settings.color[0], this.settings.color[1], this.settings.color[2]);
    this.sandbox = sandbox
  }
}

export default OverlayCanvas
