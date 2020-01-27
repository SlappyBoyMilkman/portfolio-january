import Timer from "../util/timer.js"
const THREE = require("three");
const Noise = require("simplex-noise");
const WebFont = require( "webfontloader" );
const Easing = require( "./easing" );


class TitleWord{
  constructor( string, index, three, project ){
    this.string = string.replace(/\s\s+/g, ' ').toUpperCase();
    this.index = index;
    this.three = three;
    this.project = project;
    this.p = document.createElement( "p" )
    this.p.innerText = this.string;
    this.p.fontFamily = "graphik"
    this.p.style.display = "inline";
    this.p.style.fontSize = project.titleSize;
    this.p.style.whiteSpace = "nowrap";
    document.body.appendChild( this.p )
    this.width = this.p.offsetWidth
    this.fontFamily = "graphik"
    this.height = this.p.offsetHeight
    this.aspect = this.p.width / this.p.height
    this.p.remove();
    this.loadFont( this, this.setupThree.bind( this ) )
    this.noise = new Noise()
    this.timer = new Timer( .8, .02, true )

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

  setupThree(){

    let canvas = document.createElement( "canvas" );
    canvas.width = this.width * 1.6;
    canvas.height = this.height * 1.5;
    let ctx = canvas.getContext( "2d" );
    ctx.font = `${ this.project.titleSize } ${ this.fontFamily }`;
    ctx.fillStyle = "red"
    // ctx.fillRect( 0, 0, this.width, this.height );
    ctx.fillStyle = `rgb( ${this.project.backgroundColor.r}, ${this.project.backgroundColor.g}, ${this.project.backgroundColor.b} )`;
    canvas.style = { position: "fixed", top: "0px", left: "0px", zIndex: "100000000" }
    canvas.style.position =  "fixed";
    canvas.style.zIndex =  10000;
    canvas.style.top =  "0px";
    canvas.style.left =  "0px";
    canvas.style.backgroundColor =  "blue";
    // document.body.appendChild( canvas )
    ctx.fillText( this.string, this.width * .25, this.height * 1 );
    var texture = new THREE.Texture( canvas );
    texture.needsUpdate = true;
    let box = new THREE.PlaneGeometry( canvas.width, canvas.height, 1 , 80 );
    var materialBack = new THREE.MeshBasicMaterial( { map: texture, transparent: true, side: THREE.BackSide, color: "white" } );
    var materialFront = new THREE.MeshBasicMaterial( { map: texture, transparent: true, side: THREE.FrontSide, color: "white" } );
    materialBack.opacity = 0;
    materialFront.opacity = 0;
    this.back = new THREE.Mesh( box, materialBack );
    this.front = new THREE.Mesh( box, materialFront );
    this.back.position.set( 0, 100 + (this.index * .4 * -this.height), -1000 );
    this.front.position.set( 0, 120 + (this.index * .4 * -this.height), -1000 );
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
      let zPos = Math.cos( (yPos / this.height) * (Math.PI * .8) ) * radius  * 2;
      let newYPos = Math.sin( (yPos / this.height) * (Math.PI * .8) ) * radius  * 2;
      vertex.y = newYPos
      vertex.z = zPos
    }
    this.back.scale.set( .9, .9, .9 )
    this.front.scale.set( .9, .9, .9 )
    this.front.renderOrder = 1
    this.three.scene.fog = new THREE.Fog( `rgb( ${this.project.color.r}, ${this.project.color.g}, ${this.project.color.b} )`, 1000, 1200 );
    this.three.scene.add( this.back )
    this.three.scene.add( this.front )
  }

  animate( time ){
    if( this.back ){
      time = time / 50;
      let inc = (Math.PI * 2) / 2
      let timeLeftOver = time % ( inc );
      let timeBase = time - timeLeftOver;
      let normalized = timeLeftOver / inc;
      let easeTime = Easing.easeInOutQuint(normalized) * inc;
      time = timeBase + easeTime;
      this.back.geometry.verticesNeedUpdate = true
      this.front.material.opacity = this.timer.getCount();
      this.back.material.opacity = this.timer.getCount();
      this.front.material.opacity = this.timer.getCount();
      this.timer.countUp();
      let mod = this.index % 2 === 0 ? -1 : 1;
      this.back.rotation.set( (-time * mod ) + ( this.index * Math.PI  ), 0, 0 )
      this.front.rotation.set( (-time * mod ) + ( this.index * Math.PI  ), 0, 0 )
    }
  }
}

export default TitleWord
