Messages = new Meteor.Collection('messages'); //This uses Mongodb to store the messages.

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });

//publish online users to be used by the client
Meteor.publish("userStatus", function() {
  return Meteor.users.find({"status.online": true}, {emails:true});
});

}
