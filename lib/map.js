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
}
