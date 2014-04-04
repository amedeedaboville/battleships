Template.battleships.helpers({
    isInGame: function() {
        return Session.get('inGame');
    },

    hasCurrentMap: function(){
        if (Session.get('currentMap')){
            if (!Session.get('currentMap').squares){
                console.log('here mapitito');

                Meteor.subscribe('maps', Session.get('currentMap'), function(){
                    if (mapCollection.findOne()){
                        console.log('displaying modal');
                        $('#mapModal').modal();
                        Session.set('currentMap', mapCollection.findOne());
                    }
                });
            }
            else{
            console.log('here mapita');
            //$('#mapModal').modal();
//                Session.set('currentMap', mapCollection.findOne());
            };
        }
        else{
            console.log('here map')
            //$('#mapModal').modal('hide');
        };

        //as soon as
        if (gameCollection.findOne() == undefined){
            console.log('here mapx2')
            //$('#mapModal').modal('hide');
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
