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
        var aShip = new Cruiser([0, 0], "cruiser1", "challenger");
        this.shipDictionary['cruiser1'] = aShip;
        this.shipDictionary['destroyer1'] = new Destroyer([10,2], "destroyer1", "opponent");
    };

    this.getSquares = function() {
        return this.grid.squares;
    };

    this.getShips = function() {
       return this.shipDictionary; 
    };

    //Usage: moveShip(Ship ship, Position endPosition, String CARDINAL_DIRECTION))
    this.moveShip = function(ship, endPosition, CARDINAL_DIRECTION){
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
                    var thisPosition = [startPosition[0], startPosition[1]-i]
                    path.push(this.grid.getObjectAtPosition(thisPosition);
                }
            case 'SOUTH':
                // The ship is moving south, so the bow is above the destination, meaning we have to increase the y value to travel downward in the grid.
                    var thisPosition = [startPosition[0], startPosition[1]+i]
                    path.push(this.grid.getObjectAtPosition(thisPosition);
                }
            case 'EAST':
            case 'WEST':
        }
        
    };
    this.makeShips();
    this.drawGrid();
    return this;
}
