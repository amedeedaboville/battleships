Template.battleships.helpers({
    isInGame: function() {
        return Session.get('inGame');
    },

    setGameInactive: function(){
        Meteor.call('setAllGamesAsInactive');
    }
});

Deps.autorun(function (){
    gameHandler = Meteor.subscribe('games', Meteor.userId());
    inviteHandler = Meteor.subscribe('invites', Meteor.userId());
});
