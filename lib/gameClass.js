Game = function(p1, p2) {
    this.id = 0;
    this.p1id = p1;
    this.p2id = p2;
    this.accepted = false;
    this.mapsLeft = 3;
    this.active = true;
    this.mapAccepted = true;
    this.moveArray = new Array("Move", "Fire");

    this.turn = this.p1id;
    //this.Map = new Map();//TODO: initialize Map and all that

    this.map = new Map();    
}

