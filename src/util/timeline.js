import Frame from "./frame";
class Timeline{
  constructor( projects ){
    this.frame = 0;
    this.projects = projects
    this.sectionLength = 1 / projects.length;
    this.increment = this.sectionLength / 100;
    this.frames = [];
    this.makeTimeline();
    this.states = [];
  }

  makeTimeline(){
    let frames = []
    for( var i = 0; i < this.projects.length; i++ ){
      let project = this.projects[i];
      this.generateFrames( project, i )
    }
  }

  generateFrames( project, index ){
    let framePosition = index * this.sectionLength
    let prev
    while( framePosition < (index * (this.sectionLength ) + this.sectionLength) ){
      let frame = new Frame( project, framePosition );
      if( prev ){
        frame.assignPrev( prev );
      }
      this.frames.push( frame )
      prev = frame;
      framePosition+=this.increment;
    }

  }
}

export default Timeline
