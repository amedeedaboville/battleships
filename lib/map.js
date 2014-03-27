getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

Map = function() {
    this.squares = [];
    this.coralSpots = [];
    this.shipDictionary = {};
    this.visibleCoordinatesChallenger = [];
    this.visibleCoordinatesOpponent = [];
    this.deployedMines = [];

    this.chooseCorals = function() {
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
    }

    this.drawGrid = function() {
        this.squares = [];
        for(var i = 0; i < 30; i++) {
            this.squares[i] = [];
            for(var j = 0; j < 30; j++) {
                this.squares[i][j] = new seaSquare(i,j);
            }
        }

        if(this.coralSpots.length == 0) {
            this.chooseCorals();
        }

        this.coralSpots.forEach(function(pos) {
            this.squares[pos[0]][pos[1]] = new coralSquare(pos[0], pos[1]);
        }.bind(this));

        for(ship in this.shipDictionary) {
            this.shipDictionary[ship].shipSquares.forEach(function(square) {
                var x = square.position[0];
                var y = square.position[1];
                this.squares[x][y] = square;
            }.bind(this));
        }
    };

    this.makeShips = function() {
        //create all ships in a loop
        var players = ["challenger", "opponent"];
        //var requiredShips = ["cruiser1", "cruiser2", "destroyer1", "destroyer2", "radar1", "radar2"];
        this.shipDictionary["cruiser1"] = new Cruiser([10,1], "cruiser1", "challenger");
        this.shipDictionary["cruiser2"] = new Cruiser([11,1], "cruiser2", "challenger");
        this.shipDictionary["destroyer1"] = new Destroyer([12,1], "destroyer1", "challenger");
        this.shipDictionary["destroyer2"] = new Destroyer([13,1], "destroyer2", "challenger");
        this.shipDictionary["destroyer3"] = new Destroyer([14,1], "destroyer3", "challenger");
        this.shipDictionary["minelayer1"] = new MineLayer([15,1], "minelayer1", "challenger");
        this.shipDictionary["minelayer2"] = new MineLayer([16,1], "minelayer2", "challenger");
        this.shipDictionary["torpedo1"] = new Torpedo([17,1], "torpedo1", "challenger");
        this.shipDictionary["torpedo2"] = new Torpedo([18,1], "torpedo2", "challenger");
        this.shipDictionary["radar1"] = new Radar([19,1 ], "radar1", "challenger");

        this.shipDictionary['base1'] = new Base([10,0], "base1", "challenger");

        this.shipDictionary["cruiser3"] = new Cruiser([10,28], "cruiser3", "opponent", [0,-1]);
        this.shipDictionary["cruiser4"] = new Cruiser([11,28], "cruiser4", "opponent", [0,-1]);
        this.shipDictionary["destroyer4"] = new Destroyer([12,28], "destroyer4", "opponent", [0,-1]);
        this.shipDictionary["destroyer5"] = new Destroyer([13,28], "destroyer5", "opponent", [0,-1]);
        this.shipDictionary["destroyer6"] = new Destroyer([14,28], "destroyer6", "opponent", [0,-1]);
        this.shipDictionary["minelayer3"] = new MineLayer([15,28], "minelayer3", "opponent", [0,-1]);
        this.shipDictionary["minelayer4"] = new MineLayer([16,28], "minelayer4", "opponent", [0,-1]);
        this.shipDictionary["torpedo3"] = new Torpedo([17,28], "torpedo3", "opponent", [0,-1]);
        this.shipDictionary["torpedo4"] = new Torpedo([18,28], "torpedo4", "opponent", [0,-1]);
        this.shipDictionary["radar2"] = new Radar([19,28], "radar2", "opponent", [0,-1]);

        this.shipDictionary['base2'] = new Base([10,29], "base1", "opponent");
    };

    this.getSquares = function() {
        return this.squares;
    };

    this.getShips = function() {
        return this.shipDictionary; 
    };
    this.sign = function(x) {
        return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
    };

    this.getGrid = function(player) {
        if(Object.keys(this.shipDictionary).length == 0) { return;}
        var newGrid = [];
        var vis = this.getVisibleSquares(player);
        for(var r = 0; r < 30; r++) {
            newGrid[r] = [];
            for(var c = 0; c < 30; c++) {
                var key = '[' + r + ',' + c + ']';
                if(vis[key] == true) {
                    newGrid[r][c] = this.squares[r][c];
                    newGrid[r][c].__proto__ = new Square(r,c);
                    newGrid[r][c].setVisible(true);
                }
                else {
                    newGrid[r][c] = new seaSquare(r,c);
                    //console.log(newGrid[r][c]);
                }
            }
        }
        return newGrid;
    }
    this.getVisibleSquares = function(player) {
        var visibleSquares = {}; 
        for (ship in this.shipDictionary){
            if (this.shipDictionary[ship].owner == player){

                var zoneStart = this.shipDictionary[ship].radarStart;
                var zoneOrientation = this.shipDictionary[ship].orientation;
                var zoneRadarRange = this.shipDictionary[ship].radarRange;


                //Create a zone for the ship in question!
                var z = new Zone(zoneOrientation, zoneRadarRange, zoneStart);
                //console.log(this.shipDictionary[ship])
                //console.log(z)
                var visiblePositions = z.enumerateSquares();
                visiblePositions.forEach(function(pos) {
                    visibleSquares[JSON.stringify(pos)] = true;
                });
            }   

            for (shipID in this.shipDictionary) {
                var ship = this.shipDictionary[shipID];
                if (ship.owner == player || ship.name == "Base"){
                    for(var i = 0; i < ship.shipLength; i++) {
                        var square = ship.shipSquares[i];
                        visibleSquares[JSON.stringify(square.position)] = true;
                    }
                }
            }
            if(player === 'challenger') {
                visibleSquares['[9,0]'] = true;
                visibleSquares['[20,0]'] = true;
            }
            if(player === 'opponent') {
                visibleSquares['[9,29]'] = true;
                visibleSquares['[20,29]'] = true;
            }
            for (var i = 10; i < 20; i++) {
                if(player === 'challenger')
                    visibleSquares['[' + i +',1]'] = true;
                if(player === 'opponent')
                    visibleSquares['[' + i +',28]'] = true;
            }

            for (var i = 0; i < 24; i++) {
                var spot = this.coralSpots[i];
                visibleSquares[JSON.stringify(spot)] = true;
            }
        }

        return visibleSquares; 
    }

    this.getDistanceBetween = function(p1, p2) {
        return Math.sqrt(Math.pow(p2[0] - p1[0], 2) + Math.pow(p2[1] - p1[1], 2));
    };

    //takes in an ordered path, checks each square along the path, returns the place the ship should move to, or false if
    //move is invalid.
    this.calculateDestination = function(pathToCheck, dot) {
        var pathClear = this.isAreaClear(pathToCheck);
        var moveKind;
        if(dot == 1) { //forward movement
            if (pathClear != true) { //Only occurs if path is not clear.
                for(var i = 1; i < pathToCheck.length; i++) {
                    if(pathToCheck[i] == pathClear) {
                        return pathToCheck[i-1];
                    }
                }
                console.log("error, path is not clear but no obstruction was found.");
                return false;
            }
            return pathToCheck[pathToCheck.length -1];
        }
        else{ //moveKind is backward or sideways 
            if (pathClear) {
                return (pathToCheck[0]);
            } 
            else { //If there are any obstructions when moving backward or sideways, move is invalid.
                return false;
            }
        }
    };

    this.getObjectAtPosition = function(position) {
        return this.squares[position[0]][position[1]];
    }
    /*******************Vector methods*************************/
    this.makeDisplacementVector = function (startPosition, endPosition){
        var displacementVector = [endPosition[0] - startPosition[0], endPosition[1] - startPosition[1]];
        return displacementVector;
    }

    this.normalize = function (vector){
        var normalized = [this.sign(vector[0]), this.sign(vector[1])];
        return normalized;
    }

    this.dot = function(vectorA, vectorB){ 
        result = vectorA[0] * vectorB[0] + vectorA[1] * vectorB[1];
        return result;
    };

    /********************Movement methods*******************/

    //Usage: moveShip(Ship ship, Position endPosition, String CARDINAL_DIRECTION))
    this.moveShip = function(ship, endPosition){
        var shipToMove = ship;
        var startPosition = ship.bowPosition;

        //Now that we have the path, we will ask the grid for the last legal square in the path (meaning that the ship will stop short if it hits an obstruction.
        var movementVector = this.normalize(this.makeDisplacementVector(startPosition, endPosition));
        console.log("Movement vector is");
        console.log(movementVector);
        var dot = this.dot(movementVector, ship.orientation);
        console.log("Resulting dot product is " + dot);
         
         //which direction?
         var moveKind;
         if (dot == 1) {
             moveKind = 'forward';
         } else if (dot == 0){
             moveKind = 'sideways';
         } else if (dot == -1){
             moveKind = 'backward';
         } else {
             console.log("Something went wrong when calculating the dot product!");
         }
         console.log("Moving in direction: " +moveKind);

        var path = this.calculatePath(startPosition, endPosition, shipToMove, movementVector, moveKind);
        console.log("Calculated a path size of " + path.length);
        //TODO: anything below this line may not work
        shipToMove.bowPosition = this.calculateDestination(path, moveKind).position || startPosition;

        var actualDisplacement = [shipToMove.bowPosition[0] - startPosition[0], shipToMove.bowPosition[1] - startPosition[1]];
        shipToMove.sternPosition = [shipToMove.bowPosition[0] - shipToMove.shipLength * shipToMove.orientation[0], shipToMove.bowPosition[1] - shipToMove.shipLength * shipToMove.orientation[1]];

        //Perform the actual move on the grid
        shipToMove.shipSquares.forEach(function(square) {
            var oldPos = square.position;
            square.position =  [oldPos[0] + actualDisplacement[0], oldPos[1] + actualDisplacement[1]];
            square.__proto__ = new shipSquare();
            square.calculateAttributes();
        });

        this.shipDictionary[shipToMove.id] = shipToMove;
        this.drawGrid();
        //TODO:need to make a 'collision' here if the ship moves over a mine.
    };

    this.calculatePath = function (startPosition, endPosition, ship, movementVector, moveKind){
        //Used to get movement path for ships moving as well as torpedo paths
        var startSquare = this.getObjectAtPosition(startPosition);
        var endSquare  = this.getObjectAtPosition(endPosition);
        var shipToMove = ship;
        var path = [];
        var distance = this.getDistanceBetween(startPosition, endPosition);
        console.log("Ship orientation is");
        console.log(ship.orientation);

        switch(moveKind) {
            case 'forward': //Ship is moving forward -OR a torpedo is being shot - generate a whole path based on the distance.
                
                for (var i=1;i<=distance; i++){
                    var thisPosition = [startPosition[0] + i*movementVector[0], startPosition[1] + i*movementVector[1]];
                    path.push(this.getObjectAtPosition(thisPosition));
                }
                break;
            case 'backward': //backward -- only move one space.
                //Same calculation as above, but no need to multiply
                var thisPosition = [startPosition[0] + movementVector[0], startPosition[1] + movementVector[1]];
                path.push(this.getObjectAtPosition(thisPosition));
                break;
            case 'sideways': //sideways -- move whole ship to an adjacent area.
                //We calculate to which side the ship is trying to laterally move using the movement vector
                for (var i=1;i<=shipToMove.shipLength; i++){
                    var thisPosition = [startPosition[0] + i*movementVector[1], startPosition[1] + i*movementVector[0]];
                    path.push(this.getObjectAtPosition(thisPosition));
                }
                break;
        }
        return path;
    }

    this.isAreaClear = function(area) {
        for (var i = 0; i < area.length; i++) {
            var squareToCheck = area[i];
            if (squareToCheck == undefined)
                continue;
            var typeOfSquare = squareToCheck.name;
            if (typeOfSquare === 'ship' || typeOfSquare === 'coral' || typeOfSquare === 'mine' || typeOfSquare === 'base') { //Return obstructing square
                return area[i];
            } //TODO: add mine case
        }
        return true; //Otherwise, if no obstructions found
    }

    this.turnShip = function(ship, turnDirection){
        if(turnDirection === 'clockwise') {
            var turnMultiple = -1;
        }
        else {
            var turnMultiple = 1;
        }
        var x = ship.orientation;
        console.log("x is ");
        console.log(x);
        var y = [-ship.orientation[1], ship.orientation[0]]; //Negative transpose
        console.log("y is ");
        console.log(y);

        var turnPositions = ship.turnArea.map(function(pos) {
            return [
            ship.sternPosition[0] + pos[0] * x[0] + turnMultiple * pos[1] * y[0],
            ship.sternPosition[1] + pos[0] * x[1] + turnMultiple * pos[1] * y[1]];
        });

        if(this.isAreaClear(turnPositions.map(function(pos) {return this.getObjectAtPosition(pos);}.bind(this))) === true) {
            console.log("Area is clear");
            var turnVector = [y[0] * turnMultiple, y[1] * turnMultiple];
            console.log("turnVector is ");
            console.log(turnVector);
            ship.orientation = turnVector;
            ship.bowPosition = [ship.sternPosition[0] + ship.shipLength * ship.orientation[0], ship.sternPosition[1] + ship.shipLength * ship.orientation[1] + 1];
            for(var i = 0; i < ship.shipLength; i++) {
                var oldPos = ship.shipSquares[i].position;
                ship.shipSquares[i].position = [ship.sternPosition[0] + i * turnVector[0], ship.sternPosition[1] + i * turnVector[1]];
                ship.shipSquares[i].__proto__ = new shipSquare(); //recalculate css props
                ship.shipSquares[i].calculateAttributes();
            }
            this.shipDictionary[ship.id] = ship;
            this.drawGrid();
        }
        else
        {
            console.log("Area is not clear!");
        }

    };

    //Usage: fireCannon(Ship ship, Square targetSquare)
    this.fireCannon = function(ship, targetSquare){
        var attackingShip = ship;
        var damage;
        var dangerZone = [];
        //TODO: create cannon zone based on ship's position
        //Check if cannonTarget is within cannonZone
        console.log("We are trying to shoot square at position: "+targetSquare.coordinateString());

        //Figure out how much damage the cannons will do against a valid target 
        if (attackingShip.name === 'Cruiser1' || attackingShip.name === 'Cruiser2'){ //Cruisers have Heavy cannons
            damage = 2;
        }else{
            damage = 1;
        }

        //Check what kind of square we're hitting
        var typeOfSquare = targetSquare.name; 
        switch (typeOfSquare) {
            case 'mine':
                explodeMine(targetSquare);
                break;
            case 'ship':
                dangerZone.push_back([targetSquare.x, targetSquare.y, damage]);
                break;
            case 'base':
                dangerZone.push_back([targetSquare.x, targetSquare.y, damage]);
                break;
        }
        return dangerZone;
    }

    //Usage: fireTorpedo(Ship ship)
    this.fireTorpedo = function(ship, targetSquare){
        //Calculate path in front of the torpedo (10 squares in front of bow base don orientation -- use 'moveShip' math!!
        var attackingShip = ship;
        var targetPosition = targetSquare.position;

        //Calculate path -- this gets the whole path the torpedo will travel 
        //attackPath = this.calculatePath(attackingShip.bowPosition, targetPosition, attackingShip);

        if (this.isAreaClear(attackPath) === 'true'){ //Nothign in the path -- the torpedo fizzles out
            //fizzle
        } else { //There is something in the way -- make explosion!
            explosionOrigin = this.calculateDestination(this.isAreaClear(attackPath));//If not clear, isAreaClear returns the first obstructing square
            var dangerZone = []; //Tuple type: [row, col, damageAmount]
            squareType = destinationSquare.name;

            //Torpedos do nothing against coral or bases except trigger a notification
            switch (squareType) {
                case 'mine':
                    explodeMine(destinationSquare)
                    break;
                case 'ship':
                    //check if broadside -- TODO: need an algorithm for this
                    break;
            }
        }
        return dangerZone;
    };

    //Usage: dropMine(Ship ship, Square mineLocation)
    this.dropMine = function(ship, mineLocation){
        if (ship.shipType != "Mine Layer")
            return;
        //Make "mine zone" around mineLayer ship
    };

    this.explodeMine = function(mineLocation){
        //Remove mine from list
    }



    this.makeShips();
    this.drawGrid();
    return this; 
}
