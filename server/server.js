  Meteor.startup(function() {

    return Meteor.methods({
        removeAllInvites: function() {
            return inviteCollection.remove({$or: [{opponent :this.userId}, {challenger: this.userId} ]});

        },

        removeAllGames: function(){
            console.log('removing all games');
            return gameCollection.remove({$or: [{opponent :this.userId}, {challenger: this.userId} ]});
        },

        setAllGamesAsInactive: function(){
            console.log('getting CALL TO SET GAMES INACTIVE');
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
        
        removeGame: function(id){
            gameCollection.remove({_id: id});
            //return gameCollection.remove({$and: [{$or: [{opponent :this.userId}, {challenger: this.userId}]}, {active : true} ]});
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
    //return gameCollection.find({$or: [{opponent :this.userId}, {challenger: this.userId}]});
});

Meteor.publish('savedgames', function(id) {
    //return gameCollection.find({$and: [{$or: [{opponent :this.userId}, {challenger: this.userId}]}, {active : false} ]});
   return gameCollection.find({active : false});
});

Meteor.publish('invites', function(id) {
    return inviteCollection.find({$or: [{opponent : id}, {challenger: id} ]});
});

inviteCollection.find().observeChanges({
    //When an invite is accepted, we create a game for it
    changed: function(id, invite) {
        fullInvite = inviteCollection.findOne({_id:id});
        if (invite.accepted && (fullInvite.gameID == undefined)){
            console.log('creating game for invite id ' + id);
            var aGame = new Game(fullInvite.challenger, fullInvite.opponent);
            var gameID = gameCollection.insert(aGame);
            inviteCollection.update({_id: id}, {$set: {gameID: gameID}});
        }
    }
});

gameCollection.find().observeChanges({
    changed: function(id, fields) {
        //if fields contains turn, notify the players.
        //console.log(fields);
    }
});

savedCollection.allow({
    insert: function(userId, doc, fieldNames, modifier) {
        return (userId == doc.opponent || userId == doc.challenger);
    },
    update: function(userId, doc, fieldNames, modifier) {
            console.log("updating saved game" + doc);
            return true;
        //return (userId == doc.opponent || userId == doc.challenger);
    },
    remove: function(userId, doc) {
        if (userId == doc.opponent || userId == doc.challenger){
            return true;
        }
        else{
            return false;
        }
    }
});
gameCollection.allow({
    insert: function(userId, doc, fieldNames, modifier) {
        return (userId == doc.opponent || userId == doc.challenger);
    },
    update: function(userId, doc, fieldNames, modifier) {
        if(fieldNames.active != undefined) {
            console.log("updating active field");
            console.log(fieldNames);
            console.log(modifier);
        }

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
