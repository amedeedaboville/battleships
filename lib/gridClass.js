Grid = function () {
    this.squares = [];
    //build the sea
    for(var i = 0; i < 30; i++) {
        this.squares[i] = [];
        for( j = 0; j < 30; j++) {
            this.squares[i].push(new seaSquare(i,j));
        }
    }

    //coral spots
    this.coralSpots = [];
    while(this.coralSpots.length < 24) {
        var newSpot = [getRandomInt(3,26), getRandomInt(10,20)];
        var spotAlreadyPicked = false;
        for(var i = 0; i < this.coralSpots.length; i++) {
            if(this.coralSpots[i][0] == newSpot[0] && this.coralSpots[i][1] == newSpot[1]) {
                spotAlreadyPicked  = true;
                break;
            }
        }

        if (!spotAlreadyPicked) {
            this.coralSpots.push(newSpot);
            this.squares[newSpot[0]][newSpot[1]] = new coralSquare(newSpot[0], newSpot[1]);
        }
    }

    //returns a square object of type coral, base, mine, or ship, otherwise sea
    this.getObjectAtPosition = function(position) {
        return this.squares[position[0]][position[1]];
    }

    this.getDistanceBetween = function(position1, position2){
        var x1 = position1[0];
        var x2 = position2[0];
        var y1 = position1[1];
        var y2 = position2[1];

        //The same x value means we have a vertical path, so we'll calculate the distance between the y values
        if (x1 === x2){
            //Pick the largest value (the other will be negative)
            return (Math.max(y2-y1, y1-y2));
        } else if (y1 === y2){
            //Horizontal path
            return (Math.max(x2-x1, x1-x2));
        } else {
            //The positions are not along the same row or column -- error
            return -1;
        }
    };

    //If an obstacle (base, coral, ship), return the square before the obstacle. 
    //takes in an ordered path, checks each square along the path
    //returns the first collision square, or null/sea otherwise.
    //Usage: calculateDestion(Squares[] path, String moveKind) 
    this.calculateDestination = function(pathToCheck, moveKind){
        var result = this.isAreaClear(pathToCheck);
        console.log("result is");
        console.log(result);
        switch(moveKind) {
            case 'forward':
                if (result != true) { //Only occurs if path is not clear.
                    console.log("result checking is good");
                    var obstructingSquare = result;
                    for(var i = 1; i < pathToCheck.length; i++) { //Return previous square
                        if(pathToCheck[i] == result) {
                            return pathToCheck[i-1];
                        }
                    }
                    console.log("returning false");
                    return false;
                }
                //If no obstructon, return the last element in the path
                return pathToCheck[pathToCheck.length -1];
                break;
            case 'backward':
                if (result === true) { //The path is clear,so return the single square.
                    return (pathToCheck[0]);
                } 
                else { //If there are any obstructions when moving backward, move is invalid.
                    return false;
                }
                break;
            case 'sideways':
                if (result === true) { //The path is clear,so return the first square.
                    return (pathToCheck[0]);
                }
                else { //If there are any obstructions when moving sideways, move is invalid.
                    return false;
                }
        }
    };

    //Checks to see if a path (array of squares) contains any obstructions
    //Returns true is clear; returns the obstructing square if not clear
    this.isAreaClear = function(area) {
        for (var i = 0; i < area.length; i++) {
            var squareToCheck = area[i];
            var typeOfSquare = squareToCheck.name;
            console.log(typeOfSquare);
            if (typeOfSquare === 'ship' || typeOfSquare === 'coral') { //Return obstructing square
                return area[i];
            }
            //TODO: add mine case
        }
        //Otherwise, if no obstructions found
        return true;
    }
}
