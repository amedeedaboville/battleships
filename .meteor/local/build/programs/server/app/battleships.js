(function(){Messages = new Meteor.Collection('messages'); //This uses Mongodb to store the messages.
chatStream = new Meteor.Stream('chat'); //This doesn't.
if (Meteor.isClient) {
  Template.hello.greeting = function () {
    return "Welcome to battleships.";
  };

  Template.hello.events({
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
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}

})();
