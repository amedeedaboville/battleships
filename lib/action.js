Action = function() {
    this.text = "Action Name";
    this.name = "default";
    this.execute = function(params) {
        console.log("Default Action called with params");
        console.log(params);
    }
}

MoveShip = function() {
    this.text = "Move";
    this.name = "moveShip";
    this.execute = function(position, ship) {
        Map.moveShip(ship, position);
    }
}

TurnShip = function() {
    this.text = "Turn";
    this.name = "turnShip";
    this.execute = function(position, ship) {
        Map.turnShip(ship, position);
    }
}

MoveShip.prototype = new Action();
TurnShip.prototype = new Action();
