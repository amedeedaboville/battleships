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
    },
    'click .someButton' : function (evt){
        console.log('lol');
    }
});

Template.modal.events({
    'click #newMapButton' : function (evt) {
        //serverStream.emit('newMap', Session.get("enemy"), Meteor.userId());
        askForNewMap(currentGame);
    },

    'click #acceptMapButton' : function (evt) {
        //By the time we are on the accept map modal, currentGame exists.
        gameCollection.update({_id: Session.get('currentGame')._id},{$set: {mapAccepted: true}});
        //inviteCollection.update({_id: inviteID}, {$set: {accepted: true}});
        //THIS needs to go into inviteCollection.on... observe update
        //$('#mapModal').modal('hide');
        //inviteCollection.update({}, {$inc: 'accepted'});

    },

    'click #closeMapButton' : function () {
        gameCollection.remove({_id: Session.get('currentGame')._id})
    },

});

Handlebars.registerHelper('isInGame',function(input){
    return Session.get("inGame") == true;
});
