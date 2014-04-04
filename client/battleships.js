Template.battleships.helpers({
    isInGame: function() {
        return Session.get('inGame');
    },

    showModal: function(){
        if (Session.get('showModal') && getCurrentMap()){
            $('#mapModal').modal();
        }
        else{
            $('#mapModal').modal('hide');
        }
    },

    setGameInactive: function(){
        Meteor.call('setAllGamesAsInactive');
    }
});

Deps.autorun(function (){
    gameHandler = Meteor.subscribe('games', Meteor.userId());
    inviteHandler = Meteor.subscribe('invites', Meteor.userId());

    gameMessageStream.on('message', function(message){
        console.log('emit message');
        console.log(message);
    	$.UIkit.notify(message, {status: 'info'});
    })
});
