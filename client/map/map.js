Deps.autorun(function (){
	mapStream.on(Meteor.userId(), function (message, opponent){
	console.log("I am: " + Meteor.userId() + " and the other is: " + opponent);
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

});
