Action = function() {
    this.text = "Action Name";
    this.name = "default";
}

MoveShip = function() {
    this.text = "Move";
    this.name = "moveShip";
}

TurnShip = function() {
    this.text = "Turn";
    this.name = "turnShip";
}

MoveShip.prototype = new Action();
TurnShip.prototype = new Action();
