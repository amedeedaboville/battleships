getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
Map = function() {
    this.grid = new Grid();
    this.shipDictionary = {};
    this.visibleCoordinatesChallenger = [];
    this.visibleCoordinatesOpponent = [];

    this.drawGrid = function() {
        this.grid.squares = [];
        for(var i = 0; i < 30; i++) {
            this.grid.squares[i] = [];
            for(var j = 0; j < 30; j++) {
                this.grid.squares[i][j] = new seaSquare(i,j);
            }
        }

        this.grid.coralSpots.forEach(function(pos) {
            this.grid.squares[pos[0]][pos[1]] = new coralSquare(pos[0], pos[1]);
        }.bind(this));

        for(ship in this.shipDictionary) {
            this.shipDictionary[ship].shipSquares.forEach(function(square) {
                var x = square.position[0];
                var y = square.position[1];
                this.grid.squares[x][y] = square;
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
        this.shipDictionary["radar1"] = new Radar([19,1], "radar1", "challenger");

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
        return this.grid.squares;
    };

    this.getShips = function() {
        return this.shipDictionary; 
    };
    this.sign = function(x) {
        return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
    };

    this.getVisibleSquares = function(player){
        var visibleSquares = {}; 
        for (ship in this.shipDictionary){
            if (this.shipDictionary[ship].owner == player){

                var zoneStart = this.shipDictionary[ship].sternPosition;
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

            for (ship in this.shipDictionary){
                if (this.shipDictionary[ship].owner == player){
                }

            }
        }

        return visibleSquares; 
    }

    //Usage: moveShip(Ship ship, Position endPosition, String CARDINAL_DIRECTION))
    this.moveShip = function(ship, endPosition){
        var shipToMove = ship;
        var startPosition = ship.bowPosition;
        var startSquare = this.grid.getObjectAtPosition(startPosition);
        var endSquare   = this.grid.getObjectAtPosition(endPosition);
        var path = [];
        var distance = this.grid.getDistanceBetween(startPosition, endPosition);
        console.log("ship orientation is");
        console.log(ship.orientation);

        //Calculate vector
        var displacementVector = [endPosition[0] - startPosition[0], endPosition[1] - startPosition[1]];
        console.log("displacement is");
        console.log(displacementVector);

        //Normalize
        var movementVector = [this.sign(displacementVector[0]), this.sign(displacementVector[1])];
        console.log("movement is");
        console.log(movementVector);

        //Get dot product to determine direction based on orientation and movement vector
        var dot = movementVector[0] * ship.orientation[0] + movementVector[1] * ship.orientation[1];
        var moveKind;

        switch(dot) {
            case 1: //Ship is moving forward -- generate a whole path based on the distance.
                moveKind = 'forward';
                for (var i=1;i<=distance; i++){
                    var thisPosition = [startPosition[0] + i*movementVector[0], startPosition[1] + i*movementVector[1]];
                    path.push(this.grid.getObjectAtPosition(thisPosition));
                }
                break;
            case -1: //backward -- only move one space.
                //Same calculation as above, but no need to multiply
                moveKind = 'backward';
                var thisPosition = [startPosition[0] + movementVector[0], startPosition[1] + movementVector[1]];
                path.push(this.grid.getObjectAtPosition(thisPosition));
                break;
            case 0: //sideways -- move whole ship to an adjacent area.
                //We calculate to which side the ship is trying to laterally move using the movement vector
                moveKind = 'sideways';
                for (var i=1;i<=shipToMove.shipLength; i++){
                    var thisPosition = [startPosition[0] + i*movementVector[1], startPosition[1] + i*movementVector[0]];
                    path.push(this.grid.getObjectAtPosition(thisPosition));
                }
        }

        //Now that we have the path, we will ask the grid for the last legal square in the path (meaning that the ship will stop short if it hits an obstruction.

        shipToMove.bowPosition = this.grid.calculateDestination(path, moveKind).position || startPosition;

        var actualDisplacement = [shipToMove.bowPosition[0] - startPosition[0], shipToMove.bowPosition[1] - startPosition[1]];
        shipToMove.sternPosition = [shipToMove.bowPosition[0] - shipToMove.shipLength * shipToMove.orientation[0], shipToMove.bowPosition[1] - shipToMove.shipLength * shipToMove.orientation[1]];

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

    //Usage: turnShip(Ship ship, String turnDirection)
    this.turnShip = function(ship, turnDirection){
        if(turnDirection === 'clockwise') {
            var turnMultiple = -1;
        }
        else {
            var turnMultiple = 1;
        }
        var basicTurnArea = [];
        for(var i = 1; i < ship.shipLength; i++) {
            for(var j = 1; j < i; j++) { 
                basicTurnArea.push([ship.shipLength - i,j])
            }
        }
        var x = ship.orientation;
        console.log("x is ");
        console.log(x);
        var y = [-ship.orientation[1], ship.orientation[0]]; //Negative transpose
        console.log("y is ");
        console.log(y);

        var turnPositions = basicTurnArea.map(function(pos) {
            return [
            ship.sternPosition[0] + pos[0] * x[0] + turnMultiple * pos[1] * y[0],
            ship.sternPosition[1] + pos[0] * x[1] + turnMultiple * pos[1] * y[1]];
        });

        if(this.grid.isAreaClear(turnPositions.map(function(pos) {return this.grid.getObjectAtPosition(pos);}.bind(this))) === true) {
            console.log("Area is clear");
            var turnVector = [y[0] * turnMultiple, y[1] * turnMultiple];
            console.log("turnVector is ");
            console.log(turnVector);
            ship.orientation = turnVector;
            ship.bowPosition = [ship.sternPosition[0] + ship.shipLength * ship.orientation[0], ship.sternPosition[1] + ship.shipLength * ship.orientation[1]];
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

    //Usage: fireCannon(Ship ship, Position cannonTarget)
    this.fireCannon = function(ship, cannonTarget){
        //TODO: create cannon zone based on ship's position

        var targetSquare = this.grid.getObjectAtPosition(cannonTarget);
        targetSquare.health -= 1;
        targetSquare.isDestroyed = 'true';
        console.log("its getting here!!!!?!?!?!??!");
        var intactSquares=ship.shipLength;
        for(var i = 0; i< ship.shipSquares.length; i++){
            if (ship.shipSquares[i].isDestroyed === 'true')
                intactSquares--;
            
        }
        console.log("intactSquares");
        this.shipDictionary[targetSquare.shipName].speed = (intactSquares/ship.shipLength);
        targetSquare.css = "damagedSquare";
        this.drawGrid();
        
        //TODO: Crate a new notificaiton
    }

    //Usage: dropMine(Ship ship)
    this.fireTorpedo = function(ship){
    }

    //Usage: dropMine(Ship ship, Position cannonTarget)
    this.dropMine = function(ship, mineLocation){
    }



    this.makeShips();
    this.drawGrid();
    return this; 
}
