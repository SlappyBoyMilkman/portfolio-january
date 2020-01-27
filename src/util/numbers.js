import Number from "./number";

class Numbers{
  constructor( index, status, three ){
    this.index = index;
    this.status = status;
    this.time = 0;
    this.nums = [];
    this.three = three
    this.setup();
  }

  setup(){
    let total = this.index > 0 ? 10: 2;
    let isHundred = this.index > 0 ? false: true;
    for( var i = 0; i < total; i++ ){
      let num = new Number( this.index, i, this.status, this.three, isHundred );
      this.nums.push( num )
    }
  }

  updateStatus( status ){
    console.log( status )
    this.nums.forEach(
      ( num, index ) => {
        this.status = status;
        if( status.toString().length === 2 ){
          status = "0"+status.toString();
        }else if( status.toString().length === 1 ){
          status = "00" + status.toString();
        }
        num.updateStatus( status[ this.index ] )
      }
    );
  }

  animate(){
    this.time ++;
    this.nums.forEach(
      ( num, index ) => {
        num.animate.bind( num )( this.time );
      }
    );
  }
}

export default Numbers;
