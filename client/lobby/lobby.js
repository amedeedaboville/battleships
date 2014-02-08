Template.lobby.username = function () {
    return Meteor.user().username;
};

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
        console.log("this is your id: " + Meteor.userId());
    },
    'click .inviteButton' : function (evt) {
        console.log("sent invitation to " + evt.target.id + " from " + Meteor.user().username);
       inviteStream.emit(evt.target.id, Meteor.userId(), Meteor.user().username);
    },

    'click #logoutButton' : function () {
        Meteor.logout();
    }
});

Template.modal.events({
	    'click #newMapButton' : function (evt) {
       serverStream.emit('newMap', Session.get("enemy"), Meteor.userId());
    },

    'click #acceptMapButton' : function (evt) {
       serverStream.emit('doneMap', Session.get("enemy"), Meteor.userId());
    },

    'click #closeMapButton' : function () {
		//emit to stream that we are closing the modals
        serverStream.emit('closeMap', Session.get("enemy"), Meteor.userId());
    },

});


