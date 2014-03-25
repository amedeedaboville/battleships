var turnShip = function(map, ship, direction) {
    console.log("Got request to turn " + ship.id + " in direction " + direction);
    map.turnShip(ship, direction);
    console.log("done with map operation")
};

var moveShip = function(map, ship, position) {
    console.log("Got request to move " + ship.id + " to position " + position);
    map.moveShip(ship, position);
    console.log("done with map operation")
};

var turnShipLeft = function(map, ship) {
    turnShip(map, ship, "counterclockwise");
};
var turnShipRight = function(map, ship) {
    turnShip(map, ship, "clockwise");
};


Meteor.methods({
    completeTurn: function(action, ship, position){
        //get current Game
        var game = gameCollection.findOne({$and: [{$or: [{opponent :this.userId}, {challenger: this.userId}]}, {active : true} ]}); //Get the player's active game
        var map = mapCollection.findOne({_id: game.mapID});
        map.__proto__ = new Map();

        eval(action)(map, ship, position)
        
        //update the collections
        map.shipDictionary[ship.id] = ship;
        mapCollection.update({_id:game.mapID}, map);
        gameCollection.update({_id:game._id}, game);

        //changeTurn
        gameCollection.update({_id: game._id}, {$inc: {turn: 1}}); 
    },
    fireCannon: function(gameID, ship, targetPosition){
        console.log("Got request in game" +gameID+" to shoot "+targetPosition+" a cannon")
            var game = gameCollection.findOne({_id:gameID});
            var map = mapCollection.findOne({_id: game.mapID});
            map.__proto__ = new Map();
            if (game){
                map.fireCannon(ship, targetPosition);

                console.log("done with the map operation.");
                game.map.shipDictionary[ship.id] = ship;

                gameCollection.update({_id:gameID}, game);
                console.log("done updating game, square should be shot")
                return true;
            } else {
                console.log("Error game does not exist");
                console.log(game);
                return false;
            }
    }
});

