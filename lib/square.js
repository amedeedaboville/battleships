Square = function(x,y) {
    this.position = [x,y];
    this.css = "square";
    this.attributes = 'position=' + JSON.stringify(this.position);
}

//we want to have some sort of design that will allow shipSquares, baseSquares and  coralSquares to inherit from griddSquares???
shipSquare = function(x,y, ship, owner) {
    Square.call(this,x,y);
    this.health = 0;
//    this.ship = shipT;
    this.shipSquareKind = null; //this refers to if the square is a bow/stern/middle piece
    this.armorType = null;
    this.owner = owner;//whether this is opponent or challnenger
    this.css = "ship " + owner;
}
coralSquare = function(x,y) {
    Square.call(this,x,y);
    this.css = "coral";
}

seaSquare = function(x,y) {
    Square.call(this,x,y);
    this.css = "sea";
}

mineSquare = function(x,y) {
    Square.call(this,x,y);
    this.css = "mine";
    this.explode = function() {
    //Game.explodeMine(position)
    //also have to return the mine, increment the minelayership's mine count
    }
}

shipSquare.prototype = new Square();
mineSquare.prototype = new Square();
coralSquare.prototype= new Square();
seaSquare.prototype  = new Square();
