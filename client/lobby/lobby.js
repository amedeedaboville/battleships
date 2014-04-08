Template.lobby.helpers({
    friendsOnline: function() {
        Meteor.subscribe("userStatus");
        return Meteor.users.find({"status.online": true, "_id": { $not: Meteor.userId()}}).fetch();
    }
});
Template.savedGames.helpers({
    savedGames: function() {
    var opp = Session.get('opponentID');
    return savedCollection.find( {$or: [{challenger : opp}, {opponent  : opp}]} ).fetch();
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
Template.savedGames.events({
    'mouseover .previousGameElement' : function(evt) {
        Session.set('currentMap', gameCollection.findOne({_id: evt.target.id}).map);
    },
    'click .previousGameElement' : function(evt) {
        var game = gameCollection.findOne({_id: evt.target.id});
        console.log("sending invite to continue game with id " + evt.target.id);
        if(game.challenger == Meteor.userId()) { //If you were the challenger in a game we are loading
            inviteCollection.insert({challenger: game.challenger, opponent: game.opponent, gameID: game._id});
        }
        else {
            inviteCollection.insert({challenger: game.opponent, opponent: game.challenger, gameID: game._id});
        }
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
        Meteor.call('removeGame', getCurrentGame()._id);
    },

});
