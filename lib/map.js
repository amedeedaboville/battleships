getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
Map = function() {
    this.grid = new Grid();
    this.shipDictionary = {};
    this.visibleCoordinatesChallenger = [];
    this.visibleCoordinatesOpponent = [];


    this.drawGrid = function() {
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
     
        this.shipDictionary["cruiser3"] = new Cruiser([10,28], "cruiser3", "opponent", [-1,0]);
        this.shipDictionary["cruiser4"] = new Cruiser([11,28], "cruiser4", "opponent", [-1,0]);
        this.shipDictionary["destroyer4"] = new Destroyer([12,28], "destroyer4", "opponent", [-1,0]);
        this.shipDictionary["destroyer5"] = new Destroyer([13,28], "destroyer5", "opponent", [-1,0]);
        this.shipDictionary["destroyer6"] = new Destroyer([14,28], "destroyer6", "opponent", [-1,0]);
        this.shipDictionary["minelayer3"] = new MineLayer([15,28], "minelayer3", "opponent", [-1,0]);
        this.shipDictionary["minelayer4"] = new MineLayer([16,28], "minelayer4", "opponent", [-1,0]);
        this.shipDictionary["torpedo3"] = new Torpedo([17,28], "torpedo3", "opponent", [-1,0]);
        this.shipDictionary["torpedo4"] = new Torpedo([18,28], "torpedo4", "opponent", [-1,0]);
        this.shipDictionary["radar2"] = new Radar([19,28], "radar2", "opponent", [-1,0]);

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
            var visiblePositions = z.enumerateSquares();
            


            visiblePositions.forEach(function(pos) {
                visibleSquares[JSON.stringify(pos)] = true;
            });
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

        //Calculate vector
        var displacementVector = [endPosition[0] - startPosition[0], endPosition[1] - startPosition[1]];

        //Normalize
        var movementVector = [this.sign(displacementVector[0]), this.sign(displacementVector[1])];

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
                    var thisPosition = [startPosition[0] + i*movementVector[0], startPosition[1] + i*movementVector[1]];
                    path.push(this.grid.getObjectAtPosition(thisPosition));
                }
        }

        //Now that we have the path, we will ask the grid for the last legal square in the path (meaning that the ship will stop short if it hits an obstruction.
        
       for (var i = 0; i < shipToMove.shipLength; i++) {
           var oldPos = shipToMove.shipSquares[i].position;
           var newPos = [oldPos[0] + displacementVector[0], oldPos[1] + displacementVector[1]];
           shipToMove.shipSquares[i].position = newPos;
       }
       this.drawGrid();
       //TODO:need to make a 'collision' here if the ship moves over a mine.
    };

    //Usage: turnShip(Ship ship, String turnDirection)
    this.turnShip = function(ship, turnDirection){
        switch (turnDirection){
            case 'clockwise':
                break;
            case 'counterclockwise':
                break;
        }
    };
    
    //Usage: fireCannon(Ship ship, Position cannonTarget)
    this.fireCannon = function(ship, cannonTarget){
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
