class Frame{
  constructor( project, framePosition ){
    this.project = project;
    this.framePosition = framePosition;
  }

  assignPrev( prev ){
    this.prev = prev;
    prev.next = this;
  }
}

export default Frame;
