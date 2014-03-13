getRandomInt = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
Map = function() {
    this.grid = new Grid();
    this.ships = [];

    this.drawGrid = function() {
        this.ships.forEach(function(ship) {
            ship.shipSquares.forEach(function(square) {
                var x = square.position[0];
                var y = square.position[1];
                this.grid.squares[x][y] = square;
            }.bind(this));
        }.bind(this));
    };


    this.makeShips = function() {
        //create all ships in a loop
        var aShip = new Cruiser([0, 0], "challenger");
        this.ships.push(aShip);
    };

    this.getSquares = function() {
        return this.grid.squares;
    };

    this.makeShips();
    this.drawGrid();
    return this;
}
