Action = function() {
    this.name = "Action Name";
    this.execute = function(params) {
        console.log("Default Action called with params");
        console.log(params);
    }
}

MoveShip = function() {
    this.name = "Move";
    this.execute = function(position, ship) {
        Map.moveShip(ship, position);
    }
}

TurnShip = function() {
    this.name = "Move";
    this.execute = function(position, ship) {
        Map.moveShip(ship, position);
    }
}

MoveShip.prototype = new Action();
TurnShip.prototype = new Action();
