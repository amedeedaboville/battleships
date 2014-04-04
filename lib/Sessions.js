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
    var game = getCurrentGame();
    if(map instanceof Map) 
    {
        map.__proto__ = new Map();
        return map;
    }
    else if (game){
        map = mapCollection.findOne({_id: game.mapID});
        if (map){
            map.__proto__ = new Map();
            Session.set('currentMap', map);
            return map;
        }
    }
    else return undefined;
}
