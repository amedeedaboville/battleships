var HEAVY = 2;
var NORMAL = 1;
Ship = function(start, id, armorType, owner) {
    this.name = "ship";
    this.id = id;
    this.owner = owner;
    this.health = 0;
    this.speed = 0;
    this.isAive = true;
    this.weapons = [];
    this.sternPosition = start;
    this.shipSquares = [];
    
    this.radarStart = [];
    this.radarRange = [];
    this.radarSquares = [];
    
    this.cannonStart = [];
    this.cannonRange = [];
    this.cannonSquares = [];

    //this.orientation = orientation || [1,0];
    this.actions = [];
    this.turnArea = [[1,1]];

    this.initalize = function () {
        this.actions.push(MoveShip);
        this.actions.push(TurnShipLeft);
        this.actions.push(TurnShipRight);
        this.actions.push(FireCannon);

        for (var i=0 ; i < this.shipLength; i++) {
            var x = start[0] + i * this.orientation[0];
            var y = start[1] + i * this.orientation[1];
            //Build up ship squares and push to the array
            var newSquare = new shipSquare(x,y, this.id, this.armorType, this.owner, this.orientation);

            // if its a base
            if(this.orientation[0] == 1){
                newSquare.css = newSquare.css + " base";
                this.bowPosition = [x,y];
            }
            //if it is a bow -- note: the bow is always the last element
            else if(i == this.shipLength - 1) { 
                newSquare.css = newSquare.css + " bow";
                this.bowPosition = [x,y];
            }
            this.shipSquares.push(newSquare);
        }

       //Health is a function of the sum of the health of each square multipled by its armor type. 
        for (var i=0; i < this.shipSquares.length;i++) {
             var square = this.shipSquares[i];
             this.health += square.maxHealth; 
        }

         //Calculate which squares belong to the ship (cannon squares, visible squares)
         this.setZones();
        //TODO: other calculations?
    };

/**
* NAME: calculateAttributes 
* PURPOSE: update the changes made to the ship this turn -- health, speed, isAlive
*/
    this.calculateAttributes = function() {
        if (!this.isALive)
            return;

        //Health and square status
        var thisHP = 0;
        for (var i=0; i < this.shipSquares.length;i++) {
             var square = this.shipSquares[i];
             if (square.health > 0 && square.isDestroyed == true) //Adjusts for repaired squares
                 square.isDestroyed = false;
             thisHP += square.health; 
        }
        this.health = thisHP;
        if (this.health == 0) //mark ship as dead if it is
            this.isAlive = false;

        //Speed
        if (this.isAlive) {
            var intactSquareCount = this.shipSquares.length;
            for (var i=0; i < this.shipSquares.length; i++) {
                var square = this.shipSquares[i];
                if (square.isDestroyed) {
                    intactSquareCount--;
                }
            }
            this.speed *= (intactSquareCount/this.shipSquares.length); //accorinding to formula in requirements
        }

    };        

    this.setZones = function(){
        var radarZone = new Zone(this.orientation, this.radarRange, this.radarStart);
        this.radarSquares = radarZone.enumerateSquares();

        var cannonZone = new Zone(this.orientation, this.cannonRange, this.cannonStart);
        this.cannonSquares = cannonZone.enumerateSquares();
    }

/**
* NAME: shipMoveShip (int distance, boolean straight)
*/
    this.shipMoveShip = function (distance, straight) {
        //its either a forward move or a sideways move

        var fmove = scalarMultiply(distance, this.orientation);
        var smove = flip(scalarMultiply(distance, dotMultiply(this.orientation, this.orientation)));
        var move = fmove;

        console.log(fmove)

        if(!straight) move = smove;
        
        //set the sternposition, bow position, cannon positions
        this.sternPosition = sum(this.sternPosition, move);
        this.bowPosition = sum(this.bowPosition, move);

        this.radarStart = sum(this.radarStart, move);
        this.cannonStart = sum(this.cannonStart, move);
     
        //set the zones appropriately
        this.setZones(); 
        //change the positions of all of the squares!  
        for(var i = 0; i < this.shipLength; i++) {
            this.shipSquares[i].position = [ this.sternPosition[0] + i * this.orientation[0],
                                             this.sternPosition[1] + i * this.orientation[1]];
            this.shipSquares[i].__proto__ = new shipSquare();
            this.shipSquares[i].orientation = this.orientation;
            //recalculate css props
            this.shipSquares[i].calculateAttributes();
        }    
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
*/

Cruiser = function Cruiser(start, id, owner, orientation) {
    this.armorType = 2;//HEAVY
    Ship.call(this, start, id, this.armorType, owner);
    this.name = "Cruiser"
    this.shipLength = 5;
    this.speed = 10;
    this.orientation = orientation || [0,1]; //FACING RIGHT
    this.weapons = ["Heavy Cannon"];
    this.radarRange = [10,3];

    //turn zone
    this.turnArea = [[1,1], [1,2], [1,3], [1,4], [2,1],[2,2],[2,3], [3,1],[3,2],[4,1]];

    //the cruiser radar needs to start at the stern position, + 1 along the vector of the direction of the ship. 
    this.radarStart = sum(this.sternPosition, this.orientation);
    this.initalize();
}

Destroyer = function Destroyer(start, id, owner, orientation) {
    this.armorType = 1; //NORMAL
    Ship.call(this, start, id, this.armorType, owner);
    this.name = "Destroyer"
    this.shipLength = 4;
    this.speed = 8;
    this.orientation = orientation || [0,1]; //FACING RIGHT
    this.weapons = ["Cannon", "Torpedo"];
    this.radarRange = [8,3];

    //turn zone
    this.turnArea = [[1,1], [1,2], [1,3], [2,1],[2,2],[3,1]];

    //the destroyer radar needs to start at the stern position, + 1 along the vector of the direction of the ship. 
    this.radarStart = sum(this.sternPosition, this.orientation);
    this.initalize();
    this.actions.push(Torpedo);
}

Radar = function Radar(start, id, owner, orientation) {
    this.armorType = 1; //NORMAL
    Ship.call(this, start, id, this.armorType, owner);
    this.name = "Radar Ship"
    this.shipLength = 3;
    this.speed = 3;
    this.orientation = orientation || [0,1]; //FACING RIGHT
    this.weapons = ["Cannon"];
    this.radarRange = [6,3]

    //turn zone
    this.turnArea = [[-1,0], [2,1]];

    //the radar needs to start at the stern position, + 1 along the vector of the direction of the ship. 
    this.radarStart = sum(this.sternPosition, this.orientation);
    this.initalize();
    //this.actions.push(Sonar);
}

Torpedo = function Torpedo(start, id, owner, orientation) {
    this.armorType = 1; //NORMAL
    Ship.call(this, start, id, this.armorType, owner);
    this.name = "Torpedo"
    this.shipLength = 3;
    this.speed = 9;
    this.orientation = orientation || [0,1]; //FACING RIGHT
    this.weapons = ["Cannon", "Torpedo"];
    this.radarRange = [6,3];

    //turn zone
    this.turnArea = [[-1,0], [2,1]];

    //the torpedo radar needs to start at the stern position, + 1 along the vector of the direction of the ship. 
    this.radarStart = sum(this.sternPosition, this.orientation);
    this.initalize();
    this.actions.push(FireTorpedo);
}

MineLayer = function MineLayer(start, id, owner, orientation) {
    this.armorType = 2; //HEAVY
    Ship.call(this, start, id, this.armorType, owner);
    this.name = "Mine Layer"
    this.shipLength = 2;
    this.speed = 6;
    this.orientation = orientation || [0,1]; //FACING RIGHT
    this.weapons = ["Cannon", "Mine"];
    this.radarRange = [6,5];

    this.remainingMines = 5; 
    this.mineArea = [[1,1],[1,2],[-1,1],[-1,2],[-1,0],[2,0]];


    //turn zone
    this.turnArea = [[1,1]];

    //the minelayer radar needs to start at the stern position, + 1 along the vector of the direction of the ship. 
    this.radarStart = sum(this.sternPosition, scalarMultiply( (-2), this.orientation));
    this.initalize();
    this.actions.push(LayMine);
    this.actions.push(PickupMine);
}

//TODO: finish
Kamikaze = function Kamikaze(start, id, owner, orientation){
    this.armorType = 2; //HEAVY;
    Ship.call(this, start, id, this.armorType, owner);
    this.name = "Kamikaze";
    this.shipLength = 1;
    this.speed = 2; //But can move in any direction....
    this.orientation; //doesn't matter....
    this.weapons = ["Self-Destruct"];
    this.radarRange = [5,5];
    this.initialize();
    //this.actions.push(SelfDestruct);
};

Base = function Base(start, id, owner) {
    this.armorType = 1; //NORMAL
    Ship.call(this, start, id, this.armorType, owner);
    this.name = "Base"
    this.shipLength = 10;
    this.speed = 0;
    this.orientation = [1,0];
    this.initalize();
    this.actions = [];
}

var flip = function(u){  
    return [u[1],u[0]];
}
var dotMultiply = function(u, v){
    return [u[0] * v[0], u[1] * v[1]];
}

var sum = function(u,v){
    return [u[0] + v[0], u[1] + v[1]];
}

var difference = function(u,v){
    return [u[0] - v[0], u[1] - v[1]];
}
var scalarMultiply = function(scalar, v){
    return [scalar * v[0], scalar * v[1]];
}

Cruiser.prototype = new Ship();
Destroyer.prototype = new Ship();
Radar.prototype = new Ship();
Base.prototype = new Ship();
Torpedo.prototype = new Ship();
MineLayer.prototype = new Ship();
