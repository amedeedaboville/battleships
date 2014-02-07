mapStream.on(Meteor.userId(), function (message, opponent){
	if (message == 'add')
	{
		Session.set("enemy", opponent);
		$('#map-set-up-modal').modal();
	}
	else if (message == 'close')
	{
		delete Session.keys["enemy"];
		$('#map-set-up-modal').modal('hide');
	}
	
	else if (message == 'new')
	{
		//alter grid
		$('.gamegrid').empty();
		

	}
	else if (message == 'done')
	{
		//redirect to game...
		$('#map-set-up-modal').modal('hide');
	}
});
