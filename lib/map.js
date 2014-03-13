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
    };

    this.getSquares = function() {
        return this.grid.squares;
    };

    this.getShips = function() {
       return this.shipDictionary; 
    }
//    this.moveShip = function(ship, destinationSquare, CARDINAL_DIRECTION){
//        var shipToMove = ship;
//        startSquare = grid.getObjectAtPosition(bowPosition);
//        switch (CARDINAL_DIRECTION){
//            case 'NORTH':
//            case 'SOUTH':
//            case 'EAST':
//            case 'WEST':
//        }
//        
//    }
    this.makeShips();
    this.drawGrid();
    return this;
}
