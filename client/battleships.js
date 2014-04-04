Template.battleships.helpers({
    isInGame: function() {
        return Session.get('inGame');
    },

    hasCurrentMap: function(){
        if (Session.get('currentMap')){
            if(!Session.get('currentMap').squares){
                Meteor.subscribe('maps', Session.get('currentMap'), function(){
                    console.log('subscribing again');
                    console.log(mapCollection.findOne());
                    if (mapCollection.findOne()){
                        Session.set('currentMap', mapCollection.findOne());
                        $('#mapModal').modal();
                    }
                });
            }
            else {
                console.log('updating our session variable...')
                if (mapCollection.findOne()){
                    Session.set('currentMap', mapCollection.findOne());
                }
            }
        }
        else{
            //$('#mapModal').modal('hide');
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
