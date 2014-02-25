Map = function() {
  this.grid = [];

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
        //build the sea
        for(var i = 0; i < 30; i++) {
          grid[i] = [];
          for( j = 0; j < 30; j++) {
            grid[i].push("sea");
          }
        }
        for(var i = 0; i < 10; i++) {
          grid[i+10][0]  = "bluebase";
          grid[i+10][29] = "redbase";
        }

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
            grid[newSpot[0]][newSpot[1]] = "coral";

          }
        }
        return grid;
      };
      this.grid = createGrid();

}
