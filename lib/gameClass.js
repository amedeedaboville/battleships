Game = function(p1, p2) {
    this.challenger = p1;
    this.opponent = p2;
    this.mapsLeft = 3;
    this.active = true;
    this.mapAccepted = false;
    this.selectedShip = undefined;
    this.turn = this.p1id;
    this.map = new Map();
}

 currentGame = gameCollection.find().fetch()[0];
 gameDep = new Deps.Dependency;

 getGame = function (){
	gameDep.depend();
	return currentGame;
}

setGame = function (index){
	currentGame = gameCollection.find().fetch()[index];
	gameDep.changed();
}