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
            if (gameCollection.findOne({$and: [{opponent :this.userId}, {active : true} ]})){
                return gameCollection.update({$and: [{opponent :this.userId}, {active : true} ]},
                    {$inc: {mapAccepted: 2}});
            }
            else if (gameCollection.findOne({$and: [{challenger: this.userId}, {active : true} ]})){
                return gameCollection.update({$and: [{challenger: this.userId}, {active : true} ]},
                    {$inc: {mapAccepted: 11}});
            }
        },
        
        askForNewMap: function() {
            var game = gameCollection.findOne({$and: [{$or: [{opponent :this.userId}, {challenger: this.userId}]}, {active : true} ]});
            mapCollection.remove({_id: game.mapID});
            console.log(game);
            var map = new Map();
            game.mapID = mapCollection.insert(map);
            console.log('here');
//            return gameCollection.update({_id: game._id}, {$set: {mapID: game.mapID}}, {$set: {mapAccepted: 0}}, {$inc: {mapsLeft: -1}});
            return gameCollection.update({_id: game._id}, {$set: {mapAccepted: 0}, $inc : {mapsLeft: -1}, $set: {mapID: game.mapID}});

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

inviteCollection.find().observe({
    changed: function(oldDocument) {
        if (oldDocument.accepted){
            //create a new Game
            var aGame = new Game(oldDocument.challenger, oldDocument.opponent);

            //create a new Map
            console.log('creating a new Map');
            aGame.mapID = mapCollection.insert(new Map());
            // mapID = mapCollection.insert(new Map());
            inviteCollection.update({_id: oldDocument._id}, {$set: {mapID: aGame.mapID, accepted: undefined}});
            var gameID = gameCollection.insert(aGame);
        }
    }
});

gameCollection.find().observeChanges({
    changed: function(id, fields) {
        //if fields contains turn, notify the players.
        console.log(fields);
    }
});

gameCollection.allow({
    update: function(userId, doc, fieldNames, modifier) {
        return (userId == doc.opponent || userId == doc.challenger);
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

inviteCollection.allow({
    'insert': function (userId,doc) {
        return userId == doc.challenger; 
    },
    'update': function (userId,doc) {
        return (userId == doc.opponent); 
    }
});

mapCollection.allow({
    'insert': function (userId,doc) {
        return true; 
    },
    'update': function (userId,doc) {
        return true; 
    },
    'remove': function (userId,doc) {
        return true; 
    }

});