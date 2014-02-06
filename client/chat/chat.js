chatCollection = new Meteor.Collection(null);
$('#chatMessages').scrollTop($('#chatMessages').scrollHeight);
getUsername = function(id) {
  Meteor.subscribe('user-info', id);
  Deps.autorun(function() {
    var user = Meteor.users.findOne(id);
    if(user) {
      Session.set('user-' + id, user.username);
    }
  });
}

chatStream.on('chat', function(message) {
    getUsername(this.userId);
    var uname = Session.get('user-' + this.userId);
  chatCollection.insert({
    username: uname, //this is the userId of the sender
    subscriptionId: this.subscriptionId, //this is the subscriptionId of the sender
    message: message
  });
});

Template.chat.events({
  'keypress .chatArea': function (evt) {    
    var messageText = $trim('#chatMessage').val();
    if (messageText.length > 1)  {
      if (evt.which === 13)
      {
        chatCollection.insert({
          username: Meteor.user().username,
          message: messageText
        });
        $('#chatMessage').val('');
        chatStream.emit('chat', messageText);
      }
    };
  },

  'click #logout' : function () {
    Meteor.logout();
  }
});

Template.chat.helpers({
  chatMessage: function() {
    return chatCollection.find({});
  }
})

