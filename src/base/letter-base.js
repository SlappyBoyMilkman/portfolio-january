const THREE = require( "three" );

class LetterBase{
  constructor( word ){
    this.word = word;
    this.system = word.system;
  }
}

export default LetterBase;
