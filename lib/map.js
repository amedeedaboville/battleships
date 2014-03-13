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
        var aShip = new Ship([0, 0], [0, 5], "challenger");
        this.ships.push(aShip);
    };

    this.getSquares = function() {
        return this.grid.squares;
    };

    this.getShipsAtPosition = function(position) {
        for (ship in this.ships)
        {
            console.log(ship);
            for (square in ship.squares)
            {
                console.log(square);
                if (square.coordinates.x == position[0] && square.coordinates.y == position[1])
                    return ship
            }
        }
        return undefined;
    }



    this.makeShips();
    this.drawGrid();
    return this;
}
