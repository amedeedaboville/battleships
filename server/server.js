  Meteor.startup(function() {

    return Meteor.methods({

        removeAllInvites: function(aOpponent, aChallanger) {

        return inviteCollection.remove({$or: [{opponent :aOpponent}, {challenger: aChallanger} ]});

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

  /**inviteStream: controls the flow between clients for the invitation process**/

//only targeted clients can listen to the invitation response
inviteStream.permissions.read(function(eventName) {
    return eventName == this.userId;
});

//any client can send an event
inviteStream.permissions.write(function(eventName) {
    return true;
});

Meteor.publish('games', function(id) {
    return gameCollection.find({$or: [{opponent : id}, {challenger: id} ]});
});

Meteor.publish('invites', function(id){
    console.log(id);
    return inviteCollection.find({$or: [{opponent : id}, {challenger: id} ]});
});

inviteCollection.find({}).observe({
    changed: function(oldDocument) {
        if (oldDocument.accepted) {
            var aGame = new Game(oldDocument.challenger, oldDocument.opponent);
            var gameID;
            console.log(oldDocument.gameID);
            console.log('indeed');
            console.log(oldDocument.gameID == 0);
            if (oldDocument.gameID == 0){
                gameID = gameCollection.insert(aGame);
                console.log("done creating game");
            }
            else{
                gameID = oldDocument.gameID;
            }

            inviteCollection.update({_id: oldDocument._id}, {$set: {gameID: gameID}});
        }
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
        if (userId == doc.opponent || userId == doc.challenger){
            return true;
        }
        else{
            return false;
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
