getCurrentGame = function () {
    var gameId = Session.get('inGame');
    if(gameId){
        var game = gameCollection.findOne({_id: gameId});
        if(game){
            game.__proto__ = new Game();
        }
        return game;
    }
    else return undefined;
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
