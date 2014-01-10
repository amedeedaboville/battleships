chatStream = new Meteor.Stream('chat');
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
