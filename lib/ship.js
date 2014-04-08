var HEAVY = 2;
var NORMAL = 1;
Ship = function(start, id, armorType, owner) {
    this.name = "ship";
    this.id = id;
    this.owner = owner;
    this.health = 0;
    this.speed = 0;
    this.isAlive = true;
    this.weapons = [];
    this.sternPosition = start;
    this.shipSquares = [];
    this.healingPos = [[9,0], [10,1],[11,1],[12,1],[13,1],[14,1],[15,1],[16,1],[17,1], [18,1], [19,1], [20,0], [9, 29], [10,28],[11,28],[12,28],[13,28],[14,28],[15,28],[16,28],[17,28], [18,28], [19,28], [20,28]]
   
    
    this.radarStart = [];
    this.radarRange = [];
    this.radarSquares = [];
    
    this.cannonStart = [];
    this.cannonRange = [];
    this.cannonPositions = [];

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
    };

/**
* NAME: zoneContains
* PURPOSE: essentially a 'contains' method for our hacky zones... if a position is in the list, return true
*/
    this.zoneContains = function(positions, targetPosition) {
        //console.log("Zone size: " +positions.length);
        
        for (var i =0; i < positions.length; i++) {
            var p = positions[i];
            if (targetPosition[0] == p[0] && targetPosition[1] == p[1]) {
                return true;
            }
        }
        return false;
    }; 

/**
* NAME: calculateAttributes 
* PURPOSE: update the changes made to the ship this turn -- health, speed, isAlive
*/
    this.calculateAttributes = function() {
        console.log(this);
        if (this.isAlive == false)
            return;

        //Health and square status

        var thisHP = 0;
        var intactSquares = this.shipSquares.length;
        for (var i=0; i < this.shipSquares.length;i++) {
             if(this.shipSquares[i].health != 0)
             {
                 thisHP += shipSquares[i].health; 
             } else {
                 intactSquares--;
             }
        }
        this.health = thisHP;   
        
        //mark ship as dead if it is
        if (this.health == 0 || intactSquares == 0) 
            this.isAlive = false;

        //Speed -- set equal to the percentage of non-destroyed squares
        //according to formula in requirements
        this.speed = Math.floor(this.speed * intactSquares/this.shipSquares.length); 

    };        

    this.setZones = function(){
        var radarZone = new Zone(this.orientation, this.radarRange, this.radarStart);
        this.radarSquares = radarZone.enumerateSquares();

        var cannonZone = new Zone(this.orientation, this.cannonRange, this.cannonStart);
        this.cannonPositions = cannonZone.enumerateSquares();
    }

    this.extendRadar = function(){
        this.radarRange = [12,3];
        this.setZones();
    }

    this.healShip = function(){
        for (var i=this.shipSquares.length; i >= 0; i--) 
            if(this.shipSquares[i].health != this.shipSquares[i].maxHealth) {
                this.shipSquares[i].health = this.shipSquares[i].maxHealth;
                return;
            }
    }

