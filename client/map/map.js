Deps.autorun(function (){
    Meteor.subscribe('games', Meteor.userId());
    var currentGame = gameCollection.findOne({}, {active: true});

	if (!currentGame.active)
	{
		//delete Session.keys["enemy"];
		$('#map-set-up-modal').modal('hide');
        //hide the game elements
	}
    else if (!currentGame.mapAccepted) {
        $('#map-set-up-modal').modal();
	}
	else if (currentGame.mapAccepted)
	{
		$('#map-set-up-modal').modal('hide');
        //Draw the actual game
	}
});
