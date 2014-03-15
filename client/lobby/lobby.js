Template.lobby.helpers({
    friendsOnline: function() {
        Meteor.subscribe("userStatus");
        return Meteor.users.find({"status.online": true, "_id": { $not: Meteor.userId()}}).fetch();
    }
});
Template.lobby.events({
    'mouseover .onlineplayers' : function () {
        //Sets the global variable to be all of the information for the user.
        //we just clicked on. Looks up the user with _this.id
        Session.set("currentProfile", Meteor.users.findOne({_id: this._id}));
    },
    'click .inviteButton' : function (evt) {
        inviteCollection.insert({challenger: Meteor.userId(), opponent: evt.target.id, gameID: 0});
    }
});

Template.modal.events({
    'click #newMapButton' : function (evt) {
        //serverStream.emit('newMap', Session.get("enemy"), Meteor.userId());
        askForNewMap(currentGame);
    },

    'click #acceptMapButton' : function (evt) {
        //By the time we are on the accept map modal, currentGame exists.
        var currentGame = gameCollection.find().fetch()[0];
        gameCollection.update({_id: currentGame._id},{$set: {mapAccepted: true}});

    },

    'click #closeMapButton' : function () {
        var currentGame = gameCollection.find().fetch()[0];
        gameCollection.remove({_id: currentGGame._id})
    },

});

Handlebars.registerHelper('isInGame',function(input){
    return Session.get("inGame") == true;
});
