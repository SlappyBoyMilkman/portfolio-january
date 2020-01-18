class Element{
  constructor(){
    let random = Math.random();
    this.direction = 1;
    if( random > .5 ){
      this.direction = -1
    }

  }

  setup(){

  }

  animate(){

  }
}

export default Element
