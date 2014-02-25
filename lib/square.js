function square(x,y) {
  this.position = [x,y];
  this.name = "none";
}

shipSquare.prototype = square;
mineSquare.prototype = square;
coralSquare.prototype = square;
seaSquare.prototype = square;

//we want to have some sort of design that will allow shipSquares, baseSquares and  coralSquares to inherit from griddSquares???
function shipSquare() {
  this.health = 0;
  this.shipSquareKind = null; //this refers to if the square is a bow/stern/middle piece
  this.armorType = null;
  this.position = null; //this is the position of the particular square
}


function coralSquare() {
}

function seaSquare() {
}

function mineSquare() {
  this.position = null;
  this.explode = function() {
    return;
    //Game.explodeMine(position)
    //also have to return the mine, increment the minelayership's mine count
  }
}
