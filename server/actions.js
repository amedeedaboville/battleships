Meteor.methods({
    moveShip: function(gameID, ship, position) {
        console.log("Got request to move " + ship.id + " in game " + gameID + " to position " + position);
        console.log("square currently contains");
        var game = gameCollection.findOne({_id:gameID});
        var map = game.map;
        map.grid.__proto__ = new Grid();
        console.log(game.map.grid.getObjectAtPosition(position))
        if(game) {
            map.__proto__ = new Map();
            map.moveShip(ship, position);

            console.log("done with map operation, ship position is now ")
            console.log(game.map.grid.getObjectAtPosition(position))

            game.map.shipDictionary[ship.id] = ship;
            console.log(game.map.grid.getObjectAtPosition(position))

            gameCollection.update({_id:gameID}, game);
            console.log("done updating game, ship position is now ")

            var game = gameCollection.findOne({_id:gameID});
            var map = game.map;
            map.grid.__proto__ = new Grid();
            console.log(map.grid.getObjectAtPosition(position))
            console.log(game.map.shipDictionary[ship.id].bowPosition);
        }
        else {
            console.log("Error game does not exist");
            console.log(game);
        }
    },
    turnShip: function(gameID, ship, position) {
        console.log("Got request to turn ship.");
    }
    fireCannon: function(gameID, ship, targetPosition){
        console.log("Got request in game" +gameID+" to KILL A MOTHERFUCKER AT POSITION "+targetPosition+" WITH A FUCKING CANNON AUUAARRGGHHHH")
            var game = gameCollection.findOne({_id:gameID});
            map.grid.__proto__ = new Grid();
            if (game){
                map.__proto__ = new Map();
                map.fireCannon(ship, targetPosition);

                console.log("done with the map operation.");

                gameCollection.update({_id:gameID}, game);
                console.log("done updating game, square should be shot")
            } else {
                console.log("Error game does not exist");
                console.log(game);
            }
    }
});

