  Meteor.startup(function() {

    return Meteor.methods({
        removeAllInvites: function() {
            return inviteCollection.remove({$or: [{opponent :this.userId}, {challenger: this.userId} ]});

        },

        removeAllGames: function(){
            return gameCollection.remove({$or: [{opponent :this.userId}, {challenger: this.userId} ]});
        },

        setAllGamesAsInactive: function(){
            return gameCollection.update({$and: [{$or: [{opponent :this.userId}, {challenger: this.userId}]}, {active : true} ]},
                {$set: {active: false}});
        },

        mapAccepted: function(){
            return gameCollection.update({$and: [{$or: [{opponent :this.userId}, {challenger: this.userId}]}, {active : true} ]},
                {$set: {mapAccepted: true}});
        },
        
        askForNewMap: function() {
            game.map = new Map();
            game.mapsLeft--;
            gameCollection.update({id: game.id}, {$set: {map: new Map()}}, {$inc: {mapsLeft: -1}});
        },
        
        removeActive: function(){
            return gameCollection.remove({$and: [{$or: [{opponent :this.userId}, {challenger: this.userId}]}, {active : true} ]});
        },

        changeTurn: function(){
            return gameCollection.update({$and: [{$or: [{opponent :this.userId}, {challenger: this.userId}]}, {active : true} ]},
                {$inc: {turn: 1}}); 
        },
        getTurn: function(){
            var game = gameCollection.findOne({$and: [{$or: [{opponent :this.userId}, {challenger: this.userId}]}, {active : true} ]});
            console.log(game);
            console.log(game.turn);
            return game.turn;
        }

    });

});


  Meteor.publish("userStatus", function() {
    return Meteor.users.find({}, {username:true});
});
  Meteor.publish("user-info", function(id) {
    return Meteor.users.find({_id: id}, {username: true});
});

  chatStream.permissions.read(function(eventName) {
    return eventName == 'chat';
});

  chatStream.permissions.write(function(eventName) {
    return eventName == 'chat';
});

  gameMessageStream.permissions.read(function(message) {
    return gameCollection.findOne({$and: [{$or: [{opponent :this.userId}, {challenger: this.userId}]}, {active : true} ]});
});

  gameMessageStream.permissions.write(function(message) {
    return gameCollection.findOne({$and: [{$or: [{opponent :this.userId}, {challenger: this.userId}]}, {active : true} ]});
});

//return latest game
Meteor.publish('games', function(id) {
    return gameCollection.find({$and: [{$or: [{opponent :this.userId}, {challenger: this.userId}]}, {active : true} ]});
});

Meteor.publish('maps', function(mapID) {
    return mapCollection.find({_id: mapID});
});

Meteor.publish('invites', function(id) {
    return inviteCollection.find({$or: [{opponent : id}, {challenger: id} ]});
});

inviteCollection.find({}).observe({
    changed: function(oldDocument) {
        if (oldDocument.accepted && oldDocument.gameID == 0) {
            var aGame = new Game(oldDocument.challenger, oldDocument.opponent);

            aGame.mapID = mapCollection.insert(new Map());
            var gameID = gameCollection.insert(aGame);
            console.log("done creating game with ID " + gameID);
            console.log("done inserting map with ID " + aGame.mapID);
            inviteCollection.update({_id: oldDocument._id}, {$set: {gameID: gameID}});
           console.log("updated invitation with id " + oldDocument._id);
        }
    }
});

gameCollection.find({}).observeChanges({
    changed: function(id, fields) {
        //if fields contains turn, notify the players.
        console.log(fields);
    }
});

gameCollection.allow({
    update: function(userId, doc, fieldNames, modifier) {
        if(fieldNames[0] == 'mapAccepted'){
            console.log("Accepting update to document ");
            return true;
        }
        else {
            console.log("Denying update to document ");
            return false;
        }
    },
    remove: function(userId, doc) {
        console.log(doc);
        if (userId == doc.opponent || userId == doc.challenger){
            return true;
        }
        else{
            return false;
        }
    }
});
