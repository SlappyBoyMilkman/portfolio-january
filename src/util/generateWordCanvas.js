module.exports = function( word, fs, color, backgroundColor ){
  let canvas = document.createElement( "canvas" );
  let ctx = canvas.getContext( "2d" );
  let fontSize;
  if( fs ){
    fontSize = fs;
  }else{
    fontSize = "10vh"
  }
  let div = document.createElement( "div" );
  document.body.appendChild( div )
  div.style.fontSize = fontSize;
  div.style.display = "inline-block";
  let letterData = {}
  word.split("").forEach(
    ( letter ) => {
      let span = document.createElement( "span" );
      span.innerText = letter;
      div.appendChild( span )
      if( !letterData[letter] ){
        letterData[ letter ] = [{ left: span.offsetLeft, width: span.offsetWidth, height: span.offsetHeight }]
      }else{
        letterData[letter].push({ left: span.offsetLeft, width: span.offsetWidth, height: span.offsetHeight })
      }
    }
  )

  canvas.width = div.offsetWidth;
  canvas.height = div.offsetHeight * 1.5;

  word.split("").forEach(
    ( letter ) => {
      ctx.font = `${fontSize} graphik`;
      let arr = letterData[letter]
      var data = arr.shift();
      ctx.fillText( letter, data.left, data.height )
    }
  );
  
  div.remove();
  return canvas
}
