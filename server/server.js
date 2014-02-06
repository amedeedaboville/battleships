Meteor.publish("userStatus", function() {
  return Meteor.users.find({"status.online": true}, {emails:true});
});
Meteor.publish("user-info", function(id) {
    return Meteor.users.find({_id: id}, {fields: {username: 1}});
});

chatStream.permissions.read(function(eventName) {
    return eventName == 'chat';
});
 
chatStream.permissions.write(function(eventName) {
    return eventName == 'chat';
});
