import Easing from "../util/easing"
import SystemBase from "../base/system-base.js";
import Project from "./project"
import Project2 from "./project2"
import Project3 from "./project3"
import Timer from "./timer"
import { BloomEffect, EffectComposer, EffectPass, RenderPass, ShaderPass, CopyShader } from "postprocessing";

const THREE = require("three");
const CreateBackground = require("./createBackground");



class Scene extends SystemBase{
  constructor( canvas, settings, projects, reset, parent ){
    super();
    this.settings = settings;
    this.canvas = canvas;
    this.parent = parent;
    this.projectsSettings = projects
    this.fadeInTimer = 0;
    this.time = 0;
    this.ease = 0;
    this.fadeOutTimer = 1;
    this.selectedIndex = 0;
    this.scrolled = 0;
    this.cameraPos = { x: 0, y: 0 };
    this.locked = false;
    this.targPos = { x: 0, y: 0 };
    this.mouse = { x: 0, y: 0 };
    this.rotationTimer = { indexTimer: 1, timer: 1 };
    this.reset = reset;
    // this.backgroundTimer = new Timer( 0, .03, true )
    this.setupTHREEPerspective( this )
    this.animating = true
    this.timer = new Timer( .2, .015, true );
    this.loadTimer = new Timer( .5, .02, true );
    this.initialize()

  }

  initialize(){
    this.addSlider( "font size", "word", 12, 0, 100, .5, false );
    this.addSlider( "base kerning", "word", 7.4, 0, 10, .1, false );
    this.addString( "word", "word", this.settings.name, true );
    let mesh = this.addMesh();

    // this.three.scene.add( sphere );
    window.camera = this.three.camera
    window.camera.rotation.set( -.3,0,0 )
    window.camera.position.set( 0, 0, -50 )

    let projects = []
    this.projectsSettings.forEach(
      ( projectSettings, index ) => {
        if( projectSettings.type === 0 ){
          let _project = new Project( projectSettings, index, this );
          projects.push( _project )
        }else if( projectSettings.type === 2 ){
          let _project = new Project3( projectSettings, index, this );
          projects.push( _project )
        }else{
          let _project = new Project2( projectSettings, index, this );
          projects.push( _project )
        }
      }
    )

    const colorShader = {
    	uniforms: {
    		"tDiffuse": { value: 1.0 },
    		"amount":   { value: 1.0 }
    	},
    	vertexShader: [
    		"varying vec2 vUv;",
    		"void main() {",
    			"vUv = uv;",
    			"gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
    		"}"
    	].join( "\n" ),
    	fragmentShader: document.getElementById( "three__frag" ).innerHTML
    };

    let ShaderMaterial = new THREE.ShaderMaterial({
      defines: { LABEL: "value" },
      uniforms: {
        tDiffuse: new THREE.Uniform(null),
        u_scrolled: new THREE.Uniform( 0 ),
        u_time: new THREE.Uniform( this.time ),
        u_mag: new THREE.Uniform( 0 ),
        u_mouse: new THREE.Uniform(new THREE.Vector2( this.mouse.x, this.mouse.y )),
        loadTime: new THREE.Uniform( 0 )
      },
      vertexShader: colorShader.vertexShader,
      fragmentShader: colorShader.fragmentShader
    })
    var parameters = {
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat,
      stencilBuffer: false };
    let renderPass = new RenderPass( this.three.scene, this.three.camera );
    var renderTarget = new THREE.WebGLRenderTarget(
      this.three.renderer.domElement.offsetWidth,
      this.three.renderer.domElement.offsetHeight,
      parameters
    );
    this.three.composer = new EffectComposer( this.three.renderer, renderTarget );
    // this.three.renderer.autoClear=false
    // renderPass.clear=false
    const myShaderPass = new ShaderPass( ShaderMaterial, "tDiffuse" );
    myShaderPass.renderToScreen = true;
    // renderPass.renderToScreen = true;


    // let effectPass = new EffectPass( this.three.camera, new BloomEffect() );
    // effectPass.renderToScreen = true;
    // this.three.composer.addPass( effectPass )
    this.three.composer.addPass( renderPass )
    this.three.composer.addPass( myShaderPass )

    this.selectedProject = projects[0]
    this.color = new THREE.Color( `rgb( ${ this.selectedProject.project.backgroundColor.r }, ${ this.selectedProject.project.backgroundColor.g }, ${ this.selectedProject.project.backgroundColor.b } )` );
    this.fogColor = new THREE.Color( `rgb( ${ this.selectedProject.project.fogColor.r }, ${ this.selectedProject.project.fogColor.g }, ${ this.selectedProject.project.fogColor.b } )` )
    this.three.scene.fog = new THREE.Fog( this.fogColor, 1000, 1500 );
    this.projects = projects;
    // this.background = CreateBackground( this.selectedProject.project.backgroundColor );
    // this.three.scene.add( this.background )
    this.color = this.selectedProject.project.backgroundColor;
    this.parent.changeSelected( this.selectedProject )
    window.changeSelectedProject = this.changeSelected.bind( this )
  }

