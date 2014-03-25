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
        var game = gameCollection.findOne({$and: [{$or: [{opponent :this.userId}, {challenger: this.userId}]}, {active : true} ]}); //({_id:gameID});
        var map = game.map;
        map.__proto__ = new Map();
        map.grid.__proto__ = new Grid();
        eval(action)(map, ship, position)
        
        //update the game
        game.map.shipDictionary[ship.id] = ship;
        gameCollection.update({_id:game._id}, game);

        //changeTurn
        gameCollection.update({$and: [{$or: [{opponent :this.userId}, {challenger: this.userId}]}, {active : true} ]},
                            {$inc: {turn: 1}}); 
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
                return true;
            } else {
                console.log("Error game does not exist");
                console.log(game);
                return false;
            }
    }
});

