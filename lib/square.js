Square = function(x,y) {
    this.position = [x,y];
    this.css = "square";
    this.name = "square";
    this.calculateAttributes = function() {
        this.attributes = 'position=' + JSON.stringify(this.position);
    }
    this.calculateAttributes();
}

//we want to have some sort of design that will allow shipSquares, baseSquares and  coralSquares to inherit from griddSquares???
shipSquare = function(x,y, shipName, owner) {
    Square.call(this,x,y);
    this.health = 0;
    this.shipName = shipName;
    this.shipSquareKind = null; //this refers to if the square is a bow/stern/middle piece
    this.armorType = 1;
    this.owner = owner;//whether this is opponent or challnenger
    this.css = "ship " + this.owner;
    this.name = "ship";
    this.calculateAttributes = function() {
        this.attributes = 'position=' + JSON.stringify(this.position) + " shipId=" + this.shipName;
    }
    this.calculateAttributes();
}
coralSquare = function(x,y) {
    Square.call(this,x,y);
    this.css = "coral";
    this.name = "coral";
}

seaSquare = function(x,y) {
    Square.call(this,x,y);
    this.css = "sea";
    this.name = "sea";
}

mineSquare = function(x,y) {
    Square.call(this,x,y);
    this.css = "mine";
    this.name = "mine";
    this.explode = function() {
    //Game.explodeMine(position)
    //also have to return the mine, increment the minelayership's mine count
    }
}

shipSquare.prototype = new Square();
mineSquare.prototype = new Square();
coralSquare.prototype= new Square();
seaSquare.prototype  = new Square();
