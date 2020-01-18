const Easing = require( "./easing" );

class Timer{
  constructor( maxDelayTime, timeInc, zero ){
    this.maxDelayTime = maxDelayTime;
    this.timeInc = timeInc;
    this.countingDown = false;
    this.countingUp = false;
    this.zero = zero;
    if( zero === true ){
      this.delayTime = 0;
      this.time = 0;
    }else{
      this.delayTime = maxDelayTime;
      this.time = 1;
    }
  }

  countUp(){
    if( this.delayTime < this.maxDelayTime ){
      this.delayTime += .01;
    }else{
      if( this.time < 1 ){
        this.time += this.timeInc;
      }else{
        if( this.callback ){
          this.callback();
        }
      }
    }
  }

  countDown(){
    if( this.delayTime > 0 ){
      this.delayTime -= .01;
    }else{
      if( this.time > 0 ){
        this.time -= this.timeInc;
      }else{
        if( this.reset ){
          this.reset();
        }
      }
    }
  }

  resetTimer(){
    if( this.zero === true ){
      this.delayTime = 0;
      this.time = 0;
    }else{
      this.delayTime = this.maxDelayTime;
      this.time = 1;
    }
  }

  assignReset( func ){
    this.reset = func;
  }

  getCount(){
    return this.time;
  }

  addCallback( callback ){
    this.callback = callback
  }


}

export default Timer
