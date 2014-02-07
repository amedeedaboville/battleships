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

/**inviteStream: controls the flow between clients for the invitation process**/

//only targeted clients can listen to the invitation response
inviteStream.permissions.read(function(eventName) {
    return eventName == this.userId;
});

//any client can send an event
inviteStream.permissions.write(function(eventName) {
    return true;
});


/**Stream: controls the flow between clients for the creation of map configurations**/

serverStream.permissions.read(function(eventName) {
    return eventName == 'generate-map' || eventName == 'closeMap' || eventName == 'newMap' || eventName == 'doneMap';
});
 
serverStream.permissions.write(function(eventName) {
    return true;
});

//serverStream: responses
serverStream.on('generate-map', function (thisUser, otherUser){
    mapStream.emit(thisUser, 'add', otherUser);
    mapStream.emit(otherUser, 'add', thisUser);
});

serverStream.on('closeMap', function (thisUser, otherUser){
    mapStream.emit(thisUser, 'close', otherUser);
    mapStream.emit(otherUser, 'close', thisUser);
});

serverStream.on('newMap', function (thisUser, otherUser){
    mapStream.emit(thisUser, 'new', otherUser);
    mapStream.emit(otherUser, 'new', thisUser);
});

serverStream.on('doneMap', function (thisUser, otherUser){
    mapStream.emit(thisUser, 'done', otherUser);
    mapStream.emit(otherUser, 'done', thisUser);
});


/**Stream: controls the flow between clients for the creation of map configurations**/

mapStream.permissions.read(function(eventName) {
    return eventName == this.userId || eventName == this.subscriptionId;
});
 
mapStream.permissions.write(function(eventName) {
    return true;
});

	
