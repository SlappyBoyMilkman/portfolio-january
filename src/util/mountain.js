import Peak from "./peak"

class Mountain{
  constructor( project, scene ){
    this.project = project;
    this.scene = scene;
    this.numPeaks = 4;
    this.peaks = []
    this.setup();
  }

  setup(){
    for( var i = 0; i < this.numPeaks; i++ ){
      let peak = new Peak( i, this, this.project, this.scene );
      this.peaks.push( peak );
    }
  }

  animate(){
    this.peaks.forEach(
      function( peak, index ){
        peak.animate()
      }
    )
  }
}


export default Mountain
