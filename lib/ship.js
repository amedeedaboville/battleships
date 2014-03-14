Ship = function(start, id, owner) {
    this.name = "ship";
    this.id = id;
    this.owner = owner;
    this.health = 0;
    this.speed = 0;
    this.weapons = [];
    this.sternPosition = start;
    //this.orientation = orientation || [1,0];
    this.shipSquares = [];
    this.radarRange = [];
    this.actions = [];

    this.initalize = function () {
        this.actions.push(MoveShip);
        this.actions.push(TurnShipLeft);
        this.actions.push(TurnShipRight);

        for (var i=0 ; i < this.shipLength; i++) {
            var x = start[0] + i * this.orientation[0];
            var y = start[1] + i * this.orientation[1];
            //push it to the shipSquares
            //if it is a bow
            var newSquare = new shipSquare(x,y, this.id, this.owner);

            // if its a base
            if(this.orientation[0] == 1)
                newSquare.css = newSquare.css + " base";
            //if it is a head
            else if(i == this.shipLength - 1) { 
                newSquare.css = newSquare.css + " bow";
                this.bowPosition = [x,y];
            }
            this.shipSquares.push(newSquare);
        }
       //Health is a function of the sum of the health of each square multipled by its armor type. 
        for (var i=0; i < this.shipSquares.length;i++){
             var square = this.shipSquares[i];
             this.health += square.health * square.armorType; 
        }
    }
/*
    this.rotate = function(CARDINAL_DIRECTION){
        //calculate an array fo Squares called ZONE based on bowPostion and CARDINAL_DIRECTION`
        //pass PATH to the Grid method IsPathClear, which returns a Square
        //Move ship to square and create a new Collision object if applicable
    }

    this.takeDamage = function(affectedSquares, weaponType){
        //affectedSquares is an array of squares
        //for Square in affectedSquares
        //  "decrement" health based on weaponType (some weapons do double damage)
    }

    this.isAlive = function(){
        //for shipSquare in shipSquares
        //  if (shipSquare.health != 0) return false
        //return true
    }
    */
}

Cruiser = function Cruiser(start, id, owner, orientation) {
    Ship.call(this,start, id, owner);
    this.name = "Cruiser"
    this.shipLength = 5;
    this.speed = 10;
    this.orientation = orientation || [0,1]; //FACING RIGHT
    this.weapons = ["Heavy Cannon"];
    this.radarRange = [10,3];

    this.initalize();
}

Destroyer = function Destroyer(start, id, owner, orientation) {
    Ship.call(this,start, id, owner);
    this.name = "Destroyer"
    this.shipLength = 4;
    this.speed = 8;
    this.orientation = orientation || [0,1]; //FACING RIGHT
    this.weapons = ["Cannon", "Torpedo"];
    this.radarRange = [8,3];
    this.initalize();
}

Radar = function Radar(start, id, owner, orientation) {
    Ship.call(this,start, id, owner);
    this.name = "Radar Ship"
    this.shipLength = 3;
    this.speed = 3;
    this.orientation = orientation || [0,1]; //FACING RIGHT
    this.weapons = ["Cannon"];
    this.radarRange = [6,3]
    this.initalize();
}

Torpedo = function Torpedo(start, id, owner, orientation) {
    Ship.call(this,start, id, owner);
    this.name = "Torpedo"
    this.length = 3;
    this.speed = 9;
    this.orientation = orientation || [0,1]; //FACING RIGHT
    this.weapons = ["Cannon", "Torpedo"];
    this.radarRange = [6,3];
    this.initalize();
}

MineLayer = function MineLayer(start, id, owner, orientation) {
    Ship.call(this,start, id, owner);
    this.name = "Mine Layer"
    this.shipLength = 2;
    this.speed = 6;
    this.orientation = orientation || [0,1]; //FACING RIGHT
    this.weapons = ["Cannon", "Mine"];
    this.radarRange = [6,5];
    this.initalize();
}

Base = function Base(start, id, owner) {
    Ship.call(this,start, id, owner);
    this.name = "Base"
    this.shipLength = 10;
    this.speed = 0;
    this.orientation = [1,0];
    this.initalize();
}



Cruiser.prototype = new Ship();
Destroyer.prototype = new Ship();
Radar.prototype = new Ship();
Base.prototype = new Ship();
