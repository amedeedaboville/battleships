Square = function(x,y) {
    this.position = [x,y];
}

//we want to have some sort of design that will allow shipSquares, baseSquares and  coralSquares to inherit from griddSquares???
shipSquare = function(x,y) {
    Square.call(this,x,y);
    this.health = 0;
    this.shipSquareKind = null; //this refers to if the square is a bow/stern/middle piece
    this.armorType = null;
}
coralSquare = function(x,y) {
    Square.call(this,x,y);
}
coralSquare = function(x,y) {
    Square.call(this,x,y);
}

seaSquare = function(x,y) {
    Square.call(this,x,y);
}

mineSquare = function(x,y) {
    Square.call(this,x,y);
    this.explode = function() {
        return;
        //Game.explodeMine(position)
        //also have to return the mine, increment the minelayership's mine count
    }
}

shipSquare.prototype = new Square();
mineSquare.prototype = new Square();
coralSquare.prototype= new Square();
seaSquare.prototype  = new Square();
