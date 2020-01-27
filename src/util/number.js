import Timer from "../util/timer.js"
const THREE = require("three");
const Noise = require("simplex-noise");
const WebFont = require( "webfontloader" );
const Easing = require( "./easing" );

class Number{
  constructor( ten, index, status, three, isHundred ){
    this.ten = ten;
    this.index = index;
    this.isHundred = isHundred;
    this.status = status;
    this.three = three;
    this.fontSize = "20vh";
    this.p = document.createElement( "p" )
    this.p.innerText = this.index;
    this.p.fontFamily = "graphik"
    this.p.style.display = "inline";
    this.p.style.fontSize = this.fontSize;
    this.p.style.whiteSpace = "nowrap";
    document.body.appendChild( this.p )
    this.fontFamily = "graphik"
    this.color = { r: 255, g: 180, b: 100}
    this.rotation = this.index === 0? Math.PI: 0;
    this.currentRotation = this.rotation;
    this.targetRotation = this.rotation;
    this.width = this.p.offsetWidth
    this.height = this.p.offsetHeight
    this.p.remove();
    this.noise = new Noise()
    this.timer = new Timer( 0, .01, true )
    this.loadFont( this, this.setup.bind( this ) )
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

  setup(){
    let canvas = document.createElement( "canvas" );

    canvas.width = this.width * 1.6;
    canvas.height = this.height * 1.5;
    let ctx = canvas.getContext( "2d" );
    ctx.font = `${ this.fontSize } graphik`;
    ctx.fillStyle = "red"
    // ctx.fillRect( 0, 0, this.width, this.height );
    ctx.fillStyle = `rgb( ${ this.color.r }, ${ this.color.g }, ${ this.color.b } )`;
    canvas.style = { position: "fixed", top: "0px", left: "0px", zIndex: "100000000" }
    canvas.style.position =  "fixed";
    canvas.style.zIndex =  10000;
    canvas.style.top =  "0px";
    canvas.style.left =  "0px";
    canvas.style.backgroundColor =  "blue";
    // document.body.appendChild( canvas )
    ctx.fillText( this.index, this.width * .25, this.height * 1 );
    var texture = new THREE.Texture( canvas );
    texture.needsUpdate = true;
    let box = new THREE.PlaneGeometry( canvas.width, canvas.height, 1 , 80 );
    var materialBack = new THREE.MeshBasicMaterial( { map: texture, transparent: true, side: THREE.BackSide, color: `rgb( ${ this.color.r }, ${ this.color.g }, ${ this.color.b } )` } );
    var materialFront = new THREE.MeshBasicMaterial( { map: texture, transparent: true, side: THREE.FrontSide, color: `rgb( ${ this.color.r }, ${ this.color.g }, ${ this.color.b } )` } );
    materialBack.opacity = 0;
    materialFront.opacity = 0;
    this.back = new THREE.Mesh( box, materialBack );
    this.front = new THREE.Mesh( box, materialFront );
    this.back.position.set(  ( this.width * -1.5 ) + (this.ten * ( this.width * 1.5 )), 120 + (this.index * .5 * -this.height), -1000 );
    this.front.position.set(  ( this.width * -1.5 ) + (this.ten * ( this.width * 1.5 )), 120 + (this.index * .5 * -this.height), -1000 );
    this.targetPosition = {
      y: 120 + (this.index * .5 * -this.height )
    }
    this.currentPosition = {
      y: 120 + (this.index * .5 * -this.height)
    }
    materialBack.depthTest = true
    materialBack.depthWrite = false;
    for( var i = 0; i < this.back.geometry.vertices.length; i++ ){
      let vertex = this.back.geometry.vertices[i];
      let yPos = vertex.y;
      let radius = this.height / 4 ;
      let zPos = Math.cos( (yPos / this.height) * (Math.PI * .8) ) * radius  * 2;
      let newYPos = Math.sin( (yPos / this.height) * (Math.PI * .8) ) * radius  * 2;
      vertex.y = newYPos
      vertex.z = zPos
    }

    for( var i = 0; i < this.front.geometry.vertices.length; i++ ){
      let vertex = this.front.geometry.vertices[i];
      let yPos = vertex.y;
      let radius = this.height / 4 ;
      let zPos = Math.cos( (yPos / this.height) * (Math.PI * 1) ) * radius  * 2;
      let newYPos = Math.sin( (yPos / this.height) * (Math.PI * 1) ) * radius  * 2;
      vertex.y = newYPos
      vertex.z = zPos
    }
    this.back.scale.set( .5, .5, .5 )
    this.front.scale.set( .5, .5, .5 )
    this.front.renderOrder = 1
    this.three.scene.fog = new THREE.Fog( `rgb( 250, 250, 250 )`, 950, 1050 );
    this.three.scene.add( this.back )
    this.three.scene.add( this.front )
    this.three.renderer.setClearColor( "rgb( 220, 180, 100 )" )
    this.three.renderer.render( this.three.scene, this.three.camera );
  }

  updateStatus( status ){
    let filtered =  status ? status : 0;
    if( this.status !== filtered ){
      this.status = filtered;
      this.currentPosition = { y: this.y };
      let index = this.index - this.status;
      this.targetPosition = {
        y: 120 + (index * .5 * -this.height )
      }
      this.currentRotation = this.rotation;
      if( index === 0 ){
        this.targetRotation = 0;
      }else{
        this.targetRotation = -Math.PI;
      }
      this.timer.resetTimer();
    }
  }

  getY(){
    let time = this.timer.getCount();
    time = Easing.easeInOutQuint( time );
    let diff =  this.targetPosition.y - this.currentPosition.y;
    let y = this.currentPosition.y + (diff * time);
    return y;
  }

  getRotation(){
    let time = this.timer.getCount();
    time = Easing.easeInOutQuint( time );
    let diff =  this.targetRotation - this.currentRotation;
    let y = this.currentRotation + (diff * time);
    return y;
  }

  animate( time ){
    if( this.back ){
      time = time / 50;
      let inc = (Math.PI * 2) / 2
      let timeLeftOver = time % ( inc );
      let timeBase = time - timeLeftOver;
      let normalized = timeLeftOver / inc;
      let easeTime = Easing.easeInOutQuad(normalized) * inc;
      time = timeBase + easeTime;
      this.back.geometry.verticesNeedUpdate = true
      this.front.material.opacity = 1;
      this.back.material.opacity = 1;
      this.front.material.opacity = 1;
      let y = this.getY();
      let rotation = this.getRotation();
      this.rotation = rotation;
      this.y = y;
      this.timer.countUp();
      let mod = this.index % 2 === 0 ? -1 : 1;
      this.back.rotation.set( this.rotation, 0, 0 )
      this.back.position.set(( this.width * -1.5 ) + (this.ten * ( this.width * 1.5 )), y, -1000 );
      this.front.rotation.set( this.rotation, 0, 0 )
      this.front.position.set( ( this.width * -1.5 ) + (this.ten * ( this.width * 1.5 )), y, -1000 );
    }
  }
}

export default Number
