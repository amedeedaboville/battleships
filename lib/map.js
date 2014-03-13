getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
Map = function() {
    this.grid = new Grid();
    this.shipDictionary = {};

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

     //   this.shipDictionary['base1'] = new Base([10,0], "base1", "challenger");

      
    //    this.shipDictionary["base3"] = new Base([10,29], "base3", "opponent"]);
        
    };

    this.getSquares = function() {
        return this.grid.squares;
    };

    this.getShips = function() {
       return this.shipDictionary; 
    };

    //Usage: moveShip(Ship ship, Position endPosition, String CARDINAL_DIRECTION))
  /*  this.moveShip = function(ship, endPosition, CARDINAL_DIRECTION){
        var shipToMove = ship;
        var startPosition = ship.getPosition();
        var startSquare = grid.getObjectAtPosition(startPosition);
        var endSquare = grid.getObjectAtPosition(endPosition);
        var path = [];
        switch (CARDINAL_DIRECTION){
            case 'NORTH':
                var distance = this.grid.getDistanceBetween(startPosition, endPosition);
                for (var i=0;i<=distance; i++){
                // The ship is moving north, so the bow is below the destination, meaning we have to decrease the y value to travel upward in the grid.
                    var thisPosition = [startPosition[0], startPosition[1]-i];
                    path.push(this.grid.getObjectAtPosition(thisPosition));
                }
            case 'SOUTH':
                // The ship is moving south, so the bow is above the destination, meaning we have to increase the y value to travel downward in the grid.
                    var thisPosition = [startPosition[0], startPosition[1]+i];
                    path.push(this.grid.getObjectAtPosition(thisPosition));
                }
            case 'EAST':
            case 'WEST':
        }
        
    };
    this.makeShips();
    this.drawGrid();
    return this; */
}
