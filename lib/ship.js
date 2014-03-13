Ship = function(start, end , owner/*, shipType*/) {
//    this.name = name;
    this.owner = owner;
    this.speed = 0;
    this.weapons = [];
    this.bowPosition = null; //this will be defined, x-y position
    this.orientation = null;
    this.shipSquares = [];
    this.actions = [];
    this.actions.push(new Action("Move", this.defaultAction));
    this.actions.push(new Action("Turn", this.defaultAction));

    //Initialize all the squares
    for (var i=start[0] ; i <= end[0]; i++) {
        for (var j=start[1]; j <= end[1]; j++) {
            this.shipSquares.push(new shipSquare(i,j, this.owner)); //where Player is a string 
        }
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
