getCurrentGame = function () {
    var game =  gameCollection.findOne({_id: Session.get('inGame')});
    if(game) {
        game.__proto__ = new Game();
        return game;
    }
    else{
        Session.set('inGame', false);
        return undefined;
    }    
}

getCurrentMap = function() {
    var map = Session.get('currentMap');
    if(map){
        map.__proto__ = new Map();
        return map;
    }
    else {
        return undefined;
    }
}

clearSessionVars = function() {
    Session.set('inGame', null);
    Session.set('currentMap', null);
    Session.set('opponentID', null);
    Session.set('selectedShip', null);
    Session.set('selectedAction', null);
    Session.set('complexGame', null);
    Session.set('showModal', null);
}
