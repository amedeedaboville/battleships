chatCollection = new Meteor.Collection(null);
chatStream.on('chat', function(message) {
    chatCollection.insert({
          userId: this.userId, //this is the userId of the sender
          subscriptionId: this.subscriptionId, //this is the subscriptionId of the sender
          message: message
        });
});
Template.lobby.greeting = function () {
  return "Welcome to battleships.";
};

Template.lobby.username = function () {

  return Meteor.user().username;

};

Template.lobby.helpers({
	friendsOnline: function() {
		Meteor.subscribe("userStatus");
		return Meteor.users.find({"status.online": true}, {username:true}).fetch();
	}
});
Template.chat.helpers({
        chatMessage: function() {
                return chatCollection.find();
        }
})


Template.chat.events({
  'click #sendMessage' : function () {
          var messageText = $('#chatMessage').val();
          chatCollection.insert({
              username: Meteor.user().username,
              message: messageText
          });
          $('#chatMessage').val('');
  },

  'click #logout' : function () {
   Meteor.logout();
  }
});


function getRandomInt (min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
}

Template.userProfile.helpers({
  user: function () {
    return Session.get("currentProfile");
  }
})

Template.grid.helpers({
  rows: function () {
    var grid = [];
    //build the sea
    for(var i = 0; i < 30; i++) {
      grid[i] = [];
      for( j = 0; j < 30; j++) {
        grid[i].push("sea");
      }
    }
    for(var i = 0; i < 10; i++) {
      grid[i+10][0]  = "bluebase";
      grid[i+10][29] = "redbase";
    }
    
    var coralSpots = [];
    while(coralSpots.length < 24) {
      var newSpot = [getRandomInt(3,26), getRandomInt(10,20)];
      var spotAlreadyPicked = false;
      for(var i = 0; i < coralSpots.length; i++) {
        if(coralSpots[i][0] == newSpot[0] && coralSpots[i][1] == newSpot[1]) {
          spotAlreadyPicked  = true;
          break;
        }
      }
      if (!spotAlreadyPicked) {
        coralSpots.push(newSpot);
        grid[newSpot[0]][newSpot[1]] = "coral";

      }
    }
  //  console.log(coralSpots);
//return [
//       ['sea', 'sea', 'sea'], 
//       ['sea', 'sea', 'sea'], 
//       ['sea', 'sea', 'sea']
//       ]
    return grid;
}});


Template.lobby.events({
  'click .onlineplayers' : function () {
	 Session.set("currentProfile", Meteor.users.findOne({_id: this._id}))
     //Sets the global variable to be all of the information for the user
     //we just clicked on. Looks up the user with _this.id
  },
  'click #logout' : function () {
   Meteor.logout();
  }
});


Template.messages.messages = function () {
  return Messages.find({}, { sort: { time: -1 }});
}
