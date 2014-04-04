Template.battleships.helpers({
    isInGame: function() {
        return Session.get('inGame');
    },

    hasCurrentMap: function(){
        if (Session.get('currentMap')){
            Meteor.subscribe('maps', Session.get('currentMap'), function(){
                if (mapCollection.findOne()){
                    Session.set('currentMap', mapCollection.findOne());
                    $('#mapModal').modal();
                }
            });
        }
        else{
            $('#mapModal').modal('hide');
        };

        //as soon as
        if (gameCollection.findOne() == undefined){
            $('#mapModal').modal('hide');
        };
    },

    setGameInactive: function(){
        Meteor.call('setAllGamesAsInactive');
    }
});

Deps.autorun(function (){
    gameHandler = Meteor.subscribe('games', Meteor.userId());
    inviteHandler = Meteor.subscribe('invites', Meteor.userId());
    // if (Session.get('inGame')){
    //     mapHandler = Meteor.subscribe('maps', Session.get('inGame').mapID);
    // }


    gameMessageStream.on('message', function(message){
        console.log('emit message');
        console.log(message);
    	$.UIkit.notify(message, {status: 'info'});
    })
});
