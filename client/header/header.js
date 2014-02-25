Template.header.username = function () {
    return Meteor.user().username;
};

Template.header.events({
    'click #logoutButton' : function () {
        Session.set("inGame", false);
        Meteor.logout();
    }
});