  fadeIn(){

  }


  stopAnimating(){
    this.animating = false;
  }

  passQueue(){
    if( !this.fadingIn && this.inQueue ){
      this.fadingIn = this.inQueue;
      this.fadingIn.reset()
      this.inQueue = undefined;
    }
  }

  next(  ){
    this.selectedIndex += 1;
    if( this.selectedIndex > this.projects.length - 1 ){
      this.selectedIndex = 0;
    }
    this.scrolled = 0;
    this.locked = true;
    this.changeSelected( this.projects[ this.selectedIndex ] );
  }

  prev(){
    this.selectedIndex -= 1;
    if( this.selectedIndex < 0 ){
      this.selectedIndex = this.projects.length - 1;
    }
    this.scrolled = 0;
    this.locked = true;
    this.changeSelected( this.projects[ this.selectedIndex ] )
  }

  getPrevIndex(){
    let selected = this.selectedIndex - 1;
    if( selected < 0 ){
      selected = this.projects.length - 1
    }
    return selected
  }

  getNextIndex(){
    let selected = this.selectedIndex + 1;
    if( selected > this.projects.length - 1 ){
      selected = 0;
    }
    return selected;
  }

  startSnap(){
    this.snapping = true;
  }

  updateScrolled( scrolled ){
    this.snapTimeout = window.setTimeout( this.startSnap.bind( this ), 500 );
    this.snapping = false;
    if( !this.locked ){
      if( this.scrollTimeout ){
        window.clearTimeout( this.scrollTimeout )
      }

      if( Math.abs( scrolled ) > 150 ){
          if( scrolled > 0 ){
            this.scrolled = scrolled;
            let scrollX = this.getScrollX()
            this.cameraPos.x = this.cameraPos.x + scrollX;
            this.scrolled = 0;
            this.next();
            this.reset();
            this.nextColor = this.selectedProject.project.backgroundColor;
            this.nextFog = this.selectedProject.project.fogColor;
            // this.background.material.uniforms.nextColor.value = new THREE.Color( `rgb(${ this.nextColor.r }, ${ this.nextColor.g }, ${ this.nextColor.b })`);
            // this.backgroundCount = true;
            this.three.scene.fog.color = new THREE.Color( `rgb(${ this.nextFog.r }, ${ this.nextFog.g }, ${ this.nextFog.b })` );
            // this.backgroundTimer.addCallback(
            //   function(){
            //     this.backgroundCount = false;
            //     this.backgroundTimer.resetTimer();
            //     this.color = this.selectedProject.project.backgroundColor;
            //     this.background.material.uniforms.color.value = new THREE.Color( `rgb(${ this.color.r }, ${ this.color.g }, ${ this.color.b })` );
            //   }.bind( this )
            // );
          }else{
            this.scrolled = scrolled;
            let scrollX = this.getScrollX()
            this.cameraPos.x = this.cameraPos.x + scrollX;
            this.scrolled = 0;
            this.prev();
            this.reset();
            this.nextColor = this.selectedProject.project.backgroundColor;
            this.nextFog = this.selectedProject.project.fogColor;
            // this.background.material.uniforms.nextColor.value = new THREE.Color( `rgb(${ this.nextColor.r }, ${ this.nextColor.g }, ${ this.nextColor.b })`);
            // this.backgroundCount = true;
            this.three.scene.fog.color = new THREE.Color( `rgb(${ this.nextFog.r }, ${ this.nextFog.g }, ${ this.nextFog.b })` );
            // this.backgroundTimer.addCallback(
            //   function(){
            //     this.backgroundCount = false;
            //     this.backgroundTimer.resetTimer();
            //     this.color = this.selectedProject.project.backgroundColor;
            //     this.background.material.uniforms.color.value = new THREE.Color( `rgb(${ this.color.r }, ${ this.color.g }, ${ this.color.b })` );
            //   }.bind( this )
            // );
          }
      }else{
        this.locked = false;
        this.scrolled = scrolled;
        // if( this.scrolled > 0 ){
        //   let next = this.getNextIndex();
        //   let project = this.projects[ next ]
        //   let nextColor = project.project.backgroundColor;
        //   let color = this.selectedProject.project.backgroundColor;
        //   this.background.material.uniforms.color.value = new THREE.Color( `rgb(${ this.color.r }, ${ this.color.g }, ${ this.color.b })` );
        //   this.background.material.uniforms.nextColor.value = new THREE.Color( `rgb(${ nextColor.r }, ${ nextColor.g }, ${ nextColor.b })`);
        //   this.thing = Math.abs(this.scrolled / 3500)
        // }else{
        //   let prev = this.getPrevIndex();
        //   let project = this.projects[ prev ]
        //   let nextColor = project.project.backgroundColor;
        //   let color = this.selectedProject.project.backgroundColor;
        //   this.background.material.uniforms.nextColor.value = new THREE.Color( `rgb(${ nextColor.r }, ${ nextColor.g }, ${ nextColor.b })`);
        //   this.background.material.uniforms.nextColor.value = new THREE.Color( `rgb(${ nextColor.r }, ${ nextColor.g }, ${ nextColor.b })`);
        //   this.thing = Math.abs(this.scrolled / 3500)
        // }
      }
    }
  }

