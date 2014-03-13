currentGame = false;//new Game(Meteor.userId());
Deps.autorun(function (){
    //Meteor.subscribe('games', Meteor.userId());
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
    possibleMoves : function() {
        console.log("calculating possible moves");
        test = ["Move","Rotate"];
        var ship = Session.get('selectedShip');
        if(ship) {
            console.log("ship exists, looking for actions:");
            var actions =  ship.actions.map(function(a) { return a.name});
            console.log(actions);
            return acions;
        }

        return test;
    },
    currentTurn: function() {
        return Session.get('currentTurn');
    },

    selectedShip: function(){
        return Session.get('selectedShip');
    },
});

