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

Meteor.startup(function(){
    gameHandler = Meteor.subscribe('games', Meteor.userId());
    inviteHandler = Meteor.subscribe('invites', Meteor.userId());
})

Deps.autorun(function (){
    game = gameCollection.findOne();

    //tear down and set up mapsubscription as game changes
    if (!game) return;
    mapHandler = Meteor.subscribe('maps', game.mapID);
   // Session.set('currentMap', mapCollection.findOne());//TO-DO!


    // gameMessageStream.on('message', function(message){
    //     console.log('emit message');
    //     console.log(message);
    // 	$.UIkit.notify(message, {status: 'info'});
    // })
});
