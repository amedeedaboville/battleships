Grid = function (){
  this.squares = [];
  //build the sea
  for(var i = 0; i < 30; i++) {
    this.squares[i] = [];
    for( j = 0; j < 30; j++) {
      this.squares[i].push(new seaSquare(i,j));
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
      this.squares[newSpot[0]][newSpot[1]] = new coralSquare(newSpot[0], newSpot[1]);

    }
  }

 //returns a square object of type coral, base, mine, or ship, otherwise sea
  this.getObjectAtPosition = function(position) {
    return this.squares[position[0]][position[1]];
  }
  //Checks to see if the array of obstacles PATH for a ship. 
  //If an obstacle (base, coral, ship), return the square before the obstacle. 
//  this.getEndPosition = function(path) {
//    var pathToCheck = path;
//    for (var i = 0; i < path.length; i++){
//        var squareAtPosition = getObjectAtPosition(square.getPosition);
//        var typeOfSquare = typeof objectAtSquare;
//            if (typeOfSquare === 'shipSquare' || typeOfSquare === 'coralSquare' /*though this should be prevented by the UI*/){
//                return path[i-1]; break;
//            }
//        }
//    }
//    return path[path.length]; 
//    //takes in an ordered path, checks each square along the path
//    //returns the first collision square, or null/sea otherwise.
//  }

  this.isSquareClear = function(position) {
    return;
    //if the position is sea return true else false
  }
}
