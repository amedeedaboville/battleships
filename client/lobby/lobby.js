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
        Meteor.call('mapAccepted');
    },

    'click #closeMapButton' : function () {
        Meteor.call('removeActive');
    },

});
