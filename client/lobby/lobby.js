Template.lobby.helpers({
    friendsOnline: function() {
        Meteor.subscribe("userStatus");
        return Meteor.users.find({"status.online": true, "_id": { $not: Meteor.userId()}}).fetch();
    }
});
Template.savedGames.helpers({
    savedGames: function() {
        var opp = Session.get('opponentID');
    return gameCollection.find(
            {$and: [{$or: [{challenger : opp}, {opponent  : opp}]} , 
            {active:false}]}).fetch();
    //gameCollection.find(
    //        {$and: 
    //           [{$or: [{$and: [{opponent   : Meteor.userId()}, {challenger: opp}]} , 
    //                   {$and: [{challenger : Meteor.userId()}, {opponent  : opp}]}
    //           ]}, 
    //       {active:false}]}
    //               ).fetch();
    //    return gameCollection.find({$or: [{$and: [{opponent   : Meteor.userId()}, {challenger: opp}]} ,
    //                               {$and: [{challenger : Meteor.userId()}, {opponent  : opp}]}
    //                                              ]}
    //                                                                 ).fetch();
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
    },
    'click .loadButton' : function (evt) {
        Session.set('currentMap', null);
        Session.set('showSavedGames', true);
        Session.set('opponentID', evt.target.id);
        $('#loadModal').modal();
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
