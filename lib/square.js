Square = function(x,y) {
    this.position = [x,y];
    this.css = "square";
    this.name = "square";
    this.calculateAttributes = function() {
        this.attributes = 'position=' + JSON.stringify(this.position);
    }
    this.calculateAttributes();

    this.setVisible = function(bool) {
        if(!bool){
           this.css = this.css + " fog";
        }
        else {
           this.css = this.css.replace(" fog", "");
        }
    }
    this.calculateAttributes();
    this.setVisible(false);

}

shipSquare = function(x,y, shipName, health, owner) {
    Square.call(this,x,y);
    this.health = health;
    this.shipName = shipName;
    this.shipSquareKind = null; //this refers to if the square is a bow/stern/middle piece
    this.owner = owner;//whether this is opponent or challnenger
    this.css = "ship " + this.owner;
    this.isDestroyed = false;
    this.name = "ship";
    this.calculateAttributes = function() {
        this.attributes = 'position=' + JSON.stringify(this.position) + " shipId=" + this.shipName;
    }
    this.calculateAttributes();
    //this.setVisible(true);
}
coralSquare = function(x,y) {
    Square.call(this,x,y);
    this.css = "coral";
    this.setVisible(true);
    this.name = "coral";
}

seaSquare = function(x,y) {
    Square.call(this,x,y);
    this.css = "sea";
    this.name = "sea";
    this.setVisible(false);
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
