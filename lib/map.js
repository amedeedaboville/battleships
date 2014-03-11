getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
Map = function() {
  this.grid = [];
  this.ships = [];

  this.getObjectAtPosition = function(position) {
    return; //returns a square object of type coral, base, mine, or ship, otherwise sea
  }
  this.isPathClear = function(path) {
    return; 
    //takes in an ordered path, checks each square along the path
    //returns the first collision square, or null/sea otherwise.
  }
  this.isSquareClear = function(position) {
    return;
    //if the position is sea return true else false
  }
  function createGrid(){
    var grid = [];
    var ships = [];
        //build the sea
        for(var i = 0; i < 30; i++) {
          grid[i] = [];
          for( j = 0; j < 30; j++) {
            grid[i].push(new seaSquare(i,j));
          }
        }

        //coral spots
        var coralSpots = [];
        while(coralSpots.length < 24) {
          var newSpot = [getRandomInt(3,26), getRandomInt(10,20)];
          var spotAlreadyPicked = false;
          for(var i = 0; i < coralSpots.length; i++) {
            if(coralSpots[i][0] == newSpot[0] && coralSpots[i][1] == newSpot[1]) {
              spotAlreadyPicked  = true;
              break;
            }
          }
          if (!spotAlreadyPicked) {
            coralSpots.push(newSpot);
            grid[newSpot[0]][newSpot[1]] = new coralSquare(newSpot[0], newSpot[1]);

          }
        }

        //initial ship spots
        // = new Ship();
        function createShipSquares(startx, endx, starty, endy, player){
          shipSquares = [];
          for (var i =starty ; i <= endy; i++) {
            for (var j= startx; j <= endx; j++)
            {
              aShipSquare = new shipSquare(i,j, player); //where PLayer is a string 
              grid[i][j] = aShipSquare;
              shipSquares.push(aShipSquare);
            }
          }
          return shipSquares;
        }

aShip = new Ship(createShipSquares(0,1,0,0,"P1"));
 //     grid[0][0] = new shipSquare(0,0, "p1");
      aShip = new Ship(createShipSquares(0,3,2,2,"P1"));
      ships.push(aShip);
      aShip2 = new Ship(createShipSquares(0,3,5,5,"P2"));
      ships.push(aShip2);
return grid;
};





this.grid = createGrid();

}
