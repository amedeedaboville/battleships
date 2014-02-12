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
    return gameCollection.find({$or: [{player1ID: id}, {player2ID: id}]});
});

Meteor.publish('invite', function(id){
    return inviteCollection.find({opponent : id});
});

inviteCollection.find({}).observeChanges({
    updated: function(id, fields) {
        if (fields.accepted) {
            game = new Game();
            gameCollection.insert(game);


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
