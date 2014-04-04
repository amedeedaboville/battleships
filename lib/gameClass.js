Game = function(p1, p2) {
    this.challenger = p1;
    this.opponent = p2;
    this.mapsLeft = 3;
    this.active = true;
    this.mapAccepted = 0;
    this.selectedShip = undefined;
    this.turn = 0;
    this.map = new Map();
    this.mapID = -1;
}
