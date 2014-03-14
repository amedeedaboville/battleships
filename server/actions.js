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
    turnShip: function(gameID, ship, position) {
        console.log("Got request to turn ship.");
    }
});

