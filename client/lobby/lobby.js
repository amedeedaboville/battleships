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
       console.log('sent invitation to ' + evt.target.id + ' from ' + Meteor.user().username);
       inviteCollection.insert({challenger: Meteor.userId(), opponent: evt.target.id});
    }
});

Template.modal.events({
	    'click #newMapButton' : function (evt) {
       //serverStream.emit('newMap', Session.get("enemy"), Meteor.userId());
       askForNewMap(currentGame);
    },

    'click #acceptMapButton' : function (evt) {
       //acceptMap(currentGame, Meteor.userId());
	     //THIS needs to go into inviteCollection.on... observe update
       $('#map-set-up-modal').modal('hide');
       Session.set('inGame', true);
       //inviteCollection.update({}, {$inc: 'accepted'});
       
    },

    'click #closeMapButton' : function () {
		//emit to stream that we are closing the modals
        //serverStream.emit('closeMap', Session.get("enemy"), Meteor.userId());
    },

});

Handlebars.registerHelper('isInGame',function(input){
  return Session.get("inGame") == true;
});
