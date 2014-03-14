currentGame = false;//new Game(Meteor.userId());
Deps.autorun(function (){
    Meteor.subscribe('games', Meteor.userId());
    console.log('so cute!');
    //var currentGame = gameCollection.findOne({active: true}, {});
    if (currentGame) {
        if (!currentGame.active) {
            //delete Session.keys["enemy"];
            //hide the game elements
            $('#mapModal').modal('hide');
        }
        else if (!currentGame.mapAccepted) {
            $('#mapModal').modal();
        }
        else if (currentGame.mapAccepted) {
            //Success
            $('#mapModal').modal('hide');
            Session.set('inGame', true);
            if(currentGame.turn == Meteor.userId()) {
                Session.set('currentTurn', true);
            }
            else {
                Session.set('currentTurn', false);
            }
            //Draw the actual game

        }
    }
});

Template.contextMenu.helpers({
    currentTurn: function() {
        return Session.get('currentTurn');
    },

    selectedShip: function(){
        return Session.get('selectedShip');
    },
});

Template.contextMenu.events({
    'click .actionButton' : function(evt) {
        var action = evt.target.id;
        Session.set('selectedAction', action);
    }
});
