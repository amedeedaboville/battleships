Meteor.publish("userStatus", function() {
  return Meteor.users.find({"status.online": true}, {emails:true});
});

chatStream.permissions.read(function(eventName) {
    return eventName == 'chat';
});
 
chatStream.permissions.write(function(eventName) {
    return eventName == 'chat';
});
