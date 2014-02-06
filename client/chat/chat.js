chatCollection = new Meteor.Collection(null);
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
  'click #sendMessage' : function () {
      var messageText = $('#chatMessage').val();
      if (messageText.length > 1) {
        chatCollection.insert({
          user: Meteor.user().username,
          message: messageText
        });
        $('#chatMessage').val('');
        chatStream.emit('chat', messageText);
      };
  },

  'keypress .chatArea': function (evt) {
    if (evt.which === 13) {
      var messageText = $('#chatMessage').val();
      if (messageText.length > 1) {
        chatCollection.insert({
          user: Meteor.user().username,
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
    return chatCollection.find({}, {limit: 10});
  }
})

