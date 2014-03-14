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
    var coralSpots = [];
    while(coralSpots.length < 24) {
        var newSpot = [getRandomInt(3,26), getRandomInt(10,20)];
        var spotAlreadyPicked = false;
        for(var i = 0; i < coralSpots.length; i++) {
            if(coralSpots[i][0] == newSpot[0] && coralSpots[i][1] == newSpot[1]) {
                spotAlreadyPicked  = true;
                break;
            }
        }

        if (!spotAlreadyPicked) {
            coralSpots.push(newSpot);
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
    this.calculateDestination = function(path, moveKind){
        var pathToCheck = path;
        var result = isAreaClear(pathToCheck);
        var resultType = typeof result;
        switch(moveKind){
            case 'forward':
                if (resultType.prototype === 'Square'){
                    //Only occurs is path is not clear.
                    var obstructingSquare = result;
                    //Return previous square
                    var squareBefore = path.find(function (arg, index, array) {
                        return (array[index+1] == result);
                    });
                }
                //If no obstructon, return the last element in the path
                return pathToCheck[pathToCheck.length -1];
                break;
            case 'backward':
                if (resultType === 'boolean'){
                    //The path is clear,so return the single square.
                    return (pathToCheck[0]);
                }else {
                    //If there are any obstructions when moving backward, move is invalid.
                    return false;
                }
                break;
            case 'sideways':
                if (resultType === 'boolean'){
                    //The path is clear,so return the first square.
                    return (pathToCheck[0]);
                }else {
                    //If there are any obstructions when moving sideways, move is invalid.
                    return false;
                }
                break;
        }
    };

    //Checks to see if a path (array of squares) contains any obstructions
    //Returns true is clear; returns the obstructing square if not clear
    this.isAreaClear = function(area){
        for (vari=0; i<path.length;i++){
            var squareToCheck = area[i];
            var typeOfSquare = typeof squareToCheck;
            if (typeOfSquare === 'shipSquare' || typeOfSquare === 'coralSquare'){
                //Return obstructing square
                return area[i];
            }
            //TODO: add mine case
        }
        //Otherwise, if no obstructions found
        return true;
    }
}
