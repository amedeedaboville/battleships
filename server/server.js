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

/**inviteStream: controls the flow between clients for the invitation process**/

//only targeted clients can listen to the invitation response
inviteStream.permissions.read(function(eventName) {
    return eventName == this.userId;
});

//any client can send an event
inviteStream.permissions.write(function(eventName) {
    return true;
});

Meteor.publish('game', function(id) {
    return gameCollection.find({});
});

Meteor.publish('invite', function(id){
    return inviteCollection.find({opponent : id});
});

inviteCollection.find({}).observeChanges({
    changed: function(id, fields) {
        if (fields.accepted) {
            var aGame = new Game(fields.P1, fields.P2);
            var gameID = gameCollection.insert({game: aGame});
            console.log("created game with id " + gameID);
            inviteCollection.update({_id: id}, {$set: {gameID: gameID}});
        }
    }
});

Meteor.methods({
    askForNewMap: function() {
        game.map = new Map();
        game.mapsLeft--;
        gameCollection.update({id: game.id}, {$set: {map: new Map()}}, {$inc: {mapsLeft: -1}});
    }
});
