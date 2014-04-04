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
            var newMap = new Map();
            return gameCollection.update({_id: game._id}, {$set: {mapAccepted: 0}, $inc : {mapsLeft: -1}, $set: {map: newMap}});

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
            //console.log(game);
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

Meteor.publish('invites', function(id) {
    return inviteCollection.find({$or: [{opponent : id}, {challenger: id} ]});
});

Meteor.publish('maps', function(id) {
    return inviteCollection.find({_id: id});
});

inviteCollection.find().observe({
    changed: function(oldDocument) {
        if (oldDocument.accepted){
            //create a new Game
            //console.log('a game was accepted');
            var aMap = new Map();
            var aMapId = mapCollection.insert(aMap);

            var aGame = new Game(oldDocument.challenger, oldDocument.opponent);
            aGame.mapID = aMapId;
            var gameID = gameCollection.insert(aGame);
        }
    }
});

gameCollection.find().observeChanges({
    changed: function(id, fields) {
        //if fields contains turn, notify the players.
        //console.log(fields);
    }
});

gameCollection.allow({
    insert: function(userId, doc, fieldNames, modifier) {
        return (userId == doc.opponent || userId == doc.challenger);
    },
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