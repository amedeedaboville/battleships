getCurrentGame = function () {
    var game = Session.get('inGame');
    if(game) 
    {
        game.__proto__ = new Game();
        return game;
    }
    else return undefined;
}

getCurrentMap = function() {
    var map = Session.get('currentMap');
    if(map) {
        map.__proto__ = new Map();
        return map;
    }
    else {
        var game = getCurrentGame();
        if(game != undefined) {
            map = mapCollection.findOne({_id: game.mapID});
            map.__proto__ = new Map();
            Session.set('currentMap', map);
            return map;
        }
        else {
            return undefined;
        }
    }
}
