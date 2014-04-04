var sendGameMessage = function(message) {
    gameMessageStream.emit('message', message);
    //console.log('message emitted on server');
}

var turnShip = function(map, ship, direction) {
    //console.log("Got request to turn " + ship.id + " in direction " + direction);
    //console.log("This is ship rotation " + ship.orientation + ",and stern: " + ship.sternPosition + ",and bow: " +ship.bowPosition);
    map.turnShip(ship, direction); 
    //console.log("done with map operation")
};

var moveShip = function(map, ship, position) {
    //console.log("Got request to move " + ship.id + " to position " + position);
    map.moveShip(ship, position);
    //console.log("done with map operation")
};

var turnShipLeft = function(map, ship) {
    turnShip(map, ship, Math.PI*1.5);
};
var turnShipRight = function(map, ship) {
    turnShip(map, ship, Math.PI*0.5);
};

var layMine = function(map, ship, position) {
    map.layMine(ship, position);
};

var pickupMine = function(map, ship, position) {
    map.pickupMine(ship, position);
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
        sendGameMessage(action);
        
        //changeTurn
        gameCollection.update({_id: game._id}, {$inc: {turn: 1}}); 
    },

    //This method is used to cause damage to other ships -- represents the firing of a cannon, a torpedo, or a mine explosion
    useWeapon: function(gameID, ship, weaponType, targetPosition){
        var targetSquare = map.getObjectAtPosition(targetPosition);
        //Get game info
        var game = gameCollection.findOne({_id:gameID});
        var map = mapCollection.findOne({_id:game.mapID});

        //Represents the area of effect as produced by a weapon being used
        var dangerZone = [];
            map.__proto__ = new Map();

        if (game){
            //Determine which map method to invoke
            map.fireCannon(ship, targetSquare);
            map.shipDictionary[ship.id] = ship;
            switch (weaponType){
                case "cannon":
                    console.log("Preparing to fire cannon at position " +targetSquare.coordinateString()+" ("+ship.shipName+")");
                    map.fireCannon(ship, targetSquare);
                    map.applyDamage(dangerZone);
                    //Simply apply damage to the shipSquare
                    //Generate a notification
                    break;
                case "mineExplosion":
                    console.log("Preparing to explode mine at position " +targetSquare.coordinateString());
                    map.explode(targetSquare);
                    break;
                case "torpedo":
                    console.log("Preparing to fire torpedo at position " +targetSquare.coordinateString()+" ("+ship.shipName+")");
                    dangerZone = map.fireTorpedo(ship, targetSquare);
                    map.applyDamage(dangerZone);
                    break;
            }

//TODO: Move all below this somewhere better
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

