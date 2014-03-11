getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
Map = function() {
  this.grid = new Grid();
  this.ships = [];

  function makeShips(){
    //create all ships in a loop
    //
    var start = grid[0][0];
    var end = grid [0][1];
    aShip = new Ship(start, end);
    //     grid[0][0] = new shipSquare(0,0, "p1");
    //aShip = new Ship(createShipSquares(0,3,2,2,"P1"));
    ships.push(aShip);
  };


}
