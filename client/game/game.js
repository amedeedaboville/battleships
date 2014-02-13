Deps.autorun(function (){
    //Meteor.subscribe('games', Meteor.userId());
    //var currentGame = gameCollection.findOne({active: true}, {});
    var currentGame = new Game(Meteor.userId(), );
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
		$('#map-set-up-modal').modal('hide');
        //Draw the actual game
	}
    }
});