/**
* NAME: shipMoveShip (int distance, boolean straight)
*/
    this.moveStraight = function (distance, straight) {
        var move = scalarMultiply(distance, this.orientation);

        //set the sternposition, bow position, cannon positions
        this.sternPosition = sum(this.sternPosition, move);
        this.updateShip(move);

    }

    this.moveSideways = function (distance, straight) {
        var move = flip(scalarMultiply(distance, dotMultiply(this.orientation, this.orientation)));


        //set the sternposition, bow position, cannon positions
        this.sternPosition = sum(this.sternPosition, move);
        this.updateShip(move);
    }

    this.updateShip = function(move){
        //this still does not work for rotate
        this.radarStart = sum(this.radarStart, move);
        this.cannonStart = sum(this.cannonStart, move);

     
        if(this.name== 'Radar Ship')
            this.radarRange = [6,3];

        this.setZones(); 
        this.bowPosition = [this.sternPosition[0] + (this.shipLength - 1) * this.orientation[0],
                            this.sternPosition[1] + (this.shipLength - 1) * this.orientation[1]]

        for(var i = 0; i < this.shipLength; i++) {
            this.shipSquares[i].position = [ this.sternPosition[0] + i * this.orientation[0],
                                             this.sternPosition[1] + i * this.orientation[1]];
            this.shipSquares[i].__proto__ = new shipSquare(); 
            this.shipSquares[i].orientation = this.orientation;
            //recalculate css props
            this.shipSquares[i].calculateAttributes();
        }

        //if it is next to base, add the healship action. if it isnt next to the base, if healship is in the array yank it.
        if (this.isNextToBase()){
            this.actions.push(HealShip)
        } 
        else this.actions.pop(HealShip);

    }

    this.isNextToBase = function(){
        //checks if the square is next to the base
        for (var i=0; i < this.shipSquares.length;i++) 
             for(var j=0; j< this.healingPos.length; j++)
                if(equals(this.shipSquares[i].position, this.healingPos[j])) 
                    return true;
        
        return false
    }

    this.getSquareAtPosition = function(position){
        for (var i=0;i< this.shipSquares.length; i++){
            if(this.shipSquares[i].position[0] == position[0] &&
                this.shipSquares[i].position[1] == position[1]){
                this.shipSquares[i].__proto__ = new Square();
                return this.shipSquares[i];
            }
        }
        return undefined;
    }

    this.setSquareAtPosition = function(position, obj){
        for (var i=0;i< this.shipSquares.length; i++){
            if(this.shipSquares[i].position[0] == position[0] &&
                this.shipSquares[i].position[1] == position[1]){
                this.shipSquares[i] = obj;
            }
        }
    }
    this.takeDamage = function(position, damage){
        var square = this.getSquareAtPosition(position); //visual
        square.health -= damage;
        if (square.health == 1) {
            square.setNormal(true);
        } else if (square.health < 1) {
            square.health = 0;
            square.setDamaged(true);
        }
    }
}




/*
    this.rotate = function(CARDINAL_DIRECTION){
        //calculate an array fo Squares called ZONE based on bowPostion and CARDINAL_DIRECTION`
        //pass PATH to the Grid method IsPathClear, which returns a Square
        //Move ship to square and create a new Collision object if applicable
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
    this.cannonRange = [15,11];

    //turn zone
    this.turnArea = [[1,1], [1,2], [1,3], [1,4], [2,1],[2,2],[2,3], [3,1],[3,2],[4,1]];

    //the cruiser radar needs to start at the stern position, + 1 along the vector of the direction of the ship. 
    this.radarStart = sum(this.sternPosition, this.orientation);
    this.cannonStart = sum(this.sternPosition, scalarMultiply(-8, this.orientation));

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
    this.cannonRange = [12,9];

    //turn zone
    this.turnArea = [[1,1], [1,2], [1,3], [2,1],[2,2],[3,1]];

    //the destroyer radar needs to start at the stern position, + 1 along the vector of the direction of the ship. 
    this.radarStart = sum(this.sternPosition, this.orientation);
    this.cannonStart = sum(this.sternPosition, scalarMultiply(-6, this.orientation));

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
    this.cannonRange = [5,3]

    //turn zone
    this.turnArea = [[-1,0], [2,1]];

    //the radar needs to start at the stern position, + 1 along the vector of the direction of the ship. 
    this.radarStart = sum(this.sternPosition, this.orientation);
    this.cannonStart = sum(this.sternPosition, scalarMultiply(-1, this.orientation));
    this.actions.push(ExtendRadar);
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
    this.cannonRange = [5,5];

    //turn zone
    this.turnArea = [[-1,0], [2,1]];

    //the torpedo radar needs to start at the stern position, + 1 along the vector of the direction of the ship. 
    this.radarStart = sum(this.sternPosition, this.orientation);
    this.cannonStart = this.sternPosition;
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
    this.cannonRange = [4,5];

    this.remainingMines = 5; 
    this.mineArea = [[-1,0],[0,1],[1,1],[0,-1],[1,-1],[2,0]];


    //turn zone
    this.turnArea = [[1,1]];
    this.cannonStart = sum(this.sternPosition, scalarMultiply(-1, this.orientation));

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
var equals = function (u,v) {
    return (u[0] == v[0] && u[1] == v[1])
}

Cruiser.prototype = new Ship();
Destroyer.prototype = new Ship();
Radar.prototype = new Ship();
Base.prototype = new Ship();
Torpedo.prototype = new Ship();
MineLayer.prototype = new Ship();
Kamikaze.prototype = new Ship();
