function Map() {
  this.grid = [];

  this.getObjectAtPosition = function(position) {
    return; //returns a square object of type coral, base, mine, or ship, otherwise sea
  }
  this.isPathClear = function(path) {
    return; 
    //takes in an ordered path, checks each square along the path
    //returns the first collision square, or null/sea otherwise.
  }
  this.isSquareClear = function(position) {
    return;
    //if the position is sea return true else false
  }
}


function Ship() {
  this.speed = 0;
  this.gridSquares = []; //the set of squares belonging to the ship
  //this.turnRadius we dont know how to do an enum yet 
  this.weapons = [];
  this.position = null; //this will be defined, x-y position
  this.orientation = null;
  this.move = function() {
  }
}

//we want to have some sort of design that will allow shipSquares, baseSquares and  coralSquares to inherit from griddSquares???
function shipSquare() {
  this.health = 0;
  this.shipSquareKind = null; //this refers to if the square is a bow/stern/middle piece
  this.armorType = null;
  this.position = null; //this is the position of the particular square
}

shipSquare.prototype = square;

function square() {
  this.position = null;
  this.name = "none";
}

function coralSquare() {
}

function seaSquare() {
  this.position = null;
}

function mineSquare() {
  this.position = null;
  this.explode = function() {
    return;
    //Game.explodeMine(position)
    //also have to return the mine, increment the minelayership's mine count
  }
}

