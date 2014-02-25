currentGame = false;//new Game(Meteor.userId());
Deps.autorun(function (){
    //Meteor.subscribe('games', Meteor.userId());
    //var currentGame = gameCollection.findOne({active: true}, {});
    if (currentGame) {
	if (!currentGame.active)
	{
		//delete Session.keys["enemy"];
        //hide the game elements
		$('#map-set-up-modal').modal('hide');
	}
    else if (!currentGame.mapAccepted) {
        $('#map-set-up-modal').modal();
	}
	else if (currentGame.mapAccepted)
	{
            //Success
		$('#map-set-up-modal').modal('hide');
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

Template.game.helpers({
   possibleMoves : function() {
       console.log("current game is ");
       console.log(currentGame);
       return currentGame.moveArray;
    },
    currentTurn: function() {
        return Session.get('currentTurn');
    }
});
