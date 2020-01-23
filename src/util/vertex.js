const SimplexNoise = require( "simplex-noise" )

const Easing = require( "./easing" );

class Vertex{
  constructor( vertex, index, scene ){
    this.vertex = vertex;
    this.index = index;
    this.scene = scene;
    this.noise = new SimplexNoise();
    this.positionZTimer = { indexTimer: 0, timer: 0 };
    this.setup()
  }

  setup(){
    this.position = this.vertex.clone();

    if( this.scene.status === "fadingOut" ){

      if( this.positionZTimer.indexTimer <= 0 ){
        if( this.positionZTimer.timer > 0  ){
          this.positionZTimer.timer -= .01;
        }
      }else{
        this.positionZTimer.indexTimer -= .05
      }
    }else if( this.positionZTimer.timer < 1 ){
      if( this.positionZTimer.indexTimer <= this.index * .3 ){
        this.positionZTimer.indexTimer += .05
      }else{
        if( this.positionZTimer.timer < 1 ){
          this.positionZTimer.timer += .01;
        }
      }
    }

    this.vertex.z = this.position.z
    + ((Math.sin( (this.scene.time / 40 ) + ( this.position.x/ 200) )* 100) ) * this.scene.rotationTimer.timer

  }


  animate(){
    if( this.position ){

      if( this.scene.status === "fadingOut" ){

        if( this.positionZTimer.indexTimer <= 0 ){
          if( this.positionZTimer.timer > 0  ){
            this.positionZTimer.timer -= .01;
          }
        }else{
          this.positionZTimer.indexTimer -= .05
        }
      }else if( this.positionZTimer.timer < 1 ){
        if( this.positionZTimer.indexTimer <= this.index * .3 ){
          this.positionZTimer.indexTimer += .05
        }else{
          if( this.positionZTimer.timer < 1 ){
            this.positionZTimer.timer += .01;
          }
        }
      }

      this.vertex.z = this.position.z
      + ((Math.sin( (this.scene.time / 40 ) + ( this.position.x/ 200) )* 100) ) * this.scene.rotationTimer.timer



    }
  }
}

export default Vertex;
