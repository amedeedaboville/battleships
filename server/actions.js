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
    //This method is used to cause damage to other ships -- represents the firing of a cannon, a torpedo, or a mine explosion
    useWeapon: function(gameID, ship, weaponType, targetPosition){
        var targetSquare = map.getObjectAtPosition(targetPosition);
        //Get game info
        var game = gameCollection.findOne({_id:gameID});
        var map = mapCollection.findOne({_id:game.mapID});
        map.__proto__ = new Map();//TODO: this line may need to be altered to comply with map-grid merge
        map.grid.__proto__ = new Grid();// ^ ditto

        //Represents the area of effect as produced by a weapon being used
        var AoE = [];

        if (game){
            //Determine which map method to invoke
            map.fireCannon(ship, targetPosition);
            switch (weaponType){
                case "cannon":
                    console.log("Preparing to fire cannon at position " +targetSquare.coordinateString()+" ("+ship.shipName+")");
                    map.fireCannon(ship, targetSquare);
                    map.applyDamage(AoE);
                    //Simply apply damage to the shipSquare
                    //Generate a notification
                    break;
                case "mineExplosion":
                    console.log("Preparing to explode mine at position " +targetSquare.coordinateString());
                    map.explode(targetSquare);
                    break;
                case "torpedo":
                    console.log("Preparing to fire torpedo at position " +targetSquare.coordinateString()+" ("+ship.shipName+")");
                    AoE = map.fireTorpedo(ship, targetSquare);
                    map.applyDamage(AoE);
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

