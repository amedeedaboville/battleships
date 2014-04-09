var sendGameMessage = function(message) {
    gameMessageStream.emit('message', message);
    //console.log('message emitted on server');
}

var turnShip = function(map, ship, direction) {
    //console.log("Got request to turn " + ship.id + " in direction " + direction);
    //console.log("This is ship rotation " + ship.orientation + ",and stern: " + ship.sternPosition + ",and bow: " +ship.bowPosition);
    var obstruction = map.turnShip(ship, direction); 
    if (obstruction === undefined) {
        console.log("Ship " +ship.name + "sucessfully turned.");
    } else { //Signal both players about the obstruction
        obstruction.__proto__ = new Square();
        console.log("Ship " +ship.name + "failed to turn (obstruction).");
        sendGameMessage("Collision at position: " + obstruction.position);
    }
    return map;
};

var moveShip = function(map, ship, position) {
    //console.log("Got request to move " + ship.id + " to position " + position);
    map.moveShip(ship, position);
    //console.log("done with map operation")
    return map;
};

var turnShipLeft = function(map, ship) {
    turnShip(map, ship, Math.PI*1.5);
    return map;
};

var turnShipRight = function(map, ship) {
    turnShip(map, ship, Math.PI*0.5);
    return map;
};

var fireCannon = function(map, ship, targetPosition) {
    map.fireCannon(ship, targetPosition);
    return map;
};

var explodeMine = function(targetSquare) {
    map.explodeMine(targetSquare);
    return map;
};

var layMine = function(map, ship, position) {
    map.layMine(ship, position);
    return map;
};

var pickupMine = function(map, ship, position) {
    map.pickupMine(ship, position);
    return map;
};


var extendRadar = function(map, ship, position){
   console.log("its calling extend radar to map")
    map.extendRadar(ship);
    return map;
}

var fireTorpedo = function(map, ship, position) {
    map.fireTorpedo(ship, position);
    return map;
};

var healShip = function(map, ship, position) {
    map.healShip(ship);
    return map;
}

var selfDestruct = function(map, ship, position) {
    map.selfDestruct(position);
    return map;
}

Meteor.methods({

    completeTurn: function(action, ship, position){
       //get current Game
        var game = gameCollection.findOne({$and: [{$or: [{opponent :this.userId}, {challenger: this.userId}]}, {active : true} ]}); //Get the player's active game
        var map = game.map;
        map.__proto__ = new Map();
        ship.__proto__ = new Ship();
       
        var newMap = eval(action)(map, ship, position);
        newMap.shipDictionary[ship.id] = ship;
        
        game.map = newMap;
        sendGameMessage(action);

        ///* Heal ships if they end a turn on a base -- starting from bow and working backward
        //note: the bow is the LAST element in the ship.shipSquares array*/

        /* GAME OVER CONDITION: Check to see if the players still have at least one ship */
        var cHasShips = false;
        var oHasShips = false;
        var allShips = map.getShips();
        var winner = "nobody";

        for (shipKey in allShips) {
          var ship = allShips[shipKey];
          switch (ship.owner) {
               case "challenger": 
                   cHasShips = true;
                   break;
             case "opponent": 
                   oHasShips = true;
                   break;
          }
          //Check after each iteration that players back ships.
          if (cHasShips == true && oHasShips == true) {
              winner = "nobody";
               break; // this breaks the loop, not the switch
          }
        }
        console.log("Winner is: " +winner);
        
        if (winner == "nobody") {
            game.turn+= 1;
            gameCollection.update({_id:game._id}, game);
        } else {
            sendGameMessage("Game over! Winner: " +winner);
        }
},

    rearrange: function(isOpponent) {
        var game = gameCollection.findOne({$and: [{$or: [{opponent :this.userId}, {challenger: this.userId}]}, {active : true} ]}); //Get the player's active game
        var map = game.map;
        map.__proto__ = new Map();
        map.makeShips(true, !isOpponent, isOpponent);
        map.drawGrid();
        gameCollection.update({_id:game._id}, game);
    },


//        if (winner == "nobody") { //Continue incrementing turns if the game is not over
//            //gameCollection.update({_id: game._id}, {$inc: {turn: 1}}); 
//        } else { //the game is over
//            sendGameMessage("Game over! Winner: " +winner);
//        }
//},

    rearrange: function(isOpponent) {
        var game = gameCollection.findOne({$and: [{$or: [{opponent :this.userId}, {challenger: this.userId}]}, {active : true} ]}); //Get the player's active game
        var map = game.map;
        map.__proto__ = new Map();
        map.makeShips(true, !isOpponent, isOpponent);
        map.drawGrid();
        gameCollection.update({_id:game._id}, game);
    },



/**
* NAME: useWeapon (GameID gameID, Ship ship, String weaponType, Position targetPosition)
* PURPOSE: This method is used to cause damage to other ships -- represents the firing of a cannon, a torpedo, or a mine explosion
*/
useWeapon: function(gameID, ship, weaponType, targetPosition) {
               var targetSquare = map.getObjectAtPosition(targetPosition);
               //Get game info
               var game = gameCollection.findOne({_id:gameID});

        if (game){ //Check to make sure the game is legal
               //get map data
               var map = game.map;//mapCollection.findOne({_id:game.mapID});
               map.__proto__ = new Map();
               
               var impactPosition; //represents the area of effect as produced by a weapon being used
               map.shipDictionary[ship.id] = ship;
                var impactPosition;

               /* Determine what kind of damage function in the map to invoke */
               switch (weaponType){
                case "cannon":
                    console.log("Preparing to fire cannon at target position " +targetSquare.coordinateString()+" ("+ship.shipName+")");
                    map.fireCannon(ship, targetPosition);
                    impactPosition = targetPosition;
                    break;
                case "mineExplosion":
                    console.log("Preparing to explode mine at position " +targetSquare.coordinateString());
                    impactPosition = map.explodeMine(targetPosition);
                    break;
                case "torpedo":
                    console.log("Preparing to fire torpedo at target position " +targetSquare.coordinateString()+" ("+ship.shipName+")");
                    impactPosition = map.fireTorpedo(ship, targetPosition);//fire torpedo returns an area to damage
                    break;
                case "selfDestruct":
                    map.selfDestruct(targetPosition); //target square should be the boat's square
                    if (map == undefined) 
                        console.log("Map got fucked");
                    impactPosition = targetPosition;
                    map.killShip(ship); // kamikazes destruct themselves
                    break;            
               }

               // send message about the impact
               if (impactPosition != undefined) 
                   sendGameMessage("Ship hit! " + "(" + impactPosition[0] + ", " + impactPostion[1] +")"); // Alert both players that a ship sank at the bow position
        } else {
            console.log("Error game does not exist");
            console.log(game);
            return false;
        }
           }
});

