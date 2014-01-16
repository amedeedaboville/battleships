Messages = new Meteor.Collection('messages'); //This uses Mongodb to store the messages.

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
