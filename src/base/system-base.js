const THREE = require( "three" );

class SystemBase{
  constructor( system ){
    this.interfaceElements = [];
    this.interfaceIndex = 0;
    this.animating = true;
    this.interfaceUpdeteListeners = [];
    this.three = {};
    this.lights = [];
    this.words = []
    this.addVectorThree( "position", "system", new THREE.Vector3( 0,0,-1000 ), 10, false )
    this.addVectorThree( "scale", "system", new THREE.Vector3( 1,1,0 ), .001, false )
    this.addVectorThree( "rotation", "system", new THREE.Vector3( 0,0,0 ), .05, false )
  }

  setupTHREEPerspective( that ){
    this.three.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });
    let renderer = this.three.renderer;
    if( this.settings.backgroundColor ){
      renderer.setClearColor( 0x000000, 0 );
    }else{
      renderer.setClearColor( 0x000000, 0 );
    }
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( this.canvas.offsetWidth, this.canvas.offsetHeight );
    this.three.camera = new THREE.PerspectiveCamera( 35, this.canvas.offsetWidth / this.canvas.offsetHeight, 0.1, 5000 );
    this.three.scene = new THREE.Scene();
    this.three.clock = new THREE.Clock();
  }

  setupTHREEOrtho( that ){
    this.three.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true });
    let renderer = this.three.renderer;
    if( this.settings.backgroundColor ){
      renderer.setClearColor( 0x000000, 0 );
    }else{
      renderer.setClearColor("green" );
    }
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    this.three.camera = new THREE.OrthographicCamera( window.innerWidth / - 2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / - 2, 1, 4000 );
    this.three.scene = new THREE.Scene();
    this.three.clock = new THREE.Clock();
  }

  addInterfaceUpdateListener( func ){
    this.interfaceUpdeteListeners.push( func );
  }


  interfaceUpdate( needsUpdate ){

    for( let i = 0; i < this.interfaceUpdeteListeners.length; i++ ){
      let update = this.interfaceUpdeteListeners[i];
      update();
    }
    if( needsUpdate ){
      this.remove();
    }
  }

  updateInterfaceElement( name, value ){
    let interfaceElement = this.getInterfaceElement(name);
    interfaceElement.value = value;
    this.interfaceUpdate( interfaceElement.needsUpdate );
  }

  getInterfaceElement( name ){
    return this.interfaceElements[name]
  }

  addSlider( name, group, deflat, min, max, increment, needsUpdate ){
    if( !needsUpdate && needsUpdate != false ){
      needsUpdate = true
    }

    let obj = {
      index: this.interfaceIndex,
      type: "Slider",
      name: name,
      group: group,
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

  addVectorThree( name, group, deflat, increment, needsUpdate ){
    if( !needsUpdate && needsUpdate != false ){
      needsUpdate = true
    }

    let obj = {
      index: this.interfaceIndex,
      type: "Vector Three",
      name: name,
      group: group,
      default: deflat,
      value: deflat,
      increment: increment,
      needsUpdate: needsUpdate
    }

    this.interfaceElements[ name ] = obj;
    this.interfaceIndex++;
  }

  addString( name, group, deflat, needsUpdate ){
    if( !needsUpdate && needsUpdate != false ){
      needsUpdate = true
    }

    let obj = {
      index: this.interfaceIndex,
      type: "String",
      name: name,
      group: group,
      default: deflat,
      value: deflat,
      needsUpdate: needsUpdate
    }

    this.interfaceElements[ name ] = obj;
    this.interfaceIndex++;
  }

  addVectorTwo( name, group, deflat, type, needsUpdate ){
    if( !needsUpdate && needsUpdate != false ){
      needsUpdate = true
    }

    let obj = {
      index: this.interfaceIndex,
      type: "Vector Two",
      name: name,
      group: group,
      default: deflat,
      value: deflat,
      needsUpdate: needsUpdate
    }
    this.interfaceElements[ name ] = obj;
    this.interfaceIndex++;
  }

  addAmbientLight( mesh ){
    let ambientLight = new THREE.AmbientLight( "white", .1 );
    this.lights.push( ambientLight );
    if( mesh ){
      mesh.add( ambientLight );
    }else{
      this.three.scene.add( ambientLight )
    }
    return ambientLight;
  }

  addPointLight( mesh ){
    let light = new THREE.PointLight( "white", 8, 1200 );
    light.position.set( 0,0,200 )
    light.castShadow = true;
    light.shadow.mapSize.width = 512;  // default
    light.shadow.mapSize.height = 512; // default
    light.shadow.camera.near = 0.5;       // default
    light.shadow.camera.far = 500
    this.lights.push( light )
    if( mesh ){
      mesh.add( light );
    }else{
      this.three.scene.add( light )
    }
    return light;
  }

  addMesh(){
    this.geometry = new THREE.BoxGeometry( .1, .1, .1 );
    this.material = new THREE.MeshBasicMaterial();
    this.mesh = new THREE.Mesh( this.geometry );
    this.three.scene.add( this.mesh );
  }

  removeLights(){
    this.lights.map(
      function( light ){
        this.three.scene.remove( light )
      }.bind( this )
    )
  }


}

export default SystemBase;
