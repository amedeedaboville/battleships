Square = function() {
    this.position = null;
    this.name = null;
}

//we want to have some sort of design that will allow shipSquares, baseSquares and  coralSquares to inherit from griddSquares???
shipSquare = function() {
    Square.call(this);
    this.health = 0;
    this.shipSquareKind = null; //this refers to if the square is a bow/stern/middle piece
    this.armorType = null;
}


coralSquare = function() {
    Square.call(this);
}

<<<<<<< HEAD
seaSquare = function() {
    Square.call(this);
=======
function seaSquare() {
>>>>>>> e2cffde4ea8f0685cbc495e839789975b4b4f511
}

mineSquare = function() {
    Square.call(this);
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
