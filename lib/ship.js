Ship = function(start, name, owner, orientation) {
    this.name = name;
    this.owner = owner;
    this.health = 0;
    this.speed = 0;
    this.weapons = [];
    this.bowPosition = null; //this will be defined, x-y position
    this.orientation = orientation || [1,0];
    this.shipSquares = [];
    this.actions = [];

    this.initalize = function () {
        //this.actions.push(new Action("Move", this.defaultAction));
        //this.actions.push(new Action("Turn", this.defaultAction));

        //Initialize all the squares
        for (var i=0 ; i <= this.length; i++) {
            var x = start[0];
            var y = start[1] + i;
            this.shipSquares.push(new shipSquare(x,y, this.name, this.owner)); //where PLayer is a string 
        }

        //this.health = this.shipSquares.reduce(function(a,b) { return a + b.health}, 0); //sums the health
    }
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
}

Cruiser = function(start, name, owner) {
    Ship.call(this,start, name, owner);
    this.length = 5;
    this.speed = 10;
    this.weapons = ["Heavy Cannon"];
    this.initalize();
}

Destroyer = function(start, name, owner) {
    Ship.call(this,start, name, owner);
    this.length = 4;
    this.speed = 8;
    this.weapons = ["Cannon", "Torpedo"];
    this.initalize();
}

Radar = function(start, name, owner) {
    Ship.call(this,start, name, owner);
    this.length = 3;
    this.speed = 3;
    this.weapons = ["Cannon"];
    this.initalize();
}

Cruiser.prototype = new Ship();
Destroyer.prototype = new Ship();
Radar.prototype = new Ship();
