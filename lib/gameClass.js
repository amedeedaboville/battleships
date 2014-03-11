Game = function(p1, p2) {
    this.id = 0;
    this.challenger = p1;
    this.opponent = p2;
    this.mapsLeft = 3;
    this.active = true;
    this.mapAccepted = true;
    this.moveArray = new Array("Move", "Fire");

    this.turn = this.p1id;
    this.map = new Map();    
}

