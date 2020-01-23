import WordBase from "../base/word-base"
import Timer from "./timer";
const THREE = require( "three" );
const Easing = require( "./easing" );


class BigWord extends WordBase{

  constructor( settings, project, scene ){
    super();
    this.scene = scene;
    this.project = project;
    this.settings = settings;
    this.time = 0;
    this.fontFamily = "graphik-black";
    this.timer = new Timer( .5, .018, true );
    this.loadFont( this, this.fontLoaded.bind( this ) );
  }

  fontLoaded( font, other ){
    let canvas = document.createElement( "canvas" );
    canvas.width = window.innerWidth * 1.5
    canvas.height = window.innerHeight / 3;
    let ctx = canvas.getContext( "2d" )
    this.fontSize = "8vw";
    ctx.font = this.fontSize + ` ${ font }`;
    let string = this.settings.name.toUpperCase();
    let sat = Math.round( 10 + ( this.index * 11 ));
    ctx.fillStyle = `rgb( ${sat}, ${sat}, ${sat} )`;
    let totalWidth;
    totalWidth = ctx.measureText(string).width;
    ctx.fillStyle = "red";
    // ctx.fillRect( 0, 0, canvas.width, canvas.height );
    ctx.fillStyle = "rgb( 255, 255, 255 )";
    ctx.fillText( string, (window.innerWidth * 1.5 / 2) - (totalWidth / 2), (window.innerHeight / 3) * 7.5 / 10 );
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

  setup(){
    this.geometry = new THREE.BoxGeometry( .1, .1, .1 );
    this.mesh = new THREE.Mesh( this.geometry );
    this.project.mesh.add( this.mesh )
    var geometry = new THREE.PlaneGeometry( this.canvas.width, this.canvas.height, 2 );
    var texture = new THREE.Texture( this.canvas );
    texture.needsUpdate = true;
    var material = new THREE.MeshBasicMaterial( { map: texture, side: THREE.DoubleSide, transparent: true } );
    this.plane = new THREE.Mesh( geometry, material );
    material.depthWrite = false;
    this.mesh.add( this.plane );
    this.plane.geometry.verticesNeedUpdate = true;
    this.mesh.scale.set( 1,1,1 )
    let value = this.timer.getCount();
  }

  animate(){
    if( this.mesh ){
      let value = Easing.easeOutQuart( this.timer.getCount() );
      if( this.project.animating ){
        this.timer.countUp()
      }else{
        this.timer.resetTimer()
      }
      this.plane.material.transparent = true;
      this.plane.material.needsUpdate = true;
      this.plane.material.opacity = value;
      if( this.settings.bigWordPos ){
        this.mesh.position.set( this.settings.bigWordPos.x, this.settings.bigWordPos.y + ((1-value) * -400), this.settings.bigWordPos.z + (this.project.index * 10) );
      }else{
        this.mesh.position.set( 0, -800 + ((1-value) * -400), -1400 + (this.project.index * 10) );
      }
    }
  }
}

export default BigWord;
