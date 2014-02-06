Template.lobby.username = function () {
  return Meteor.user().username;
};

Template.lobby.helpers({
  friendsOnline: function() {
    Meteor.subscribe("userStatus");
    return Meteor.users.find({"status.online": true}, {username:true}).fetch();
  }
});
Template.lobby.events({
  'mouseover .onlineplayers' : function () {
    Session.set("currentProfile", Meteor.users.findOne({_id: this._id}))
  //Sets the global variable to be all of the information for the user
  //we just clicked on. Looks up the user with _this.id
  },
  'click .inviteButton' : function () {
    Session.set("currentProfile", Meteor.users.findOne({_id: this._id}))
    sendInvite(this._id);
  //Sets the global variable to be all of the information for the user
  //we just clicked on. Looks up the user with _this.id
  },
  'click #logoutButton' : function () {
    Meteor.logout();
  }
});
