Template.userProfile.helpers({
  user: function () {
    return Session.get("currentProfile");
  }
})

