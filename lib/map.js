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

        this.drawShips();
    };

    this.drawShips = function(){
        for(ship in this.shipDictionary) {
            this.shipDictionary[ship].shipSquares.forEach(function(square) {
                var x = square.position[0];
                var y = square.position[1];
                this.squares[x][y] = square;
            }.bind(this));
        }
    }

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

    /****************** Collision methods ******************/

    this.getClosestObjectForward = function(start, movementVector){
        var nVector = this.normalize(movementVector);

        //check from closest to farthest away
        for (var i = 1; i <= Math.abs(movementVector[0] + movementVector[1]); i++) {
            var obj = this.getObjectAtPosition([start[0]+i*nVector[0], start[1]+i*nVector[1]]);
            if (obj.name != "sea"){
                return i-1;
            }
        };
        return i-1;
    }

    this.getClosestObjectSideways = function(ship, startPosition){
        for (var i = 0; i < ship.shipLength; i++) {
            var x = startPosition[0] +i*ship.orientation[0];
            var y = startPosition[1] +i*ship.orientation[1];
            //console.log(x +"," + y);
            var obj = this.getObjectAtPosition([x,y]);
            if (obj.name != "sea"){
                return 0;
            }
        };
        return 1;
    }

    this.getObjectTurning = function(squareArray){
        for (var i = 0; i < squareArray.length; i++) {
            var obj = this.getObjectAtPosition([squareArray[i][0],squareArray[i][1]]);
            if (obj.name != "sea"){
                console.log('found obstruction');
                return obj;
            }
        };
        return undefined;
    }
    /********************Movement methods*******************/

    //Usage: moveShip(Ship ship, Position endPosition, String CARDINAL_DIRECTION))
    this.moveShip = function(ship, endPosition){


        //initialize the movementVector
        var movementVector = this.makeDisplacementVector(ship.bowPosition,endPosition);
        var normalizedMovementVector = this.normalize(movementVector);

        //movement is forward
        if (normalizedMovementVector[0] == ship.orientation[0] && normalizedMovementVector[1] == ship.orientation[1]){
            //console.log('>>> moving forwards')

            //find closest object to our ship
            var movement = this.getClosestObjectForward(ship.bowPosition, movementVector);
            movement = Math.min(movement, ship.speed);
            this.moveStraight(ship, movement);
        }

        //movement is backward
        else if (normalizedMovementVector[0] == -ship.orientation[0] && normalizedMovementVector[1] == -ship.orientation[1]){
            //console.log('>>> moving backwards')

            //find closest object to our ship
            var obj = this.getObjectAtPosition([ship.sternPosition[0]+normalizedMovementVector[0], 
                                                ship.sternPosition[1]+normalizedMovementVector[1]]);
            if (obj.name == "sea"){
                this.moveStraight(ship,-1);
            }
        }

        //movement is sideways
        else {
            //console.log('>>> moving sideways')

            if (ship.orientation[0] == 0){

                //check positions
                var startPosition = [ship.sternPosition[0] + normalizedMovementVector[0], ship.sternPosition[1]];
                var movement = this.getClosestObjectSideways(ship, startPosition);
                this.moveSideways(ship,movement*normalizedMovementVector[0]);
            }

            else if (ship.orientation[1] == 0){

                var startPosition = [ship.sternPosition[0], ship.sternPosition[1] + normalizedMovementVector[1]];
                var movement = this.getClosestObjectSideways(ship, startPosition);
                this.moveSideways(ship,movement*normalizedMovementVector[1]);
            }
        }

        //TODO:need to make a 'collision' here if the ship moves over a mine.
    };

    //move ship straight either forward or backwards
    //first: recalculate the stern position of the ship
    //then redraw the ship from this stern position
    this.moveStraight = function(ship, distance){
        //there are multiple values that need to be changed: sternposition
        var ship = this.shipDictionary[ship.id];
        ship.__proto__ = new Ship();
        ship.shipMoveShip(distance, true);
        this.redrawShip(ship);

    }

    //move ship sideways: 
    //first: recalculate the stern position of the ship
    //then redraw the ship from this stern position
    this.moveSideways = function(ship, distance){
        var ship = this.shipDictionary[ship.id]
        ship.__proto__ = new Ship();
        ship.shipMoveShip(distance, false);
        this.redrawShip(ship);
    }

    this.redrawShip = function(ship){
        ship.bowPosition = [ship.sternPosition[0] + (ship.shipLength - 1) * ship.orientation[0],
                            ship.sternPosition[1] + (ship.shipLength - 1) * ship.orientation[1]]

        for(var i = 0; i < ship.shipLength; i++) {
            ship.shipSquares[i].position = [ ship.sternPosition[0] + i * ship.orientation[0],
                                             ship.sternPosition[1] + i * ship.orientation[1]];
            ship.shipSquares[i].__proto__ = new shipSquare(); 
            //recalculate css props
            ship.shipSquares[i].calculateAttributes();
        }
        this.shipDictionary[ship.id] = ship;
        this.drawGrid();
    }

    this.turnShip = function(ship, radians){
        //save old orientation
        var oldOrientation = [ship.orientation[0], ship.orientation[1]];

        //get the new orientation and change the ship's orientation to reflect this
        //simplified since radians is always (3/2)*n*PI => cos(radians) = 0;
        var x = - ship.orientation[0]*Math.sin(radians);
        var y = ship.orientation[1]*Math.sin(radians);
        ship.orientation[1] = x;
        ship.orientation[0] = y;

        var change = [  -Math.sin(radians) *(oldOrientation[0] - ship.orientation[0]),
                         Math.sin(radians) *(oldOrientation[1] - ship.orientation[1]), ]

        //turnArea has the relative xy coords as arrays
        //for every pair of these coords, we get the absolute positioning in the map
        var turnPositions = ship.turnArea.map(function(pos) {
            return [
            ship.sternPosition[0] + pos[0]*change[1],
            ship.sternPosition[1] + pos[1]*change[0]];
        });

        //no Objects obstruct our path. Let's finish the rotatation
        if (this.getObjectTurning(turnPositions) == undefined){
            this.redrawShip(ship);
        }

        //print the first object that we found that blocked our path
        else{
            console.log(this.getObjectTurning(turnPositions));
            ship.orientation = oldOrientation;
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
