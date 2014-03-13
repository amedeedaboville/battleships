Ship = function(start, name, owner) {
    this.name = name;
    this.owner = owner;
    this.health = 0;
    this.speed = 0;
    this.weapons = [];
    this.bowPosition = start;
    //this.orientation = orientation || [1,0];
    this.shipSquares = [];
    this.actions = [];

    this.initalize = function () {
        this.actions.push(new MoveShip());
        this.actions.push(new TurnShip());

        for (var i=0 ; i < this.shipLength; i++) {
            var x = start[0] + i * this.orientation[1];
            var y = start[1] + i * this.orientation[0];
            //push it to the shipSquares
            //if it is a bow
            var newSquare = new shipSquare(x,y, this.name, this.owner);

            // if its a base
            if(this.orientation[0] == 0)
                newSquare.css = newSquare.css + " base";
            //if it is a head
            else if(i == this.shipLength - 1) { 
                newSquare.css = newSquare.css + " bow";
            }
            this.shipSquares.push(newSquare);
        }
    }
/*
    this.defaultAction = function() {
        console.log("Ship with owner " + this.owner + " called an action");
    }
    this.move = function(destination) {
        //destination is a Square
        //calculate an array of Squares called PATH between bowPosition and destination
        //pass PATH to the Grid method IsPathClear, which returns a Square
        //Move ship to square and create a new Collision object if applicable
    }

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

Cruiser = function(start, name, owner, orientation) {
    Ship.call(this,start, name, owner);
    this.shipLength = 5;
    this.speed = 10;
    this.orientation = orientation || [1,0];
    this.weapons = ["Heavy Cannon"];
    this.initalize();
}

Destroyer = function(start, name, owner, orientation) {
    Ship.call(this,start, name, owner);
    this.shipLength = 4;
    this.speed = 8;
    this.orientation = orientation || [1,0];
    this.weapons = ["Cannon", "Torpedo"];
    this.initalize();
}

Radar = function(start, name, owner, orientation) {
    Ship.call(this,start, name, owner);
    this.shipLength = 3;
    this.speed = 3;
    this.orientation = orientation || [1,0];
    this.weapons = ["Cannon"];
    this.initalize();
}

Torpedo = function(start, name, owner, orientation) {
    Ship.call(this,start, name, owner);
    this.length = 3;
    this.speed = 9;
    this.orientation = orientation || [1,0];
    this.weapons = ["Cannon", "Torpedo"];
    this.initalize();
}

MineLayer = function(start, name, owner, orientation) {
    Ship.call(this,start, name, owner);
    this.shipLength = 2;
    this.speed = 6;
    this.orientation = orientation || [1,0];
    this.weapons = ["Cannon", "Mine"];
    this.initalize();
}

Base = function(start, name, owner) {
    Ship.call(this,start, name, owner);
    this.shipLength = 10;
    this.speed = 0;
    this.orientation = [0,1];
    this.initalize();
}



Cruiser.prototype = new Ship();
Destroyer.prototype = new Ship();
Radar.prototype = new Ship();
Base.prototype = new Ship();
