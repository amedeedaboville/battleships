Ship = function(start, end , owner/*, shipType*/) {
    this.owner = owner;
    this.speed = 0;
    this.weapons = [];
    this.bowPosition = null; //this will be defined, x-y position
    this.orientation = null;
    this.shipSquares = [];

    //Initialize all the squares
    for (var i=start[1] ; i <= end[1]; i++) {
        for (var j=start[0]; j <= end[0]; j++) {
            this.shipSquares.push(new shipSquare(i,j, this.owner)); //where PLayer is a string 
        }
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
