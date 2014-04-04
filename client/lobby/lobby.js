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
        inviteCollection.insert({challenger: Meteor.userId(), opponent: evt.target.id});
    }
});

Template.modal.events({
    'click #newMapButton' : function (evt) {
        Meteor.call('askForNewMap');

    },

    'click #acceptMapButton' : function (evt) {
        var accepted = Meteor.call('mapAccepted');
        $('#acceptMapButton').prop('disabled', true);
    },

    'click #closeMapButton' : function () {
        Meteor.call('removeActive');
    },

});
