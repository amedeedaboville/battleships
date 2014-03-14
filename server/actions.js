var turnShip = function(gameID, ship, direction) {
        console.log("Got request to turn " + ship.id + " in game " + gameID + " in direction " + direction);
        var game = gameCollection.findOne({_id:gameID});
        var map = game.map;
        map.__proto__ = new Map();
        map.grid.__proto__ = new Grid();
        if(game) {
            map.turnShip(ship, direction);
            console.log("done with map operation")
            game.map.shipDictionary[ship.id] = ship;
            gameCollection.update({_id:gameID}, game);
        }
        else {
            console.log("Error game does not exist");
            console.log(game);
        }
    };
Meteor.methods({
    moveShip: function(gameID, ship, position) {
        console.log("Got request to move " + ship.id + " in game " + gameID + " to position " + position);
        var game = gameCollection.findOne({_id:gameID});
        var map = game.map;
        map.__proto__ = new Map();
        map.grid.__proto__ = new Grid();
        if(game) {
            map.moveShip(ship, position);

            console.log("done with map operation")

            game.map.shipDictionary[ship.id] = ship;
            gameCollection.update({_id:gameID}, game);
        }
        else {
            console.log("Error game does not exist");
            console.log(game);
        }
    },
    turnShipLeft: function(gameID, ship) {
        turnShip(gameID, ship, "counterclockwise");
    },
    turnShipRight: function(gameID, ship) {
        turnShip(gameID, ship, "clockwise");
    },
    fireCannon: function(gameID, ship, targetPosition){
        console.log("Got request in game" +gameID+" to shoot "+targetPosition+" a cannon")
            var game = gameCollection.findOne({_id:gameID});
            var map = game.map;
                            map.__proto__ = new Map();
            map.grid.__proto__ = new Grid();
            if (game){
                map.fireCannon(ship, targetPosition);

                console.log("done with the map operation.");
                game.map.shipDictionary[ship.id] = ship;

                gameCollection.update({_id:gameID}, game);
                console.log("done updating game, square should be shot")
            } else {
                console.log("Error game does not exist");
                console.log(game);
            }
    }
});

