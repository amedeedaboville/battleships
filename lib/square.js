Square = function(x,y) {
    this.position = [x,y];
    this.x = this.position[0];
    this.y = this.position[1];
    this.css = "square";
    this.name = "square";
    this.calculateAttributes = function() {
        this.shipId = undefined;
    }
    //TODO: Is this line redundant? (attributes are calculated again afterward...)
    this.calculateAttributes();

    this.setVisible = function(bool) {
        if(!bool){
           this.css = this.css + " fog";
        }
        else {
           this.css = this.css.replace(" fog", "");
        }
    }

    this.setDamaged = function(bool){
        if (bool){
            if (this.health > 0){
                this.health--;
            }
            if (this.css.indexOf("damagedSquare") == -1){
                this.css = this.css + " damagedSquare"
            }
        }
        else{
           this.css = this.css.replace(" damagedSquare", "");
       }
    }

    this.coordinateString = function() {
        return ("["+this.x +", "+this.y+"]");
    }



    this.calculateAttributes();
    this.setVisible(false);

}

shipSquare = function(x,y, shipName, maxHealth, owner, orientation) { //orientation is a vector for direction
    Square.call(this,x,y);
    this.maxHealth = maxHealth;
    this.health = maxHealth;
    this.shipName = shipName;
    this.shipSquareKind = null; //this refers to if the square is a bow/stern/middle piece
    this.owner = owner;//whether this is opponent or challnenger
    this.css = "ship " + this.owner;
    this.isDestroyed = false;
    this.name = "ship";
    this.orientation = orientation;
    this.calculateAttributes = function() {
        this.shipId = this.shipName /*Need to change css here based on the ship's health*/;
        var tempDeg = 0;
        if(this.orientation) {
            if(this.orientation[0] === 0  && this.orientation[1] === 1)  tempDeg = 0;
            if(this.orientation[0] === 0  && this.orientation[1] === -1) tempDeg = 180;
            if(this.orientation[0] === -1 && this.orientation[1] === 0)  tempDeg = 270;
            if(this.orientation[0] === 1  && this.orientation[1] === 0)  tempDeg = 90;
        }
        this.degrees = tempDeg;
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
    this.mineHotZone = undefined;
    this.mine = undefined;
    this.explode = function() {
        if (this.mine){
            console.log('zomg a mine exploded!')
        }
        if (this.mineHotZone){
            this.mineHotZone.explode();
        }
    //Game.explodeMine(position)
    //also have to return the mine, increment the minelayership's mine count
    }
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
