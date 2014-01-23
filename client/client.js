chatStream = new Meteor.Stream('chat'); //This doesn't.
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
	},
	othersOnline: function() {
		Meteor.subscribe("userStatus");
		return Meteor.users.find({"status.online": false}, {username:true}).fetch();
	}

});



Template.lobby.events({
  'click input' : function () {
    // template data, if any, is available in 'this'
    if (typeof console !== 'undefined')
  console.log("You pressed the button");
  }
});

Template.messages.messages = function () {
  return Messages.find({}, { sort: { time: -1 }});
}
sendChat = function(message) {
  chatStream.emit('message', message);
  console.log('me: ' + message);
};

chatStream.on('message', function(message) {
  console.log('user: ' + message);
});