  changeSelected( project ){
    if( project.name ){
      project = this.projects.filter(
        (pj) => {
          if( pj.project.name === project.name ){
            return pj
          }
        }
      )[0]
    }
    this.ease = 0;
    this.last = this.selectedProject;
    this.selectedProject = project;
    this.targPos = { x: this.selectedProject.index * 3500, y: 0 }
    this.parent.changeSelected( project )
    this.nextColor = this.selectedProject.project.backgroundColor;
    this.nextFog = this.selectedProject.project.fogColor;
    // this.background.material.uniforms.nextColor.value = new THREE.Color( `rgb(${ this.nextColor.r }, ${ this.nextColor.g }, ${ this.nextColor.b })`);
    // this.backgroundCount = true;
    this.three.scene.fog.color = new THREE.Color( `rgb(${ this.nextFog.r }, ${ this.nextFog.g }, ${ this.nextFog.b })` );
    // this.backgroundTimer.addCallback(
    //   function(){
    //     this.backgroundCount = false;
    //     this.backgroundTimer.resetTimer();
    //     this.color = this.selectedProject.project.backgroundColor;
    //     this.background.material.uniforms.color.value = new THREE.Color( `rgb(${ this.color.r }, ${ this.color.g }, ${ this.color.b })` );
    //   }.bind( this )
    // );
  }

  getScrollX(){
    let next;
    let selectedIndex = this.selectedIndex
    if( this.scrolled > 0 ){
      if( selectedIndex + 1 > this.projects.length - 1 ){
        selectedIndex = 0;
      }else{
        selectedIndex++
      }
    }else{
      if( selectedIndex - 1 < 0 ){
        selectedIndex = this.projects.length - 1;
      }else{
        selectedIndex--
      }
    }
    let current = this.projects[ this.selectedIndex ];
    next = this.projects[ selectedIndex ];
    if( next && current ){
      let diff = (next.index * 3500) - (current.index * 3500);
      return diff * Math.abs( this.scrolled / 1200 );
    }else{
      return 0
    }
  }

  unlock(){
    this.scrollLock = false;
  }

  getNextPos(){
    let next;
    let selectedIndex = this.selectedIndex
    if( this.scrolled > 0 ){
      if( selectedIndex + 1 > this.projects.length - 1 ){
        selectedIndex = 0;
      }else{
        selectedIndex++
      }
    }else{
      if( selectedIndex - 1 < 0 ){
        selectedIndex = this.projects.length - 1;
      }else{
        selectedIndex--
      }
    }
    next = this.projects[ selectedIndex ];
    return next
  }

  updateMouse( mouse ){
    this.mouse = mouse
  }

  click( callback ){
    this.status = "fadingOut"
    this.fadeOutCallback = callback;
  }

  onSelectProject( callback ){
    this.onProjectSelect = callback;
  }

  getPerc(){
  }

  animate(){
    if( this.animating ){
      if( this.status === "fadingOut" ){
        this.timer.countDown();
        if( this.rotationTimer.indexTimer <= 0 ){
          if( this.rotationTimer.timer > 0  ){
            this.rotationTimer.timer -= .01;
          }
        }else{
          this.rotationTimer.indexTimer -= .04
        }
      }else{
        this.timer.countUp();
        if( this.rotationTimer.indexTimer <= this.index * .3 ){
          this.rotationTimer.indexTimer += .01
        }else{
          if( this.rotationTimer.timer < 1 ){
          }
        }
      }

      if( this.snapping === true ){
        if( this.scrolled > 0 ){
          let diff = Math.ceil(this.scrolled / 120)
          this.scrolled -= diff
          this.thing = Math.abs(this.scrolled / 3500)
        }

        if( this.scrolled < 0 ){
          let diff = Math.ceil(this.scrolled / 120)
          this.scrolled -= diff
          this.thing = Math.abs(this.scrolled / 3500)
        }
      }

      let next = this.getNextPos();

      if( this.selectedProject ){
          if( Math.abs( this.targPos.x - this.cameraPos.x  ) >= .1 ){
            let diffX = this.targPos.x - this.cameraPos.x;
            this.cameraPos.x += diffX / 30
          }

          let scrollX = this.getScrollX()
          if( scrollX < 1 ){
            this.locked = false
          }
          window.camera.rotation.set( -.3 + ( ( Easing.easeInOutQuint( Math.abs( this.timer.getCount() - 1) ) * .3) ),0,0 )
          // this.background.rotation.set( -.3 + ( ( Easing.easeInOutQuint( Math.abs( this.timer.getCount() - 1) ) * .3) ),0,0 )
          let offset = 3;
          // this.background.position.set( this.cameraPos.x + scrollX, this.cameraPos.y - offset / 3.2, -1 * offset );
          this.three.camera.position.set( this.cameraPos.x + scrollX, this.cameraPos.y , 0 );

          // if(this.backgroundCount === true){
          //   // this.backgroundTimer.countUp();
          //   this.thing = 1 - Math.abs((this.cameraPos.x - this.targPos.x) / 3500);
          // }
          // let time = this.thing + this.backgroundTimer.getCount();
          // this.background.material.uniforms.perc.value = Easing.linear(time);


        }
      }


      this.projects.forEach(
        ( project ) => {
          project.animate( this.selectedProject )
        }
      )

      if( this.status === "fadingOut" ){
         this.fadeOutTimer -= .01;
      }







      this.loadTimer.countUp();
      let mouse = new THREE.Vector2( this.mouse.x, this.mouse.y );
      this.three.composer.passes[1].screen.material.uniforms.u_scrolled.value =  (this.targPos.x - this.cameraPos.x ) / 100
      this.three.composer.passes[1].screen.material.uniforms.u_time.value = this.time
      this.three.composer.passes[1].screen.material.uniforms.u_mouse.value = mouse
      this.three.composer.passes[1].screen.material.uniforms.loadTime.value = 1;
      this.three.composer.passes[1].screen.material.uniforms.u_mag.value = Easing.easeInOutQuint(this.rotationTimer.timer);
      this.three.composer.render( this.three.clock.getDelta() )
      this.time++;
  }


}

export default Scene;
